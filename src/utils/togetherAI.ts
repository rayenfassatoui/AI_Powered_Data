import Together from "together-ai";

// Initialize Together AI client
const together = new Together({ 
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY || '' 
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
  try {
    // Remove markdown code block markers and any text before/after the JSON
    let cleanedText = text;
    
    // Remove markdown formatting
    cleanedText = cleanedText.replace(/```json\s*/g, '');
    cleanedText = cleanedText.replace(/```\s*/g, '');
    
    // Find the first { and last }
    const startIndex = cleanedText.indexOf('{');
    const endIndex = cleanedText.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('No JSON object found in response');
    }
    
    // Extract just the JSON part
    cleanedText = cleanedText.slice(startIndex, endIndex + 1);
    
    // Remove any trailing commas before closing brackets/braces
    cleanedText = cleanedText.replace(/,(\s*[}\]])/g, '$1');
    
    // Replace "..." with empty array
    cleanedText = cleanedText.replace(/,?\s*\.{3}\s*(?=[\]}])/g, '');
    
    // Try to parse to validate JSON
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
      return await fetch('https://api.together.xyz/inference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOGETHER_API_KEY}`
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3-70b-chat-hf',
          prompt,
          max_tokens: 2048,
          temperature: 0.1,
          top_p: 0.95,
          repetition_penalty: 1,
          stop: ['</s>']
        })
      });
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process data with AI');
    }

    const result = await response.json();
    const cleanedData = cleanJsonResponse(result.output.content);
    const parsedData = JSON.parse(cleanedData);

    return {
      success: true,
      data: parsedData,
      summary: `Successfully cleaned ${chunk.length} records`
    };
  } catch (error) {
    console.error('Error in processDataChunk:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process data chunk'
    };
  }
}
