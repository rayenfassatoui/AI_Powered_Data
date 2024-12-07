import Together from "together-ai";

// Initialize Together AI client with server-side API key
const together = new Together({ 
  apiKey: process.env.TOGETHER_API_KEY || '' // Changed to TOGETHER_API_KEY (not NEXT_PUBLIC)
});

// Rate limiting configuration
const RETRY_DELAY = 1000; // 1 second
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 5000; // 5 seconds
const MAX_RETRY_DELAY = 3600000; // 1 hour

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff(
  operation: () => Promise<any>,
  retries: number = MAX_RETRIES
): Promise<any> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && error instanceof Error && 
        (error.message.includes('429') || error.message.includes('quota'))) {
      console.log(`Rate limited, retrying in ${RETRY_DELAY}ms... (${retries} retries left)`);
      await wait(RETRY_DELAY);
      return retryWithBackoff(operation, retries - 1);
    }
    throw error;
  }
}

async function processWithRetry(func: () => Promise<any>, attempt = 1): Promise<any> {
  try {
    return await func();
  } catch (error) {
    if (error instanceof Error && 
        error.message.includes('rate limit exceeded') && 
        attempt <= MAX_RETRIES) {
      // Calculate delay with exponential backoff
      const delay = Math.min(
        INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1),
        MAX_RETRY_DELAY
      );
      
      console.log(`Rate limit hit, waiting ${delay/1000} seconds before retry ${attempt}/${MAX_RETRIES}`);
      await wait(delay);
      return processWithRetry(func, attempt + 1);
    }
    throw error;
  }
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function cleanJsonResponse(text: string): string {
  if (!text) {
    throw new Error('Empty response received from AI');
  }

  try {
    // Log the original text for debugging
    console.log('Original response:', text);

    // Remove markdown code block markers and any text before/after the JSON
    let cleanedText = text.trim();
    
    // Remove markdown formatting
    cleanedText = cleanedText.replace(/^```json\s*/m, '');
    cleanedText = cleanedText.replace(/^```\s*/m, '');
    cleanedText = cleanedText.replace(/```$/m, '');
    
    // Trim any whitespace
    cleanedText = cleanedText.trim();
    
    // If the text starts with '[', assume it's already a JSON array
    if (cleanedText.startsWith('[')) {
      try {
        // Try to parse as is
        JSON.parse(cleanedText);
        return cleanedText;
      } catch (e) {
        // If parsing fails, continue with additional cleaning
        console.log('Initial parse failed, continuing with cleaning');
      }
    }

    // Find the first [ and last ]
    const startIndex = cleanedText.indexOf('[');
    const endIndex = cleanedText.lastIndexOf(']');
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('No JSON array found in response');
    }
    
    // Extract just the JSON array part
    cleanedText = cleanedText.slice(startIndex, endIndex + 1);
    
    // Remove any trailing commas before closing brackets
    cleanedText = cleanedText.replace(/,(\s*[\]}])/g, '$1');
    
    // Remove any ellipsis
    cleanedText = cleanedText.replace(/\.{3},?/g, '');
    
    // Log the cleaned text for debugging
    console.log('Cleaned text:', cleanedText);

    // Validate the JSON
    JSON.parse(cleanedText);
    
    return cleanedText;
  } catch (error) {
    console.error('Original text:', text);
    console.error('Cleaning error:', error);
    throw new Error(`Failed to extract valid JSON: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
  }
}

export async function cleanDataWithAI(data: any[]) {
  try {
    // Ensure data is properly parsed as JSON
    let jsonData: any[];
    try {
      // If data is a string, try to parse it
      if (typeof data === 'string') {
        jsonData = JSON.parse(data);
      } else if (Array.isArray(data)) {
        // If data is already an array, stringify and parse to ensure valid JSON
        jsonData = JSON.parse(JSON.stringify(data));
      } else {
        throw new Error('Input data must be an array or JSON string');
      }

      // Validate that we have an array
      if (!Array.isArray(jsonData)) {
        throw new Error('Data must be an array of objects');
      }
    } catch (parseError) {
      console.error('Error parsing data:', parseError);
      return {
        success: false,
        error: `Invalid data format: ${parseError instanceof Error ? parseError.message : 'Failed to parse data'}`
      };
    }

    // If data is large, process it in chunks
    const CHUNK_SIZE = 25; // Reduced chunk size
    if (jsonData.length > CHUNK_SIZE) {
      const chunks = chunkArray(jsonData, CHUNK_SIZE);
      let cleanedData: any[] = [];
      let summaries: string[] = [];

      for (let index = 0; index < chunks.length; index++) {
        const chunk = chunks[index];
        console.log(`Processing chunk ${index + 1}/${chunks.length}`);
        const result = await processDataChunk(chunk);
        if (result.success) {
          cleanedData = [...cleanedData, ...result.data];
          if (result.summary) {
            summaries.push(result.summary);
          }
        } else {
          throw new Error(result.error);
        }
        // Add delay between chunks to avoid rate limits
        if (index < chunks.length - 1) await wait(RETRY_DELAY);
      }

      return {
        success: true,
        data: cleanedData,
        summary: `Processed ${chunks.length} chunks of data.\n${summaries.join('\n')}`,
      };
    }

    // For smaller datasets, process all at once
    return await processDataChunk(jsonData);
  } catch (error) {
    console.error('Error cleaning data with AI:', error);
    return {
      success: false,
      error: error instanceof Error 
        ? `Failed to clean data: ${error.message}` 
        : 'Failed to clean data',
    };
  }
}

async function processDataChunk(chunk: any[]): Promise<{ success: boolean; data?: any[]; error?: string; summary?: string }> {
  try {
    const prompt = `Clean and standardize the following data. Convert specific columns to proper types:
    Numbers: Age, Customer ID, Review Rating, Previous Purchases, Purchase Amount
    Booleans: Promo Code Used, Discount Applied, Subscription Status
    Return ONLY a valid JSON array with the cleaned data.
    Input data: ${JSON.stringify(chunk)}`;

    const response = await processWithRetry(async () => {
      return await together.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a data cleaning assistant. Return only valid JSON arrays with cleaned data."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        max_tokens: 2048,
        temperature: 0.1,
        top_p: 0.95,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["<|eot_id|>", "<|eom_id|>"],
        stream: false // Set to false since we want the complete response
      });
    });

    if (!response?.choices?.[0]?.message?.content) {
      console.error('Invalid API Response Structure:', response);
      throw new Error('Empty or invalid response from AI service');
    }

    const cleanedData = cleanJsonResponse(response.choices[0].message.content);
    const parsedData = JSON.parse(cleanedData);

    if (!Array.isArray(parsedData)) {
      throw new Error('AI response is not a valid array');
    }

    return {
      success: true,
      data: parsedData,
      summary: `Successfully cleaned ${chunk.length} records`
    };
  } catch (error) {
    console.error('Error in processDataChunk:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process data chunk'
    };
  }
}
