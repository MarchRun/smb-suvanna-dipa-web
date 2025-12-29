/**
 * Stat Card Component
 * Displays a statistic with title and value
 * Used for dashboard widgets (Status Presensi, Jumlah Siswa, etc.)
 */

'use client'

import { useState, useEffect } from 'react'

interface StatCardProps {
    title: string
    value: string | number
    icon?: React.ReactNode
    className?: string
}

export default function StatCard({ title, value, icon, className = '' }: StatCardProps) {
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

    const cardBg = isDarkMode ? '#374151' : '#6b7280'
    const textColor = '#ffffff'

    return (
        <div
            className={`p-4 md:p-6 rounded-xl transition-all duration-300 hover:scale-105 ${className}`}
            style={{
                backgroundColor: cardBg,
                boxShadow: isDarkMode
                    ? '0 4px 15px rgba(0, 0, 0, 0.3)'
                    : '0 4px 15px rgba(0, 0, 0, 0.15)'
            }}
        >
            {/* Icon (optional) */}
            {icon && (
                <div className="mb-3 text-white/80">
                    {icon}
                </div>
            )}

            {/* Title */}
            <h3
                className="text-sm md:text-base font-medium mb-2"
                style={{ color: textColor }}
            >
                {title}
            </h3>

            {/* Value */}
            <p
                className="text-2xl md:text-3xl font-bold"
                style={{ color: textColor }}
            >
                {value}
            </p>
        </div>
    )
}
