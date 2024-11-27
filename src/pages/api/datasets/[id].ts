import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid dataset ID' });
  }

  // Check if the dataset exists and belongs to the user
  const dataset = await prisma.dataset.findFirst({
    where: { 
      id,
      userId: session.user.id 
    }
  });

  if (!dataset) {
    return res.status(404).json({ message: 'Dataset not found' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        // Return the dataset with its data
        return res.status(200).json({
          ...dataset,
          data: dataset.data || []
        });
      }

      case 'DELETE': {
        await prisma.dataset.delete({
          where: { id }
        });
        return res.status(200).json({ message: 'Dataset deleted successfully' });
      }

      default:
        res.setHeader('Allow', ['GET', 'DELETE']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Dataset operation error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
