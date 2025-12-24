/**
 * Shared Page Header Component
 * Reusable page title and subtitle for all pages
 * Responsive typography
 */

interface PageHeaderProps {
    title: string
    subtitle?: string
    align?: 'left' | 'center' | 'right'
}

export default function PageHeader({
    title,
    subtitle,
    align = 'center'
}: PageHeaderProps) {
    const alignmentClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }

    return (
        <div className={`mb-8 sm:mb-12 ${alignmentClass[align]}`}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3 sm:mb-4">
                {title}
            </h1>
            {subtitle && (
                <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto px-4">
                    {subtitle}
                </p>
            )}
        </div>
    )
}
