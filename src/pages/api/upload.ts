import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { authOptions } from './auth/[...nextauth]';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized - Please sign in' });
  }

  try {
    const { fileContent, fileName, fileType } = req.body;

    if (!fileContent || !fileName || !fileType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let parsedData;
    if (fileType === 'csv') {
      // Decode base64 content
      const decodedContent = Buffer.from(fileContent, 'base64').toString('utf-8');
      const result = Papa.parse(decodedContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        transform: (value) => value.trim(),
      });

      if (result.errors.length > 0) {
        console.error('CSV parsing errors:', result.errors);
        return res.status(400).json({ 
          message: 'Error parsing CSV file',
          errors: result.errors
        });
      }

      parsedData = result.data;
      
      // Validate parsed data
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        return res.status(400).json({ message: 'No valid data found in CSV file' });
      }

      // Log for debugging
      console.log('Parsed CSV data:', {
        rowCount: parsedData.length,
        columnCount: Object.keys(parsedData[0] || {}).length,
        firstRow: parsedData[0]
      });

    } else if (fileType === 'xlsx') {
      try {
        const workbook = XLSX.read(fileContent, { type: 'base64' });
        const sheetName = workbook.SheetNames[0];
        parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
          raw: false,
          defval: ''
        });

        // Convert array format to object format with headers
        const headers = parsedData[0];
        parsedData = parsedData.slice(1).map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header.trim()] = (row[index] || '').toString().trim();
          });
          return obj;
        });

        // Log for debugging
        console.log('Parsed XLSX data:', {
          rowCount: parsedData.length,
          columnCount: headers.length,
          firstRow: parsedData[0]
        });

      } catch (xlsxError) {
        console.error('XLSX parsing error:', xlsxError);
        return res.status(400).json({ message: 'Error parsing XLSX file' });
      }
    } else {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    // Final validation
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      return res.status(400).json({ message: 'No valid data found in file' });
    }

    const dataset = await prisma.dataset.create({
      data: {
        name: fileName,
        type: fileType,
        data: parsedData,
        userId: session.user.id,
      },
    });

    return res.status(200).json(dataset);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      message: 'Error processing file',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
