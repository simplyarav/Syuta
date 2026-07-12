import { Redis } from '@upstash/redis'

// Validate environment variables
if (!process.env.UPSTASH_REDIS_REST_URL) {
  console.warn("UPSTASH_REDIS_REST_URL is not set. Inventory locking will bypass if missing in dev.");
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://dummy.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy',
})

// LUA Script for atomic reservation
// KEYS[1] = stock:reserved:{productId}
// ARGV[1] = max_stock (from mongodb)
// ARGV[2] = requested_quantity
// Returns 1 if successful, 0 if it would exceed max_stock
export const RESERVE_STOCK_SCRIPT = `
  local current_reserved = tonumber(redis.call("GET", KEYS[1]) or "0")
  local max_stock = tonumber(ARGV[1])
  local requested = tonumber(ARGV[2])
  
  if current_reserved + requested <= max_stock then
    redis.call("INCRBY", KEYS[1], requested)
    return 1
  else
    return 0
  end
`;
