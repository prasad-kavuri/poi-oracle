/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable Turbopack (Next.js 16 default)
  turbopack: {},
  
  // Image optimization (updated syntax)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdnjs.cloudflare.com',
      },
    ],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_USE_LLM: process.env.NEXT_PUBLIC_USE_LLM || 'false',
    NEXT_PUBLIC_LLM_PROVIDER: process.env.NEXT_PUBLIC_LLM_PROVIDER || 'ollama',
    NEXT_PUBLIC_OLLAMA_URL: process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434/v1',
    NEXT_PUBLIC_OLLAMA_MODEL: process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'llama3.2',
  },
}

module.exports = nextConfig
