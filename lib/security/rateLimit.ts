/**
 * Rate Limiting Utility
 * Prevents brute force attacks and API abuse
 */

interface RateLimitStore {
    [key: string]: {
        count: number
        resetTime: number
    }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
    interval: number // in milliseconds
    maxRequests: number
}

/**
 * Rate limiter function
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns true if request is allowed, false if rate limited
 */
export function rateLimit(
    identifier: string,
    config: RateLimitConfig = { interval: 60000, maxRequests: 10 } // Default: 10 requests per minute
): { success: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const key = identifier

    // Clean up expired entries
    if (store[key] && store[key].resetTime < now) {
        delete store[key]
    }

    // Initialize or get current state
    if (!store[key]) {
        store[key] = {
            count: 0,
            resetTime: now + config.interval
        }
    }

    const current = store[key]

    // Check if limit exceeded
    if (current.count >= config.maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetTime: current.resetTime
        }
    }

    // Increment count
    current.count++

    return {
        success: true,
        remaining: config.maxRequests - current.count,
        resetTime: current.resetTime
    }
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
    // Try to get IP from various headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')

    const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'

    return ip
}

/**
 * Clean up old entries periodically
 */
setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach(key => {
        if (store[key].resetTime < now) {
            delete store[key]
        }
    })
}, 60000) // Clean up every minute
