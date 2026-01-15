/**
 * Color Helper Utilities
 * Provides consistent color values across light/dark modes
 * Ensures uniform dark mode appearance between public and dashboard systems
 */

/**
 * Get text color based on dark mode state
 * Uses consistent orange/brown theme for all systems
 */
export function getTextColor(isDarkMode: boolean): string {
    return isDarkMode ? '#ea580c' : '#7c2d12' // primary-600 dark : primary-900 light
}

/**
 * Get border color based on dark mode state
 */
export function getBorderColor(isDarkMode: boolean): string {
    return isDarkMode ? '#ea580c' : '#7c2d12'
}

/**
 * Get background color for cards/containers
 */
export function getCardBackground(isDarkMode: boolean): string {
    return isDarkMode ? '#1f2937' : '#ffffff' // gray-800 : white
}

/**
 * Get page background color
 */
export function getPageBackground(isDarkMode: boolean): string {
    return isDarkMode ? '#111827' : '#ffffff' // gray-900 : white
}

/**
 * Get button background based on variant and dark mode
 */
export function getButtonColor(
    variant: 'primary' | 'secondary' | 'danger',
    isDarkMode: boolean
): string {
    const colors = {
        primary: isDarkMode ? '#ea580c' : '#7c2d12', // Orange/Brown
        secondary: isDarkMode ? '#fbbf24' : '#fbbf24', // Yellow (same for both modes)
        danger: isDarkMode ? '#dc2626' : '#b91c1c' // Red
    }
    return colors[variant]
}

/**
 * Get CSS variable for consistent theme usage
 * Recommended: Use this instead of hardcoded colors
 */
export function getCSSVariable(variableName: string): string {
    if (typeof window === 'undefined') return ''
    return getComputedStyle(document.documentElement).getPropertyValue(variableName)
}
