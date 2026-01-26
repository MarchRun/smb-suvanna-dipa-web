/**
 * Shared Card Component
 * Reusable card container used across all portals
 * Wireframe style with responsive padding
 */

interface CardProps {
    children: React.ReactNode
    className?: string
    hoverable?: boolean
    customStyle?: React.CSSProperties
}

export default function Card({
    children,
    className = "",
    hoverable = false,
    customStyle = {}
}: CardProps) {
    const hoverStyles = hoverable ? "hover:scale-105 transition-all duration-300" : ""

    return (
        <div
            className={`rounded-2xl p-4 sm:p-6 ${hoverStyles} ${className}`}
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
