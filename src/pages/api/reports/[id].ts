import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';

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

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid report ID' });
  }

  switch (req.method) {
    case 'DELETE':
      try {
        // First check if the report exists and belongs to the user
        const report = await prisma.report.findFirst({
          where: {
            id,
            userId: user.id
          }
        });

        if (!report) {
          return res.status(404).json({ message: 'Report not found' });
        }

        // Delete the report
        await prisma.report.delete({
          where: { id }
        });

        return res.status(200).json({ message: 'Report deleted successfully' });
      } catch (error) {
        console.error('Error deleting report:', error);
        return res.status(500).json({ message: 'Error deleting report' });
      }

    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
