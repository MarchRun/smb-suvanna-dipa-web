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
        { id: 1, src: '/images/slider-image1.png', caption: 'Kegiatan Waisak 2024' },
        { id: 2, src: '/images/slider-image2.png', caption: 'Meditasi Pagi Hari' },
        { id: 3, src: '/images/slider-image3.png', caption: 'Kelas Dhamma Remaja' },
        { id: 4, src: '/images/slider-image4.png', caption: 'Perayaan Kathina' },
        { id: 5, src: '/images/slider-image5.png', caption: 'Bakti Sosial' }
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
                    backgroundColor: 'var(--primary-500)'
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
                        className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ color: '#ffffff' }}
                    >
                        Galeri Kegiatan SMB
                    </h2>

                    {/* Section Description */}
                    <p
                        className={`text-base sm:text-lg mb-8 sm:mb-12 text-justify transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ color: '#ffffff' }}
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu.
                    </p>

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
                            {/* Left Card - Semi-transparent, smaller */}
                            <div
                                className="hidden md:block cursor-pointer card-side"
                                onClick={goToPrevious}
                            >
                                <div
                                    className="w-64 lg:w-80 h-36 lg:h-44 rounded-2xl overflow-hidden relative"
                                    style={{
                                        backgroundColor: 'var(--primary-600)',
                                        boxShadow: '0 10px 30px rgba(249, 115, 22, 0.4), 0 0 20px rgba(252, 211, 77, 0.2)'
                                    }}
                                >
                                    <Image
                                        src={images[getIndex(-1)].src}
                                        alt={images[getIndex(-1)].caption}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Caption Overlay */}
                                    <div
                                        className="absolute bottom-0 left-0 right-0 p-3"
                                        style={{
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))'
                                        }}
                                    >
                                        <p className="text-white text-xs font-medium text-center opacity-90">
                                            {images[getIndex(-1)].caption}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Center Card - Featured, larger */}
                            <div className="z-10 card-center">
                                <div
                                    className="w-80 sm:w-96 md:w-[420px] lg:w-[520px] h-44 sm:h-52 md:h-56 lg:h-64 rounded-2xl overflow-hidden relative"
                                    style={{
                                        backgroundColor: 'var(--primary-600)',
                                        boxShadow: '0 10px 30px rgba(249, 115, 22, 0.5), 0 0 40px rgba(252, 211, 77, 0.3)'
                                    }}
                                >
                                    <Image
                                        src={images[currentIndex].src}
                                        alt={images[currentIndex].caption}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Caption Overlay */}
                                    <div
                                        className="absolute bottom-0 left-0 right-0 p-4 sm:p-5"
                                        style={{
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                                        }}
                                    >
                                        <p className="text-white text-sm sm:text-base font-semibold text-center">
                                            {images[currentIndex].caption}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Card - Semi-transparent, smaller */}
                            <div
                                className="hidden md:block cursor-pointer card-side"
                                onClick={goToNext}
                            >
                                <div
                                    className="w-64 lg:w-80 h-36 lg:h-44 rounded-2xl overflow-hidden relative"
                                    style={{
                                        backgroundColor: 'var(--primary-600)',
                                        boxShadow: '0 10px 30px rgba(249, 115, 22, 0.4), 0 0 20px rgba(252, 211, 77, 0.2)'
                                    }}
                                >
                                    <Image
                                        src={images[getIndex(1)].src}
                                        alt={images[getIndex(1)].caption}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Caption Overlay */}
                                    <div
                                        className="absolute bottom-0 left-0 right-0 p-3"
                                        style={{
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))'
                                        }}
                                    >
                                        <p className="text-white text-xs font-medium text-center opacity-90">
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
