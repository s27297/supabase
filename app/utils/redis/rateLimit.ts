import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

export const apiRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests per minute per key
    analytics: true,
    prefix: 'ratelimit:api',
})