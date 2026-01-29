interface RateLimitStore {
    [key: string]: {
        count: number
        resetTime: number
    }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
    interval: number
    maxRequests: number
}

export function rateLimit(
    identifier: string,
    config: RateLimitConfig = { interval: 60000, maxRequests: 10 }
): { success: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const key = identifier

    if (store[key] && store[key].resetTime < now) {
        delete store[key]
    }

    if (!store[key]) {
        store[key] = {
            count: 0,
            resetTime: now + config.interval
        }
    }

    const current = store[key]

    if (current.count >= config.maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetTime: current.resetTime
        }
    }

    current.count++

    return {
        success: true,
        remaining: config.maxRequests - current.count,
        resetTime: current.resetTime
    }
}

export function getClientIdentifier(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')

    const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'

    return ip
}

setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach(key => {
        if (store[key].resetTime < now) {
            delete store[key]
        }
    })
}, 60000)
