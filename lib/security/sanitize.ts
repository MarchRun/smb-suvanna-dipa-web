/**
 * Input Sanitization Utilities
 * Prevents XSS, SQL Injection, and other injection attacks
 */

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(input: string): string {
    if (!input) return ''

    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
}

/**
 * Sanitize SQL input (basic - Supabase handles this, but extra layer)
 */
export function sanitizeSql(input: string): string {
    if (!input) return ''

    // Remove common SQL injection patterns
    return input
        .replace(/['";]/g, '') // Remove quotes and semicolons
        .replace(/--/g, '') // Remove SQL comments
        .replace(/\/\*/g, '') // Remove multi-line comment start
        .replace(/\*\//g, '') // Remove multi-line comment end
        .replace(/xp_/gi, '') // Remove SQL Server extended procedures
        .replace(/sp_/gi, '') // Remove SQL Server stored procedures
        .trim()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate phone number (Indonesian format)
 */
export function isValidPhone(phone: string): boolean {
    // Indonesian phone: 08xx-xxxx-xxxx or +628xx-xxxx-xxxx
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
    return phoneRegex.test(phone.replace(/[-\s]/g, ''))
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
    if (!filename) return ''

    return filename
        .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
        .replace(/\.{2,}/g, '.') // Remove multiple dots
        .replace(/^\.+/, '') // Remove leading dots
        .substring(0, 255) // Limit length
}

/**
 * Validate file type
 */
export function isValidFileType(filename: string, allowedTypes: string[]): boolean {
    const ext = filename.split('.').pop()?.toLowerCase()
    return ext ? allowedTypes.includes(ext) : false
}

/**
 * Validate file size
 */
export function isValidFileSize(size: number, maxSize: number): boolean {
    return size > 0 && size <= maxSize
}

/**
 * Sanitize URL to prevent open redirect
 */
export function sanitizeUrl(url: string, allowedDomains: string[] = []): string | null {
    try {
        const parsed = new URL(url)

        // Only allow http and https
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return null
        }

        // Check if domain is allowed (if specified)
        if (allowedDomains.length > 0) {
            const isAllowed = allowedDomains.some(domain =>
                parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
            )
            if (!isAllowed) return null
        }

        return parsed.toString()
    } catch {
        return null
    }
}

/**
 * Validate and sanitize user input for profiles
 */
export function sanitizeProfileInput(data: {
    full_name?: string
    phone?: string
    address?: string
    email?: string
}): {
    full_name?: string
    phone?: string
    address?: string
    email?: string
    errors: string[]
} {
    const errors: string[] = []
    const sanitized: any = {}

    if (data.full_name) {
        sanitized.full_name = sanitizeHtml(data.full_name.trim())
        if (sanitized.full_name.length < 2) {
            errors.push('Nama lengkap minimal 2 karakter')
        }
        if (sanitized.full_name.length > 100) {
            errors.push('Nama lengkap maksimal 100 karakter')
        }
    }

    if (data.email) {
        sanitized.email = data.email.toLowerCase().trim()
        if (!isValidEmail(sanitized.email)) {
            errors.push('Format email tidak valid')
        }
    }

    if (data.phone) {
        sanitized.phone = data.phone.replace(/[-\s]/g, '')
        if (!isValidPhone(sanitized.phone)) {
            errors.push('Format nomor telepon tidak valid')
        }
    }

    if (data.address) {
        sanitized.address = sanitizeHtml(data.address.trim())
        if (sanitized.address.length > 500) {
            errors.push('Alamat maksimal 500 karakter')
        }
    }

    return { ...sanitized, errors }
}
