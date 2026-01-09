/**
 * Filter Dropdown Component
 * Dropdown for filtering data
 */

'use client'

interface FilterOption {
    label: string
    value: string | number | null
}

interface FilterDropdownProps {
    label: string
    options: FilterOption[]
    value: string | number | null
    onChange: (value: string | number | null) => void
    className?: string
}

export default function FilterDropdown({
    label,
    options,
    value,
    onChange,
    className = ''
}: FilterDropdownProps) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <select
                value={value ?? ''}
                onChange={(e) => {
                    const val = e.target.value
                    if (val === '') {
                        onChange(null)
                    } else if (!isNaN(Number(val))) {
                        onChange(Number(val))
                    } else {
                        onChange(val)
                    }
                }}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                         transition-all duration-200 cursor-pointer"
            >
                {options.map((option) => (
                    <option key={String(option.value)} value={option.value ?? ''}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
