/**
 * Shared Button Component
 * Reusable button used across all portals
 * Wireframe style with responsive sizing
 */

'use client'

interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
    fullWidth?: boolean
    disabled?: boolean
    className?: string
}

export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    fullWidth = false,
    disabled = false,
    className = ''
}: ButtonProps) {
    const baseStyles = "px-4 py-2 sm:px-6 sm:py-3 font-medium border-2 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"

    const variantStyles = {
        primary: "bg-gray-600 text-white border-black hover:bg-gray-700 disabled:hover:bg-gray-600",
        secondary: "bg-white text-black border-black hover:bg-gray-100 disabled:hover:bg-white"
    }

    const widthStyle = fullWidth ? "w-full" : ""

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
        >
            {children}
        </button>
    )
}
