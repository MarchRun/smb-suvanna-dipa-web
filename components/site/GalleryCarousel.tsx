/**
 * Gallery Carousel Component
 * Elegant 5 image slider with featured center card
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function GalleryCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    const images = [
        { id: 1, src: '/images/slider-image1.png', caption: 'Mulyono' },
        { id: 2, src: '/images/slider-image2.png', caption: 'Terus Terang' },
        { id: 3, src: '/images/slider-image3.png', caption: 'Sahroni' },
        { id: 4, src: '/images/slider-image4.png', caption: 'Fufufafa' },
        { id: 5, src: '/images/slider-image5.png', caption: 'Angkat Karung' }
    ]

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            { threshold: 0.2 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current)
            }
        }
    }, [])

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    // Get index with wrapping
    const getIndex = (offset: number) => {
        return (currentIndex + offset + images.length) % images.length
    }

    return (
        <>
            <section
                ref={sectionRef}
                className="py-12 sm:py-16 md:py-20 relative overflow-hidden"
                style={{
                    backgroundColor: 'var(--primary-900)' // Dark brown matching header text
                }}
            >
                {/* Top-left trapezoid - hidden on mobile */}
                <div
                    className={`hidden sm:block ${isVisible ? 'animate-slideFromLeft' : 'opacity-0'}`}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 'clamp(150px, 20vw, 300px)',
                        height: 'clamp(40px, 5vw, 80px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0 100%)',
                        zIndex: 1
                    }}
                />

                {/* Bottom-right trapezoid - hidden on mobile */}
                <div
                    className={`hidden sm:block ${isVisible ? 'animate-slideFromRight' : 'opacity-0'}`}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 'clamp(150px, 20vw, 300px)',
                        height: 'clamp(40px, 5vw, 80px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)',
                        zIndex: 1
                    }}
                />

                <div className="max-w-7xl mx-auto px-4 relative z-10 my-8">
                    {/* Section Title */}
                    <h2
                        className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ color: '#ffffff' }}
                    >
                        Galeri Kegiatan SMB
                    </h2>

                    {/* Carousel Container */}
                    <div className="relative flex items-center justify-center gap-3 sm:gap-6">
                        {/* Previous Arrow */}
                        <button
                            onClick={goToPrevious}
                            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all hover:scale-110 z-20 flex items-center justify-center"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                color: 'var(--primary-600)',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                            }}
                            aria-label="Previous image"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Slider Cards */}
                        <div className="flex items-center justify-center gap-3 sm:gap-6 overflow-hidden py-4">
                            {/* Left Card - Polaroid style with white frame */}
                            <div
                                className="hidden md:block cursor-pointer card-side"
                                onClick={goToPrevious}
                            >
                                <div
                                    className="overflow-hidden rounded-xl"
                                    style={{
                                        backgroundColor: 'var(--primary-500)',
                                        boxShadow: '0 0 20px rgba(252, 211, 77, 0.8), 0 4px 15px rgba(249, 115, 22, 0.4)'
                                    }}
                                >
                                    <div className="w-64 lg:w-72 h-40 lg:h-44 overflow-hidden relative">
                                        <Image
                                            src={images[getIndex(-1)].src}
                                            alt={images[getIndex(-1)].caption}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="px-2 py-2 bg-[var(--primary-500)]">
                                        <p className="text-xs font-medium text-center text-white">
                                            {images[getIndex(-1)].caption}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Center Card - Featured, polaroid style with white frame */}
                            <div className="z-10 card-center">
                                <div
                                    className="overflow-hidden rounded-xl"
                                    style={{
                                        backgroundColor: 'var(--primary-500)',
                                        boxShadow: '0 0 20px rgba(252, 211, 77, 0.8), 0 4px 15px rgba(249, 115, 22, 0.4)'
                                    }}
                                >
                                    <div className="w-[480px] sm:w-[560px] md:w-[640px] lg:w-[720px] h-60 sm:h-64 md:h-72 lg:h-80 overflow-hidden relative">
                                        <Image
                                            src={images[currentIndex].src}
                                            alt={images[currentIndex].caption}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="px-3 py-3 sm:px-4 sm:py-3 bg-[var(--primary-500)]">

                                        <p className="text-sm sm:text-base font-semibold text-center text-white">
                                            {images[currentIndex].caption}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Card - Polaroid style with white frame */}
                            <div
                                className="hidden md:block cursor-pointer card-side"
                                onClick={goToNext}
                            >
                                <div
                                    className="overflow-hidden rounded-xl"
                                    style={{
                                        backgroundColor: 'var(--primary-500)',
                                        boxShadow: '0 0 20px rgba(252, 211, 77, 0.8), 0 4px 15px rgba(249, 115, 22, 0.4)'
                                    }}
                                >
                                    <div className="w-64 lg:w-72 h-40 lg:h-44 overflow-hidden relative">
                                        <Image
                                            src={images[getIndex(1)].src}
                                            alt={images[getIndex(1)].caption}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="px-2 py-2 bg-[var(--primary-500)]">
                                        <p className="text-xs font-medium text-center text-white">
                                            {images[getIndex(1)].caption}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Arrow */}
                        <button
                            onClick={goToNext}
                            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all hover:scale-110 z-20 flex items-center justify-center"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                color: 'var(--primary-600)',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                            }}
                            aria-label="Next image"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Dot Indicators */}
                    <div className="flex justify-center items-center gap-3 mt-8">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className="transition-all duration-300 rounded-full"
                                style={{
                                    width: index === currentIndex ? '28px' : '10px',
                                    height: '10px',
                                    backgroundColor: index === currentIndex
                                        ? '#ffffff'
                                        : 'rgba(255, 255, 255, 0.4)',
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes slideFromLeft {
                    from {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideFromRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                :global(.animate-slideFromLeft) {
                    animation: slideFromLeft 0.8s ease-out forwards;
                }

                :global(.animate-slideFromRight) {
                    animation: slideFromRight 0.8s ease-out forwards;
                }

                .card-side {
                    opacity: 0.6;
                    transition: all 0.3s ease;
                }

                .card-side:hover {
                    opacity: 0.85;
                    transform: scale(1.02);
                }

                .card-center {
                    transition: all 0.3s ease;
                }
            `}</style>
        </>
    )
}
