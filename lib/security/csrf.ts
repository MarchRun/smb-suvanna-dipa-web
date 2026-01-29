import { randomBytes } from 'crypto'

const CSRF_TOKEN_LENGTH = 32
const CSRF_TOKEN_EXPIRY = 3600000

interface CsrfTokenStore {
    [key: string]: {
        token: string
        expiresAt: number
    }
}

const tokenStore: CsrfTokenStore = {}

export function generateCsrfToken(sessionId: string): string {
    const token = randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
    const expiresAt = Date.now() + CSRF_TOKEN_EXPIRY

    tokenStore[sessionId] = {
        token,
        expiresAt
    }

    cleanupExpiredTokens()

    return token
}

export function validateCsrfToken(sessionId: string, token: string): boolean {
    const stored = tokenStore[sessionId]

    if (!stored) {
        return false
    }

    if (stored.expiresAt < Date.now()) {
        delete tokenStore[sessionId]
        return false
    }

    const isValid = stored.token === token

    if (isValid) {
        delete tokenStore[sessionId]
    }

    return isValid
}

function cleanupExpiredTokens() {
    const now = Date.now()
    Object.keys(tokenStore).forEach(key => {
        if (tokenStore[key].expiresAt < now) {
            delete tokenStore[key]
        }
    })
}

setInterval(cleanupExpiredTokens, 300000)
