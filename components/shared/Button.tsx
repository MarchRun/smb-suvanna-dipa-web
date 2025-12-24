/**
 * Shared Button Component - Warm Sunny Theme
 * Reusable button with warm orange/yellow colors
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
    const baseStyles = "px-4 py-2 sm:px-6 sm:py-3 font-semibold border-2 transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"

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
                    background: disabled ? '#cbd5e1' : 'linear-gradient(135deg, var(--primary-500), var(--accent-500))',
                    borderColor: disabled ? '#cbd5e1' : 'var(--primary-600)'
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
