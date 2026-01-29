'use client'

import React from 'react'

// --- Card Component ---
export interface CardProps {
    children: React.ReactNode
    className?: string
    hoverable?: boolean
    customStyle?: React.CSSProperties
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({
    children,
    className = "",
    hoverable = false,
    customStyle = {},
    padding = 'md'
}: CardProps) {
    const hoverStyles = hoverable ? "hover:scale-105 transition-all duration-300" : ""

    const paddingStyles = {
        none: 'p-0',
        sm: 'p-3 sm:p-4',
        md: 'p-4 sm:p-6',
        lg: 'p-6 sm:p-8'
    }

    return (
        <div
            className={`rounded-2xl ${paddingStyles[padding]} ${hoverStyles} ${className}`}
            style={{
                backgroundColor: 'var(--bg-primary)',
                border: 'none',
                ...customStyle
            }}
        >
            {children}
        </div>
    )
}

// --- StatCard Component ---
export interface StatCardProps {
    title: string
    value: string | number
    icon?: React.ReactNode
    className?: string
    loading?: boolean
}

export function StatCard({ title, value, icon, className = '', loading = false }: StatCardProps) {
    const cardBg = '#E57526'
    const textColor = '#ffffff'

    return (
        <div
            className={`p-4 md:p-6 rounded-xl transition-all duration-300 hover:scale-105 ${className}`}
            style={{
                backgroundColor: cardBg,
                boxShadow: '0 4px 15px rgba(229, 117, 38, 0.3)'
            }}
        >
            {icon && (
                <div className="mb-3 text-white/80 text-center">
                    {icon}
                </div>
            )}

            <h3
                className="text-2xl md:text-3xl font-bold mb-2 text-center"
                style={{ color: textColor }}
            >
                {title}
            </h3>

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
