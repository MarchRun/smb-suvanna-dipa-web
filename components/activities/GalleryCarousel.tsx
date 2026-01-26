/**
 * Gallery Carousel Component
 * Elegant 5 image slider with featured center card
 * With dark mode support - Fetches from database
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useDarkMode } from '@/hooks/useDarkMode'
import { getPublicContentBySection, type GalleryItem } from '@/actions/admin/publicContent'

export default function GalleryCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [images, setImages] = useState<{ id: number; src: string; caption: string }[]>([])
    const [loading, setLoading] = useState(true)
    const isDarkMode = useDarkMode()
    const sectionRef = useRef<HTMLElement>(null)

    // Fetch gallery data from database
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const result = await getPublicContentBySection('gallery')
                if (result.success && result.data?.content?.items) {
                    const dbItems: GalleryItem[] = result.data.content.items
                    // Map database items to image format
                    const mappedImages = dbItems.map((item, index) => ({
                        id: index + 1,
                        src: item.image_url || '/images/slider-image1.png',
                        caption: item.caption || `Kegiatan ${index + 1}`
                    })).filter(img => img.src) // Only include items with valid images
                    setImages(mappedImages)
                }
            } catch (error) {
                console.error('Error fetching gallery:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchGallery()
    }, [])


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

    // Dynamic colors - White theme with orange accent
    const sectionBgColor = '#E57526' // Logo orange
    const captionBgColor = '#C25F1D' // Darker orange for captions
    const captionShadow = '0 4px 15px rgba(229, 117, 38, 0.4)'
    const buttonBgColor = '#FFFFFF' // White buttons
    const buttonIconColor = '#E57526' // Orange icons

    return (
        <>
            <section
                id="gallery"
                ref={sectionRef}
                className="py-12 sm:py-16 md:py-20 relative overflow-hidden scroll-mt-40"
                style={{
                    backgroundColor: sectionBgColor
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

                    {loading ? (
                        <div className="text-center text-white py-12">Loading...</div>
                    ) : images.length === 0 ? (
                        <div className="text-center text-white py-12 opacity-70">
                            Belum ada gambar galeri. Silakan tambahkan melalui halaman admin.
                        </div>
                    ) : (
                        <>
                            {/* Carousel Container */}
                            <div className="relative flex items-center justify-center gap-3 sm:gap-6">
                                {/* Previous Arrow */}
                                <button
                                    onClick={goToPrevious}
                                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all hover:scale-110 z-20 flex items-center justify-center"
                                    style={{
                                        backgroundColor: buttonBgColor,
                                        color: buttonIconColor,
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
                                    {/* Left Card - Polaroid style */}
                                    <div
                                        className="hidden md:block cursor-pointer card-side"
                                        onClick={goToPrevious}
                                    >
                                        <div
                                            className="overflow-hidden rounded-xl"
                                            style={{
                                                backgroundColor: captionBgColor,
                                                boxShadow: captionShadow
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
                                            <div
                                                className="px-2 py-2"
                                                style={{ backgroundColor: captionBgColor }}
                                            >
                                                <p className="text-xs font-medium text-center text-white">
                                                    {images[getIndex(-1)].caption}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center Card - Featured, polaroid style */}
                                    <div className="z-10 card-center">
                                        <div
                                            className="overflow-hidden rounded-xl"
                                            style={{
                                                backgroundColor: captionBgColor,
                                                boxShadow: captionShadow
                                            }}
                                        >
                                            <div className="w-[320px] sm:w-[560px] md:w-[640px] lg:w-[720px] h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden relative rounded-t-xl">
                                                <Image
                                                    src={images[currentIndex].src}
                                                    alt={images[currentIndex].caption}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div
                                                className="px-3 py-3 sm:px-4 sm:py-3 rounded-b-xl"
                                                style={{ backgroundColor: captionBgColor }}
                                            >
                                                <p className="text-sm sm:text-base font-semibold text-center text-white">
                                                    {images[currentIndex].caption}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Card - Polaroid style */}
                                    <div
                                        className="hidden md:block cursor-pointer card-side"
                                        onClick={goToNext}
                                    >
                                        <div
                                            className="overflow-hidden rounded-xl"
                                            style={{
                                                backgroundColor: captionBgColor,
                                                boxShadow: captionShadow
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
                                            <div
                                                className="px-2 py-2"
                                                style={{ backgroundColor: captionBgColor }}
                                            >
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
                                        backgroundColor: buttonBgColor,
                                        color: buttonIconColor,
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
                        </>
                    )}
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

