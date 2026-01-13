/**
 * Stat Card Component
 * Displays a statistic with title and value
 * Used for dashboard widgets (Status Presensi, Jumlah Siswa, etc.)
 * Color matches textColor from theme
 */

'use client'

import { useState, useEffect } from 'react'

interface StatCardProps {
    title: string
    value: string | number
    icon?: React.ReactNode
    className?: string
    loading?: boolean
}

export default function StatCard({ title, value, icon, className = '', loading = false }: StatCardProps) {
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

    // Card background matches textColor (orange/brown)
    const cardBg = isDarkMode ? '#ea580c' : 'var(--primary-900)'
    const textColor = '#ffffff'

    return (
        <div
            className={`p-4 md:p-6 rounded-xl transition-all duration-300 hover:scale-105 ${className}`}
            style={{
                backgroundColor: cardBg,
                boxShadow: isDarkMode
                    ? '0 4px 15px rgba(234, 88, 12, 0.3)'
                    : '0 4px 15px rgba(124, 45, 18, 0.3)'
            }}
        >
            {/* Icon (optional) */}
            {icon && (
                <div className="mb-3 text-white/80 text-center">
                    {icon}
                </div>
            )}

            {/* Title - Centered, Bold, Same size as value */}
            <h3
                className="text-2xl md:text-3xl font-bold mb-2 text-center"
                style={{ color: textColor }}
            >
                {title}
            </h3>

            {/* Value - Centered */}
            <p
                className="text-2xl md:text-3xl font-bold text-center"
                style={{ color: textColor }}
            >
                {loading ? (
                    <span className="inline-block w-16 h-8 bg-white/20 rounded animate-pulse" />
                ) : (
                    value
                )}
            </p>
        </div>
    )
}
