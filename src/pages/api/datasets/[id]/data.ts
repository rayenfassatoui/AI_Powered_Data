import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET': {
        const user = await prisma.user.findUnique({
          where: { email: session.user?.email }
        });

        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        const dataset = await prisma.dataset.findFirst({
          where: { 
            id: String(id),
            userId: user.id
          }
        });

        if (!dataset) {
          return res.status(404).json({ message: 'Dataset not found' });
        }

        // Return the data array from the JSON field
        return res.status(200).json(dataset.data || []);
      }

      case 'PUT': {
        const user = await prisma.user.findUnique({
          where: { email: session.user?.email }
        });

        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        const dataset = await prisma.dataset.findFirst({
          where: { 
            id: String(id),
            userId: user.id
          }
        });

        if (!dataset) {
          return res.status(404).json({ message: 'Dataset not found' });
        }

        const newData = req.body;
        if (!Array.isArray(newData)) {
          return res.status(400).json({ error: 'Invalid data format' });
        }

        // Update the dataset with the new data
        await prisma.dataset.update({
          where: { id: String(id) },
          data: {
            data: newData,
            updatedAt: new Date()
          }
        });

        return res.status(200).json({ message: 'Dataset updated successfully' });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Dataset operation error:', error);
    return res.status(500).json({ error: 'Failed to process dataset operation' });
  }
}
