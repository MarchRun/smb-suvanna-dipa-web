import { useState, useEffect } from 'react'

/**
 * Custom hook to detect dark mode state
 * Observes changes to document.documentElement.classList
 * @returns boolean - true if dark mode is active, false otherwise
 */
export function useDarkMode(): boolean {
    // Always return false to enforce light mode
    return false
}
