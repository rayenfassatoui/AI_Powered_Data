import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { cleanDataWithAI } from '@/utils/togetherAI';
import prisma from '@/lib/prisma';

const MAX_PAYLOAD_SIZE = 10 * 1024 * 1024; // 10MB limit

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication using getServerSession
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Please sign in to access this endpoint' });
    }

    // Check request size
    if (req.headers['content-length'] && 
        parseInt(req.headers['content-length']) > MAX_PAYLOAD_SIZE) {
      return res.status(413).json({ error: 'Payload too large' });
    }

    const { data, datasetId } = req.body;

    // Validate required fields
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data format. Expected an array.' });
    }

    if (!datasetId) {
      return res.status(400).json({ error: 'Dataset ID is required' });
    }

    if (data.length === 0) {
      return res.status(400).json({ error: 'Empty dataset provided.' });
    }

    // Get original dataset
    const originalDataset = await prisma.dataset.findUnique({
      where: { 
        id: datasetId 
      },
      select: { 
        name: true, 
        type: true, 
        userId: true 
      }
    });

    if (!originalDataset) {
      return res.status(404).json({ error: 'Original dataset not found' });
    }

    if (originalDataset.userId !== session.user?.id) {
      return res.status(403).json({ error: 'Not authorized to clean this dataset' });
    }

    // Clean data using Together AI
    const result = await cleanDataWithAI(data);

    if (!result.success) {
      return res.status(500).json({ 
        error: result.error || 'Failed to clean data'
      });
    }

    // Create new cleaned dataset
    const cleanedDataset = await prisma.dataset.create({
      data: {
        name: `${originalDataset.name} (cleaned)`,
        type: originalDataset.type,
        data: result.data,
        cleaned: true,
        tag: "cleaned",  // Set tag to "cleaned" for cleaned datasets
        userId: session.user.id
      }
    });

    return res.status(200).json({
      data: result.data,
      summary: result.summary,
      cleanedDatasetId: cleanedDataset.id
    });
  } catch (error) {
    console.error('Error in clean-data API:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}
