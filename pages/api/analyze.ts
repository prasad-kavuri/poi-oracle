import type { NextApiRequest, NextApiResponse } from 'next';
import { analyzeQuery } from '../../utils/aiReasoning';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, queryType } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Analyze the query using AI reasoning + ground truth
    const result = await analyzeQuery(query, queryType);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze query',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
