import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function rateLimit(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
  const key = `rate-limit:${ip}`;
  
  const current = await redis.get<number>(key) || 0;
  
  // Rate limit: 60 requests per minute
  if (current > 60) {
    return false;
  }
  
  await redis.setex(key, 60, current + 1);
  return true;
} 