/**
 * Rate limiting utility for Next.js API routes using Vercel KV
 * This implementation uses a Redis-compatible key-value store for persistent rate limiting
 * that works effectively in serverless environments like Vercel.
 */

import { kv } from '@vercel/kv';

interface RateLimitConfig {
  interval: number;   // Time window in milliseconds
  maxRequests: number; // Maximum number of requests allowed per interval
}

/**
 * Rate limiting function for Next.js API routes using Vercel KV
 * 
 * @param ip - The IP address to rate limit
 * @param config - Rate limiting configuration
 * @returns A Promise resolving to an object with isLimited, reset, and remaining properties
 */
export async function rateLimit(
  ip: string, 
  config: RateLimitConfig = {
    interval: 60 * 1000, // 1 minute default
    maxRequests: 5       // 5 requests per minute default
  }
): Promise<{ isLimited: boolean, reset: number, remaining: number }> {
  // Create a unique key for this IP and rate limit type
  const key = `ratelimit:contact:${ip}`;
  const now = Date.now();
  const windowStart = now - config.interval;
  
  try {
    // Get current requests for this IP within the time window
    const requests = await kv.zrange(key, windowStart, '+inf', { 
      byScore: true 
    }) as string[];
    
    // Clean up old entries (outside the current time window)
    await kv.zremrangebyscore(key, 0, windowStart - 1);
    
    // Check if rate limited
    const isLimited = requests.length >= config.maxRequests;
    
    // Add current request timestamp if not limited
    if (!isLimited) {
      // Add a score (timestamp) with the current timestamp as the member
      await kv.zadd(key, { score: now, member: now.toString() });
      
      // Set TTL on the key to auto-expire (typically 2x the interval for safety)
      await kv.expire(key, Math.ceil(config.interval / 1000) * 2);
    }
    
    // Calculate when the rate limit resets
    const oldestTimestamp = requests.length > 0 ? parseInt(requests[0]) : now;
    const reset = Math.max(0, oldestTimestamp + config.interval - now);
    
    // Calculate remaining requests
    const remaining = Math.max(0, config.maxRequests - requests.length);
    
    return { isLimited, reset, remaining };
  } catch (error) {
    // Log the error but don't block the request if KV has an issue
    console.error('Rate limiting error:', error);
    
    // Fallback behavior - allow the request to proceed
    return { isLimited: false, reset: 0, remaining: config.maxRequests };
  }
}

/**
 * Helper function to get the client IP from a Next.js request
 * 
 * @param req - Next.js request object
 * @returns The client IP address
 */
export function getClientIp(req: Request): string {
  // Try to get the real IP if behind a proxy
  const forwarded = req.headers.get('x-forwarded-for');
  
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list of IPs
    // The client's IP is the first one
    return forwarded.split(',')[0].trim();
  }
  
  // Fall back to the connecting IP
  return '127.0.0.1'; // Default for local development
}
