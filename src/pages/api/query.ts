import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import * as dfd from 'danfojs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { datasetId, query } = req.body;

    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Convert JSON data to DataFrame
    const df = new dfd.DataFrame(dataset.data);
    
    // Process the query and generate visualization
    const visualization = await processQuery(df, query);

    return res.status(200).json({ visualization });
  } catch (error) {
    console.error('Query error:', error);
    return res.status(500).json({ message: 'Error processing query' });
  }
}

async function processQuery(df: dfd.DataFrame, query: string) {
  // Basic query processing logic
  const words = query.toLowerCase().split(' ');
  
  // Default to showing the first numeric column over time
  let xKey = df.columns[0];
  let yKey = df.columns.find(col => df[col].dtype === 'float32' || df[col].dtype === 'int32') || df.columns[1];
  let type: 'line' | 'bar' | 'pie' = 'line';
  
  // Simple NLP rules
  if (words.includes('compare') || words.includes('comparison')) {
    type = 'bar';
  } else if (words.includes('distribution') || words.includes('breakdown')) {
    type = 'pie';
  }
  
  // Extract column names from query
  df.columns.forEach(col => {
    if (query.toLowerCase().includes(col.toLowerCase())) {
      if (!yKey || yKey === xKey) {
        yKey = col;
      } else {
        xKey = col;
      }
    }
  });

  // Prepare data for visualization
  const data = df.toJSON();

  return {
    type,
    data,
    xKey,
    yKey,
    title: `${yKey} by ${xKey}`,
  };
}
