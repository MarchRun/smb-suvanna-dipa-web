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
        <div className={`bg-gray-300 border-2 border-gray-400 rounded flex items-center justify-center ${aspectRatioClasses[aspectRatio]} ${className}`}>
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-600">
                {text}
            </span>
        </div>
    )
}
