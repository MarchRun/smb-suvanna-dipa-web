/**
 * Security Headers Configuration
 * Implements security best practices via HTTP headers
 */

export function getSecurityHeaders(): Record<string, string> {
    return {
        // Prevent clickjacking
        'X-Frame-Options': 'DENY',

        // Prevent MIME type sniffing
        'X-Content-Type-Options': 'nosniff',

        // Enable XSS protection (legacy browsers)
        'X-XSS-Protection': '1; mode=block',

        // Referrer policy
        'Referrer-Policy': 'strict-origin-when-cross-origin',

        // Permissions policy (restrict features)
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

        // Content Security Policy
        'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline/eval
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; '),

        // Strict Transport Security (HTTPS only)
        // Note: Only enable in production with HTTPS
        // 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(headers: Headers): Headers {
    const securityHeaders = getSecurityHeaders()

    Object.entries(securityHeaders).forEach(([key, value]) => {
        headers.set(key, value)
    })

    return headers
}
