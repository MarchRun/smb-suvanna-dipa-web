/**
 * Select Component
 * Reusable dropdown select with consistent styling
 * Matches Input component design
 */

'use client'

import { useDarkMode } from '@/hooks/useDarkMode'

interface SelectOption {
    value: string | number
    label: string
}

interface SelectProps {
    label?: string
    value: string | number
    onChange: (value: string) => void
    options: SelectOption[]
    placeholder?: string
    required?: boolean
    error?: string
    disabled?: boolean
    helperText?: string
    className?: string
}

export default function Select({
    label,
    value,
    onChange,
    options,
    placeholder = 'Pilih...',
    required = false,
    error,
    disabled = false,
    helperText,
    className = ''
}: SelectProps) {
    const isDarkMode = useDarkMode()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value)
    }

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
            <select
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className={`w-full px-4 py-2.5 rounded-full border-2 font-semibold transition-all
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-orange-500
                           disabled:opacity-50 disabled:cursor-not-allowed
                           ${error ? 'border-red-500' : ''}`}
                style={{
                    borderColor: error ? '#ef4444' : borderColor
                }}
            >
                {/* Only show placeholder if no option with empty value exists */}
                {placeholder && !options.some(o => o.value === '') && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={String(option.value)} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{helperText}</p>
            )}
        </div>
    )
}
