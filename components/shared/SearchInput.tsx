/**
 * Search Input Component
 * Input with search icon and debounce
 */

'use client'

import { useState, useEffect, useCallback } from 'react'

interface SearchInputProps {
    placeholder?: string
    value?: string
    onChange: (value: string) => void
    debounceMs?: number
    className?: string
}

export default function SearchInput({
    placeholder = 'Cari...',
    value = '',
    onChange,
    debounceMs = 300,
    className = ''
}: SearchInputProps) {
    const [inputValue, setInputValue] = useState(value)

    // Debounce the onChange callback
    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(inputValue)
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [inputValue, debounceMs, onChange])

    // Sync external value changes
    useEffect(() => {
        setInputValue(value)
    }, [value])

    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                         transition-all duration-200"
            />
            <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </div>
    )
}
