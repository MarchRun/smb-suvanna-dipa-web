/**
 * Formatting Utilities
 * Centralized functions for common formatting operations
 */

/**
 * Get current year for copyright notices
 * @returns Current year as number
 */
export function getCurrentYear(): number {
    return new Date().getFullYear()
}

/**
 * Format date to Indonesian locale
 * @param date - Date object or ISO string
 * @returns Formatted date string in Indonesian locale
 */
export function formatDateIndonesian(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

/**
 * Get ISO date string for database storage
 * @param date - Optional date, defaults to now
 * @returns ISO date string
 */
export function toISODateString(date?: Date): string {
    return (date || new Date()).toISOString()
}

/**
 * Normalize email address (lowercase + trim)
 * @param email - Email address
 * @returns Normalized email
 */
export function normalizeEmail(email: string): string {
    return email.toLowerCase().trim()
}

/**
 * Get initials from full name
 * @param name - Full name
 * @returns Initials (e.g., "John Doe" -> "JD")
 */
export function getInitials(name: string): string {
    if (!name || !name.trim()) return '?'

    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase()
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
}

/**
 * Format file size in human-readable format
 * @param bytes - Size in bytes
 * @returns Formatted size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('id-ID')
}
