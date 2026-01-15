import { useState, useEffect } from 'react'

/**
 * Custom hook to detect dark mode state
 * Observes changes to document.documentElement.classList
 * @returns boolean - true if dark mode is active, false otherwise
 */
export function useDarkMode(): boolean {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'))
        }

        // Initial check
        checkDarkMode()

        // Watch for changes via MutationObserver
        const observer = new MutationObserver(checkDarkMode)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })

        // Cleanup
        return () => observer.disconnect()
    }, [])

    return isDarkMode
}
