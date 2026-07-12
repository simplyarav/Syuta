import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// Create a new ratelimiter that allows 5 requests per 10 seconds for auth endpoints
export const authRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit:auth",
});

// Create a ratelimiter for checkout to prevent spam order creation
export const checkoutRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit:checkout",
});

// Create a ratelimiter for webhooks to prevent abuse
export const webhookRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit:webhook",
});

// Create a ratelimiter for admin actions
export const adminRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit:admin",
});
