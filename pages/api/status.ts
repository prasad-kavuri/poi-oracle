import type { NextApiRequest, NextApiResponse } from 'next';
import { testLLMConnection } from '../../utils/llmIntegration';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const llmConnected = await testLLMConnection();
    
    return res.status(200).json({ 
      llmConnected,
      mode: llmConnected ? 'llm' : 'simulation'
    });
  } catch (error) {
    return res.status(200).json({ 
      llmConnected: false,
      mode: 'simulation'
    });
  }
}
