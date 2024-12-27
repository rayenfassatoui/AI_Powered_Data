import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { authOptions } from './auth/[...nextauth]';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized - Please sign in' });
    }

    // Create uploads directory in /tmp for production
    const uploadsDir = process.env.NODE_ENV === 'production' 
      ? path.join('/tmp', 'uploads')
      : path.join(process.cwd(), 'uploads');

    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
    } catch (error) {
      console.error('Error creating uploads directory:', error);
      return res.status(500).json({ message: 'Server configuration error' });
    }

    console.log('Processing upload request...');
    console.log('Uploads directory:', uploadsDir);

    // Configure formidable
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      uploadDir: uploadsDir,
      keepExtensions: true,
      multiples: false,
    });

    // Parse the form
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          reject(err);
          return;
        }
        console.log('Parsed form data:', { fields: Object.keys(fields), files: Object.keys(files) });
        resolve([fields, files]);
      });
    });

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploadedFile) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Processing file:', {
      name: uploadedFile.originalFilename,
      type: uploadedFile.mimetype,
      size: uploadedFile.size,
      path: uploadedFile.filepath
    });

    // Read and process file
    try {
      const fileContent = fs.readFileSync(uploadedFile.filepath);
      let data;

      const fileExt = path.extname(uploadedFile.originalFilename || '').toLowerCase();
      console.log('File extension:', fileExt);
      
      if (fileExt === '.csv' || uploadedFile.mimetype === 'text/csv') {
        console.log('Processing as CSV file');
        const csvText = fileContent.toString();
        const parseResult = Papa.parse(csvText, { 
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),
          error: (error) => {
            console.error('CSV parsing error:', error);
            throw new Error('Error parsing CSV file: ' + error.message);
          }
        });
        
        if (parseResult.errors.length > 0) {
          console.error('CSV parsing errors:', parseResult.errors);
          throw new Error('Error parsing CSV file: ' + parseResult.errors[0].message);
        }
        
        data = parseResult.data;
      } else if (fileExt === '.xlsx' || fileExt === '.xls') {
        console.log('Processing as Excel file');
        try {
          const workbook = XLSX.read(fileContent);
          const sheetName = workbook.SheetNames[0];
          data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        } catch (error) {
          console.error('Excel parsing error:', error);
          throw new Error('Error parsing Excel file: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      } else {
        throw new Error('Unsupported file format. Please upload a CSV or Excel file.');
      }

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No valid data found in file');
      }

      console.log('Parsed data rows:', data.length);

      // Save to database
      const dataset = await prisma.dataset.create({
        data: {
          name: uploadedFile.originalFilename || 'Untitled Dataset',
          type: fileExt === '.csv' ? 'csv' : 'excel',
          data: data,
          userId: session.user.id,
        },
      });

      console.log('Dataset saved to database:', dataset.id);

      // Clean up the temporary file
      try {
        fs.unlinkSync(uploadedFile.filepath);
      } catch (error) {
        console.error('Error deleting temporary file:', error);
      }

      return res.status(200).json({ 
        message: 'File uploaded successfully',
        datasetId: dataset.id
      });
    } catch (error) {
      console.error('File processing error:', error);
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Error processing file',
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      message: 'Error processing upload',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
