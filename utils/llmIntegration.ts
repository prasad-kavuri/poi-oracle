import OpenAI from 'openai';

// LLM Configuration
const USE_LLM = process.env.NEXT_PUBLIC_USE_LLM === 'true';
const LLM_PROVIDER = process.env.NEXT_PUBLIC_LLM_PROVIDER || 'ollama';
const OLLAMA_BASE_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434/v1';
const OLLAMA_MODEL = process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'llama3.2';

export interface LLMQueryAnalysis {
  location: string;
  businessType: string;
  contextualFactors: string[];
  marketInsights: string;
  keyAssumptions: string[];
}

// Initialize OpenAI client (works with Ollama via OpenAI-compatible API)
const getClient = () => {
  if (LLM_PROVIDER === 'ollama') {
    return new OpenAI({
      baseURL: OLLAMA_BASE_URL,
      apiKey: 'ollama', // Ollama doesn't need a real key
      dangerouslyAllowBrowser: true,
    });
  } else if (LLM_PROVIDER === 'openai') {
    return new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }
  return null;
};

// System prompt for spatial intelligence analysis
const SYSTEM_PROMPT = `You are POI Oracle, an expert spatial intelligence AI specialized in location analysis for businesses in India and Africa.

Your task is to analyze business location queries and extract structured information. Always respond with valid JSON in this exact format:
{
  "location": "city name (e.g., Bangalore, Delhi, Nairobi)",
  "businessType": "type of business (e.g., Chai Stall, Pharmacy, Restaurant)",
  "contextualFactors": ["factor1", "factor2", "factor3"],
  "marketInsights": "A detailed 2-3 sentence analysis of the market opportunity",
  "keyAssumptions": ["assumption1", "assumption2", "assumption3"]
}

Focus on:
1. Identifying the exact target location and business type
2. Understanding contextual factors (IT parks, residential areas, foot traffic patterns)
3. Making realistic assumptions about the business environment
4. Providing actionable market insights based on spatial reasoning

Be specific about Indian/African market dynamics when relevant.`;

export async function analyzeSpatialQuery(query: string): Promise<LLMQueryAnalysis> {
  // Check if LLM is disabled or provider is simulate
  if (!USE_LLM || LLM_PROVIDER === 'simulate') {
    return simulateAnalysis(query);
  }

  try {
    const client = getClient();
    if (!client) {
      console.log('No LLM client configured, using simulation');
      return simulateAnalysis(query);
    }

    const response = await client.chat.completions.create({
      model: LLM_PROVIDER === 'ollama' ? OLLAMA_MODEL : 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query }
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from LLM');
    }

    // Parse JSON response (handle markdown code blocks if present)
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.slice(7);
    }
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.slice(3);
    }
    if (jsonContent.endsWith('```')) {
      jsonContent = jsonContent.slice(0, -3);
    }
    
    const analysis = JSON.parse(jsonContent.trim());
    return analysis;

  } catch (error) {
    console.error('LLM analysis failed:', error);
    console.log('Falling back to simulation mode');
    return simulateAnalysis(query);
  }
}

// Fallback simulation for when LLM is unavailable
function simulateAnalysis(query: string): LLMQueryAnalysis {
  const queryLower = query.toLowerCase();
  
  // Extract location
  let location = "Bangalore";
  const cities = [
    "bangalore", "bengaluru", "delhi", "mumbai", "nairobi", "hyderabad", 
    "kenya", "chennai", "pune", "kolkata", "ahmedabad", "jaipur"
  ];
  for (const city of cities) {
    if (queryLower.includes(city)) {
      location = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }
  
  // Extract business type
  let businessType = "Business";
  const businessTypes: { [key: string]: string } = {
    'chai': 'Chai Stall',
    'tea': 'Tea Shop',
    'coffee': 'Coffee Shop',
    'pharmacy': 'Pharmacy',
    'medical': 'Medical Store',
    'restaurant': 'Restaurant',
    'food': 'Food Outlet',
    'gym': 'Fitness Center',
    'school': 'Educational Institution',
    'bank': 'Banking Services',
    'atm': 'ATM',
    'salon': 'Beauty Salon',
    'spa': 'Wellness Spa',
    'grocery': 'Grocery Store',
    'supermarket': 'Supermarket'
  };
  
  for (const [keyword, type] of Object.entries(businessTypes)) {
    if (queryLower.includes(keyword)) {
      businessType = type;
      break;
    }
  }
  
  // Extract contextual factors
  const contextualFactors: string[] = [];
  if (queryLower.includes('it park') || queryLower.includes('tech park')) {
    contextualFactors.push('Proximity to IT/Tech Parks');
  }
  if (queryLower.includes('residential')) {
    contextualFactors.push('Residential Area Focus');
  }
  if (queryLower.includes('underserved') || queryLower.includes('gap')) {
    contextualFactors.push('Market Gap Analysis Required');
  }
  if (queryLower.includes('commercial')) {
    contextualFactors.push('Commercial Zone Priority');
  }
  if (queryLower.includes('metro') || queryLower.includes('transit')) {
    contextualFactors.push('Metro/Transit Accessibility');
  }
  if (contextualFactors.length === 0) {
    contextualFactors.push('General Commercial Viability', 'Foot Traffic Potential');
  }
  
  // Generate market insights
  const marketInsights = `Analyzing optimal locations for ${businessType} in ${location}. ${
    contextualFactors.length > 0 
      ? `Key considerations include ${contextualFactors.slice(0, 2).join(' and ').toLowerCase()}. `
      : ''
  }The analysis will identify high-footfall areas with good accessibility, visibility, and demographic alignment for your target customer base.`;
  
  // Generate key assumptions
  const keyAssumptions = [
    `High demand areas are concentrated near major ${contextualFactors.includes('Proximity to IT/Tech Parks') ? 'IT parks and tech corridors' : 'commercial zones'}`,
    `${businessType} performs best in areas with consistent daily foot traffic patterns`,
    `Peak business hours align with ${contextualFactors.includes('Proximity to IT/Tech Parks') ? '8-10 AM and 6-8 PM (IT crowd)' : 'standard 9 AM - 6 PM working hours'}`,
    `Competition density in target area is moderate to high`
  ];
  
  return {
    location,
    businessType,
    contextualFactors,
    marketInsights,
    keyAssumptions
  };
}

// Test LLM connectivity
export async function testLLMConnection(): Promise<boolean> {
  if (!USE_LLM || LLM_PROVIDER === 'simulate') {
    return false;
  }

  try {
    const client = getClient();
    if (!client) return false;

    await client.chat.completions.create({
      model: LLM_PROVIDER === 'ollama' ? OLLAMA_MODEL : 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 5,
    });

    return true;
  } catch (error) {
    console.error('LLM connection test failed:', error);
    return false;
  }
}
