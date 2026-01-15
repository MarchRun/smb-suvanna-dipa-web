/**
 * Enhanced Footer - Matching Navbar Theme
 * Simplified with animated gradient background
 */

'use client'

import { useDarkMode } from '@/hooks/useDarkMode'
import { getCurrentYear } from '@/lib/utils/formatters'

export default function Footer() {
    const isDarkMode = useDarkMode()
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
                        © {getCurrentYear()} SMB Suvanna Dipa. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
