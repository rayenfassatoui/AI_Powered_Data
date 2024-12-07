import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { calculateMetrics, generateVisualizations } from '@/utils/dataProcessing';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const reports = await prisma.report.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          include: {
            dataset: {
              select: {
                name: true,
                type: true
              }
            }
          }
        });

        // Parse JSON fields
        const parsedReports = reports.map(report => ({
          ...report,
          metrics: JSON.parse(report.metrics as string),
          visualizations: JSON.parse(report.visualizations as string)
        }));

        return res.status(200).json(parsedReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
        return res.status(500).json({ message: 'Error fetching reports' });
      }

    case 'POST':
      try {
        const { title, description, datasetId, exportFormat = 'pdf', orientation = 'portrait', includeRawData = false } = req.body;

        // Validate required fields
        if (!title || !description || !datasetId) {
          return res.status(400).json({ message: 'Missing required fields' });
        }

        // Get the dataset
        const dataset = await prisma.dataset.findFirst({
          where: {
            id: datasetId,
            userId: user.id
          }
        });

        if (!dataset) {
          return res.status(404).json({ message: 'Dataset not found' });
        }

        // Calculate metrics and generate visualizations
        const processedMetrics = calculateMetrics(dataset);
        const processedVisualizations = generateVisualizations(dataset);

        const report = await prisma.report.create({
          data: {
            title,
            content: description,
            metrics: JSON.stringify(processedMetrics),
            visualizations: JSON.stringify(processedVisualizations),
            exportFormat,
            orientation,
            includeRawData,
            status: 'draft',
            userId: user.id,
            datasetId
          },
          include: {
            dataset: {
              select: {
                name: true,
                type: true
              }
            }
          }
        });

        return res.status(201).json({
          ...report,
          metrics: processedMetrics,
          visualizations: processedVisualizations
        });
      } catch (error) {
        console.error('Error creating report:', error);
        return res.status(500).json({ message: 'Error creating report' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
