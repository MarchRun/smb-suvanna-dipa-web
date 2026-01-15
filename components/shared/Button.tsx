/**
 * Shared Button Component - Warm Sunny Theme
 * Reusable button with warm orange/yellow colors
 */

'use client'

import React from 'react'
import { useDarkMode } from '@/hooks/useDarkMode'

interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
    fullWidth?: boolean
    disabled?: boolean
    className?: string
    noShadow?: boolean // Disable shadow effect
    customStyle?: React.CSSProperties // Custom inline styles
}

export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    fullWidth = false,
    disabled = false,
    className = '',
    noShadow = false,
    customStyle = {}
}: ButtonProps) {
    const isDarkMode = useDarkMode()
    const baseStyles = "px-4 py-2 sm:px-6 sm:py-3 font-semibold border-2 transition-all duration-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"

    const variantStyles = {
        primary: "text-white border-transparent hover:shadow-lg hover:scale-105",
        secondary: "bg-transparent hover:shadow-md"
    }

    const widthStyles = fullWidth ? "w-full" : ""

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`

    if (variant === 'primary') {
        return (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={combinedClassName}
                style={{
                    backgroundColor: disabled ? '#cbd5e1' : (isDarkMode ? 'var(--primary-600)' : 'var(--primary-900)'),
                    color: '#ffffff',
                    opacity: disabled ? 0.6 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    boxShadow: disabled || noShadow ? 'none' : '0 0 20px rgba(252, 211, 77, 0.8), 0 4px 15px rgba(124, 45, 18, 0.4)',
                    ...customStyle
                }}
            >
                {children}
            </button>
        )
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={combinedClassName}
            style={{
                color: 'var(--primary-600)',
                borderColor: 'var(--primary-600)'
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.background = 'var(--primary-100)'
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
            }}
        >
            {children}
        </button>
    )
}
