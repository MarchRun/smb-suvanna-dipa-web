/**
 * Textarea Component
 * Reusable textarea with consistent styling
 * Matches Input component design
 */

'use client'

import { useDarkMode } from '@/hooks/useDarkMode'

interface TextareaProps {
    label?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    placeholder?: string
    required?: boolean
    error?: string
    disabled?: boolean
    rows?: number
    maxLength?: number
    showCharCount?: boolean
    helperText?: string
    className?: string
}

export default function Textarea({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    error,
    disabled = false,
    rows = 4,
    maxLength,
    showCharCount = false,
    helperText,
    className = ''
}: TextareaProps) {
    const isDarkMode = useDarkMode()

    const borderColor = isDarkMode ? '#ea580c' : '#7c2d12'
    const textColor = isDarkMode ? '#ea580c' : '#7c2d12'

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                maxLength={maxLength}
                className={`w-full px-4 py-3 rounded-2xl border-2 font-semibold transition-all resize-none
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-orange-500
                           disabled:opacity-50 disabled:cursor-not-allowed
                           ${error ? 'border-red-500' : ''}`}
                style={{
                    borderColor: error ? '#ef4444' : borderColor
                }}
            />
            <div className="flex justify-between items-center mt-1">
                <div>
                    {error && (
                        <p className="text-red-500 text-xs">{error}</p>
                    )}
                    {helperText && !error && (
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{helperText}</p>
                    )}
                </div>
                {showCharCount && maxLength && (
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                        {value.length}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    )
}
