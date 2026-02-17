import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { env } from './env'
import { logger } from './logger'

type LimitConfig = {
  limit: number
  window: number
}

const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

const upstashLimiter =
  redis &&
  new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
  })

const memoryStore = new Map<string, { count: number; resetAt: number }>()

const getKey = (req: NextRequest, name: string) => {
  const forwarded =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || ''
  const ip = forwarded || 'unknown'
  return `${name}:${ip}`
}

export async function checkRateLimit(
  req: NextRequest,
  name: string,
  config: LimitConfig
) {
  const key = getKey(req, name)

  if (upstashLimiter) {
    const { success, limit, remaining, reset } = await upstashLimiter.limit(key)
    if (!success) {
      logger.warn('Rate limit exceeded', { name, key, limit, remaining, reset })
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.max(reset - Date.now(), 0).toString(),
          },
        }
      )
    }
    return null
  }

  const now = Date.now()
  const existing = memoryStore.get(key)
  if (!existing || existing.resetAt < now) {
    memoryStore.set(key, { count: 1, resetAt: now + config.window })
    return null
  }

  if (existing.count >= config.limit) {
    logger.warn('In-memory rate limit exceeded', { name, key })
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.max(existing.resetAt - now, 0).toString(),
        },
      }
    )
  }

  existing.count += 1
  memoryStore.set(key, existing)
  return null
}
