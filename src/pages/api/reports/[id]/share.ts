import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  try {
    const report = await prisma.report.findFirst({
      where: {
        id: id as string,
        user: {
          email: session.user.email
        }
      }
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Generate or retrieve share token
    let shareToken = report.shareToken;
    if (!shareToken) {
      shareToken = nanoid(10);
      await prisma.report.update({
        where: { id: id as string },
        data: { shareToken }
      });
    }

    // Generate share URL
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reports/shared/${shareToken}`;

    return res.status(200).json({ shareUrl });
  } catch (error) {
    console.error('Error sharing report:', error);
    return res.status(500).json({ message: 'Error sharing report' });
  }
}
