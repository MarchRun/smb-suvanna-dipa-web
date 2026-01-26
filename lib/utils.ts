import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format date to Indonesian locale (e.g., "SENIN, 20 MEI 2024")
 */
export function formatDateID(dateString: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', options || {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date).toUpperCase()
}

/**
 * Truncate text to a specific length
 */
export function truncateText(text: string, length: number): string {
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
}
