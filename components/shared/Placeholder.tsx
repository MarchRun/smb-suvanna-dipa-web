/**
 * Shared Placeholder Component
 * Gray boxes for image placeholders (GAMBAR, MAPS, etc.)
 * Responsive sizing
 */

interface PlaceholderProps {
    text: string
    aspectRatio?: '1:1' | '16:9' | '4:3' | '2:1'
    className?: string
}

export default function Placeholder({
    text,
    aspectRatio = '16:9',
    className = ""
}: PlaceholderProps) {
    const aspectRatioClasses = {
        '1:1': 'aspect-square',
        '16:9': 'aspect-[16/9]',
        '4:3': 'aspect-[4/3]',
        '2:1': 'aspect-[2/1]'
    }

    return (
        <div
            className={`rounded flex items-center justify-center ${aspectRatioClasses[aspectRatio]} ${className}`}
            style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '2px solid var(--primary-300)'
            }}
        >
            <span
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{ color: 'var(--primary-600)' }}
            >
                {text}
            </span>
        </div>
    )
}
