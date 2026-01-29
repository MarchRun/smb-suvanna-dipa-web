import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDateID(dateString: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', options || {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date).toUpperCase()
}

export function truncateText(text: string, length: number): string {
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
}

/**
 * Get current year for copyright notices
 */
export function getCurrentYear(): number {
    return new Date().getFullYear()
}

/**
 * Normalize email address (lowercase + trim)
 */
export function normalizeEmail(email: string): string {
    return email.toLowerCase().trim()
}
