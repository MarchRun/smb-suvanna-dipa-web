/**
 * Image Modal Component
 * Fullscreen modal to view images (for "Lihat" button)
 * Now using Modal wrapper component
 */

'use client'

interface ImageModalProps {
    isOpen: boolean
    imageUrl: string
    caption?: string
    onClose: () => void
}

export default function ImageModal({ isOpen, imageUrl, caption, onClose }: ImageModalProps) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center text-white z-10"
                title="Close (ESC)"
                aria-label="Close"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Image */}
            <div
                className="max-w-5xl max-h-[90vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageUrl}
                    alt={caption || 'Image'}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />

                {caption && (
                    <p className="mt-4 text-white text-center text-lg font-semibold">
                        {caption}
                    </p>
                )}
            </div>
        </div>
    )
}
