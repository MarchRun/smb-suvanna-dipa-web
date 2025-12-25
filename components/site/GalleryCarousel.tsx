/**
 * Gallery Carousel Component
 * 3 image placeholders with navigation arrows
 * Simple carousel (static for now, can add interactivity later)
 */

'use client'

import { useState } from 'react'
import Placeholder from '@/components/shared/Placeholder'

export default function GalleryCarousel() {
    const [currentIndex, setCurrentIndex] = useState(1) // Start at middle image

    const images = [
        { id: 1, caption: 'Lorem Ipsum Dolor Sit Amet' },
        { id: 2, caption: 'Lorem Ipsum Dolor Sit Amet' },
        { id: 3, caption: 'Lorem Ipsum Dolor Sit Amet' }
    ]

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    return (
        <section
            className="py-12 sm:py-16 md:py-20"
            style={{
                backgroundColor: 'var(--bg-primary)' // Orange in light, dark blue in dark
            }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4"
                    style={{ color: 'var(--bg-primary)' }}
                >
                    Galeri Kegiatan SMB
                </h2>
                <p
                    className="text-base sm:text-lg text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
                    style={{ color: 'var(--neutral-100)' }}
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer venenatis iaculis porttitor. In ut velit euismod, cursus lorem vel, aliquam erat. Donec ut pellentesque elit. Morbi ipsum nulla, porttitor lacinia feugiat vel, pharetra ac sem.
                </p>

                {/* Carousel Container */}
                <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                        {/* Left Image (hidden on mobile) */}
                        <div className="hidden md:block">
                            <Placeholder
                                text="GAMBAR"
                                aspectRatio="4:3"
                            />
                            <p
                                className="text-sm text-center mt-2"
                                style={{ color: 'var(--neutral-200)' }}
                            >
                                {images[(currentIndex - 1 + images.length) % images.length].caption}
                            </p>
                        </div>

                        {/* Center Image (main focus) */}
                        <div className="relative">
                            {/* Previous Arrow */}
                            <button
                                onClick={goToPrevious}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                                style={{
                                    backgroundColor: 'var(--primary-500)', // Solid orange
                                    color: 'white'
                                }}
                                aria-label="Previous image"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <Placeholder
                                text="GAMBAR"
                                aspectRatio="4:3"
                            />
                            <p
                                className="text-base sm:text-lg font-medium text-center mt-3"
                                style={{ color: 'var(--bg-primary)' }}
                            >
                                {images[currentIndex].caption}
                            </p>

                            {/* Next Arrow */}
                            <button
                                onClick={goToNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                                style={{
                                    backgroundColor: 'var(--primary-500)', // Solid orange
                                    color: 'white'
                                }}
                                aria-label="Next image"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Right Image (hidden on mobile) */}
                        <div className="hidden md:block">
                            <Placeholder
                                text="GAMBAR"
                                aspectRatio="4:3"
                            />
                            <p
                                className="text-sm text-center mt-2"
                                style={{ color: 'var(--neutral-200)' }}
                            >
                                {images[(currentIndex + 1) % images.length].caption}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
