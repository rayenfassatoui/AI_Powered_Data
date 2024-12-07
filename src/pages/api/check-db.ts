import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Try to connect to the database
    await prisma.$connect();
    
    // Try a simple query
    const userCount = await prisma.user.count();
    
    return res.status(200).json({ 
      status: 'ok',
      message: 'Database connection successful',
      userCount 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
} 