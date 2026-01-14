/**
 * CSRF Protection Utility
 * Generates and validates CSRF tokens
 */

import { randomBytes } from 'crypto'

const CSRF_TOKEN_LENGTH = 32
const CSRF_TOKEN_EXPIRY = 3600000 // 1 hour in milliseconds

interface CsrfTokenStore {
    [key: string]: {
        token: string
        expiresAt: number
    }
}

const tokenStore: CsrfTokenStore = {}

/**
 * Generate CSRF token for a session
 */
export function generateCsrfToken(sessionId: string): string {
    const token = randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
    const expiresAt = Date.now() + CSRF_TOKEN_EXPIRY

    tokenStore[sessionId] = {
        token,
        expiresAt
    }

    // Clean up expired tokens
    cleanupExpiredTokens()

    return token
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(sessionId: string, token: string): boolean {
    const stored = tokenStore[sessionId]

    if (!stored) {
        return false
    }

    // Check if token expired
    if (stored.expiresAt < Date.now()) {
        delete tokenStore[sessionId]
        return false
    }

    // Validate token
    const isValid = stored.token === token

    // Remove token after validation (one-time use)
    if (isValid) {
        delete tokenStore[sessionId]
    }

    return isValid
}

/**
 * Clean up expired tokens
 */
function cleanupExpiredTokens() {
    const now = Date.now()
    Object.keys(tokenStore).forEach(key => {
        if (tokenStore[key].expiresAt < now) {
            delete tokenStore[key]
        }
    })
}

// Periodic cleanup
setInterval(cleanupExpiredTokens, 300000) // Every 5 minutes
