/**
 * Simple in-memory rate limiting utility for Next.js API routes
 * This implementation is meant as a fallback when Vercel KV is not available
 */

// In-memory storage for rate limiting (will reset on server restart)
// Not ideal for production, but better than nothing as a fallback
const inMemoryStore: Record<string, { timestamps: number[], lastReset: number }> = {};

interface RateLimitConfig {
  interval: number;   // Time window in milliseconds
  maxRequests: number; // Maximum number of requests allowed per interval
}

/**
 * Simple rate limiting function that uses in-memory storage
 * 
 * @param ip - The IP address to rate limit
 * @param config - Rate limiting configuration
 * @returns Object with isLimited, reset, and remaining properties
 */
export function simpleRateLimit(
  ip: string,
  config: RateLimitConfig = {
    interval: 60 * 1000, // 1 minute default
    maxRequests: 5       // 5 requests per minute default
  }
): { isLimited: boolean, reset: number, remaining: number } {
  const now = Date.now();
  const key = `ratelimit:free-sample:${ip}`;
  
  // Initialize store entry if needed
  if (!inMemoryStore[key]) {
    inMemoryStore[key] = {
      timestamps: [],
      lastReset: now
    };
  }
  
  const entry = inMemoryStore[key];
  
  // Check if we need to reset due to time passing
  if (now - entry.lastReset > config.interval) {
    entry.timestamps = [];
    entry.lastReset = now;
  }
  
  // Filter out timestamps outside the current window
  const windowStart = now - config.interval;
  entry.timestamps = entry.timestamps.filter(time => time >= windowStart);
  
  // Check if rate limited
  const isLimited = entry.timestamps.length >= config.maxRequests;
  
  // Add current request timestamp if not limited
  if (!isLimited) {
    entry.timestamps.push(now);
  }
  
  // Calculate remaining requests
  const remaining = Math.max(0, config.maxRequests - entry.timestamps.length);
  
  // Calculate when the rate limit resets
  let oldestTimestamp = entry.timestamps[0] || now;
  if (entry.timestamps.length > 0) {
    oldestTimestamp = Math.min(...entry.timestamps);
  }
  const reset = Math.max(0, oldestTimestamp + config.interval - now);
  
  return { isLimited, reset, remaining };
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
