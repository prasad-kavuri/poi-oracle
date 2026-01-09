import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint, model } = req.body;

  try {
    // Try to list models (works for Ollama)
    const response = await fetch(endpoint.replace('/v1', '/api/tags'), {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      return res.status(200).json({ connected: true });
    }

    // Fallback: try a simple completion
    const completionResponse = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5
      }),
      signal: AbortSignal.timeout(10000)
    });

    return res.status(200).json({ connected: completionResponse.ok });
  } catch (error) {
    return res.status(200).json({ connected: false });
  }
}
