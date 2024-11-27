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

      case 'PUT': {
        const { name, data } = req.body;

        // Prepare update data
        const updateData: any = {};
        
        // Handle name update
        if (name && typeof name === 'string') {
          updateData.name = name;
        }

        // Handle data update
        if (data && Array.isArray(data)) {
          // Validate data structure
          const isValidData = data.every(row => typeof row === 'object' && row !== null);
          if (!isValidData) {
            return res.status(400).json({ message: 'Invalid data format' });
          }
          updateData.data = data;
        }

        // If no valid update data provided
        if (Object.keys(updateData).length === 0) {
          return res.status(400).json({ message: 'No valid update data provided' });
        }

        // Add updatedAt timestamp
        updateData.updatedAt = new Date();

        try {
          const updatedDataset = await prisma.dataset.update({
            where: { id },
            data: updateData,
            select: {
              id: true,
              name: true,
              type: true,
              createdAt: true,
              updatedAt: true,
              data: true,
              userId: true
            }
          });

          return res.status(200).json(updatedDataset);
        } catch (error) {
          console.error('Error updating dataset:', error);
          return res.status(500).json({ message: 'Failed to update dataset' });
        }
      }

      case 'DELETE': {
        await prisma.dataset.delete({
          where: { id }
        });
        return res.status(200).json({ message: 'Dataset deleted successfully' });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Dataset operation error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
