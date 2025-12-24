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
    const hoverStyles = hoverable ? "hover:border-black transition-colors" : ""

    return (
        <div className={`bg-gray-300 border-2 border-gray-400 rounded p-4 sm:p-6 ${hoverStyles} ${className}`}>
            {children}
        </div>
    )
}
