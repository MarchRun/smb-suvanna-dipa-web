/**
 * Enhanced Footer - Matching Navbar Theme
 * Simplified with animated gradient background
 */

'use client'

import { useState, useEffect } from 'react'

export default function Footer() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Dark mode detection
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
        checkDarkMode()
        const observer = new MutationObserver(checkDarkMode)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })
        return () => observer.disconnect()
    }, [])
    return (
        <footer
            className="py-8"
            style={{
                backgroundColor: 'var(--accent-200)', // Solid warm yellow/orange
                boxShadow: '0 -4px 12px rgba(217, 87, 20, 0.20), 0 -2px 4px rgba(217, 87, 20, 0.12)'
            }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center">
                    <p
                        className="text-base font-bold"
                        style={{
                            color: isDarkMode ? 'var(--primary-600)' : 'var(--primary-900)', // Bright orange in dark, brownish in light
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        © {new Date().getFullYear()} SMB Suvanna Dipa. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
