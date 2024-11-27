import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;
    const format = req.query.format as string;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Fetch dataset
    const dataset = await prisma.dataset.findFirst({
      where: { 
        id: String(id),
        userId: user.id
      }
    });

    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    // Get data from JSON field
    const data = dataset.data as any[];

    switch (format) {
      case 'csv': {
        const parser = new Parser();
        const csv = parser.parse(data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${dataset.name}.csv`);
        return res.status(200).send(csv);
      }

      case 'json': {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=${dataset.name}.json`);
        return res.status(200).json(data);
      }

      case 'excel': {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        // Add headers
        if (data.length > 0) {
          worksheet.columns = Object.keys(data[0]).map(key => ({
            header: key,
            key: key,
            width: 15
          }));
        }

        // Add rows
        worksheet.addRows(data);

        // Style the header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
        };

        // Generate Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${dataset.name}.xlsx`);
        return res.status(200).send(buffer);
      }

      default:
        return res.status(400).json({ error: 'Invalid export format' });
    }
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ error: 'Failed to export dataset' });
  }
}
