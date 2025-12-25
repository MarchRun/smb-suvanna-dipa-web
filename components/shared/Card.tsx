/**
 * Shared Card Component
 * Reusable card container used across all portals
 * Wireframe style with responsive padding
 */

interface CardProps {
    children: React.ReactNode
    className?: string
    hoverable?: boolean
}

export default function Card({
    children,
    className = "",
    hoverable = false
}: CardProps) {
    const hoverStyles = hoverable ? "hover:shadow-xl hover:scale-[1.02] transition-all duration-300" : ""

    return (
        <div
            className={`rounded-lg p-4 sm:p-6 shadow-md ${hoverStyles} ${className}`}
            style={{
                backgroundColor: 'var(--bg-primary)',
                border: '2px solid var(--primary-200)'
            }}
        >
            {children}
        </div>
    )
}
