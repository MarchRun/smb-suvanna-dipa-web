/**
 * Validation Utilities
 * Centralized functions for common validation operations
 */

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns True if email format is valid
 */
export function isValidEmail(email: string): boolean {
    if (!email || !email.trim()) return false

    // Basic email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
}

/**
 * Check if string is empty after trimming whitespace
 * @param value - String to check
 * @returns True if empty after trim
 */
export function isEmpty(value: string | null | undefined): boolean {
    return !value || value.trim() === ''
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Validation result with errors if any
 */
export function isValidPassword(password: string): {
    valid: boolean
    errors: string[]
} {
    const errors: string[] = []

    if (!password || password.length < 8) {
        errors.push('Password harus minimal 8 karakter')
    }

    if (password && !/[a-z]/.test(password)) {
        errors.push('Password harus mengandung huruf kecil')
    }

    if (password && !/[A-Z]/.test(password)) {
        errors.push('Password harus mengandung huruf besar')
    }

    if (password && !/[0-9]/.test(password)) {
        errors.push('Password harus mengandung angka')
    }

    return {
        valid: errors.length === 0,
        errors
    }
}

/**
 * Validate required field
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Error message if invalid, null if valid
 */
export function validateRequired(
    value: string | null | undefined,
    fieldName: string
): string | null {
    if (isEmpty(value)) {
        return `${fieldName} harus diisi`
    }
    return null
}

/**
 * Validate minimum length
 * @param value - Value to validate
 * @param minLength - Minimum length required
 * @param fieldName - Name of the field for error message
 * @returns Error message if invalid, null if valid
 */
export function validateMinLength(
    value: string,
    minLength: number,
    fieldName: string
): string | null {
    if (value && value.trim().length < minLength) {
        return `${fieldName} harus minimal ${minLength} karakter`
    }
    return null
}

/**
 * Validate maximum length
 * @param value - Value to validate
 * @param maxLength - Maximum length allowed
 * @param fieldName - Name of the field for error message
 * @returns Error message if invalid, null if valid
 */
export function validateMaxLength(
    value: string,
    maxLength: number,
    fieldName: string
): string | null {
    if (value && value.length > maxLength) {
        return `${fieldName} maksimal ${maxLength} karakter`
    }
    return null
}

/**
 * Validate phone number format (Indonesian)
 * @param phone - Phone number to validate
 * @returns True if format is valid
 */
export function isValidPhoneNumber(phone: string): boolean {
    if (!phone || !phone.trim()) return false

    // Indonesian phone number pattern (starts with 08 or +62)
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/
    return phoneRegex.test(phone.replace(/\s+/g, ''))
}

/**
 * Validate number is positive
 * @param value - Number to validate
 * @param fieldName - Name of the field for error message
 * @returns Error message if invalid, null if valid
 */
export function validatePositiveNumber(
    value: number,
    fieldName: string
): string | null {
    if (value < 0) {
        return `${fieldName} harus angka positif`
    }
    return null
}
