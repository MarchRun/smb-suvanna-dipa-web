/**
 * Stats Grid Component
 * Responsive grid layout for displaying stat cards
 * Automatically handles responsive breakpoints and centering
 */

'use client'

interface StatsGridProps {
    children: React.ReactNode
    className?: string
    /**
     * Number of columns on large screens (default: 3)
     */
    columns?: 2 | 3 | 4
}

export default function StatsGrid({ children, className = '', columns = 3 }: StatsGridProps) {
    const gridCols = {
        2: 'lg:grid-cols-2',
        3: 'lg:grid-cols-3',
        4: 'lg:grid-cols-4'
    }

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols[columns]} gap-4 md:gap-6 ${className}`}>
            {children}
        </div>
    )
}
