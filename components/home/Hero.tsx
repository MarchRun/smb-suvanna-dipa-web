/**
 * Hero Section Component - VIBRANT Warm Sunny Theme
 * Strong orange gradient background with rotating images
 * Mobile: Collapsible login form with smooth animations
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import BubbleEffect from './BubbleEffect'

export default function Hero() {
    // Array of background images
    const backgroundImages = [
        '/images/hero-image1.jpeg',
        '/images/hero-image2.jpeg',
        '/images/hero-image3.jpeg'
    ]

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [showLoginForm, setShowLoginForm] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    // Auto-rotate images every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                (prevIndex + 1) % backgroundImages.length
            )
        }, 5000) // 5 seconds

        return () => clearInterval(interval)
    }, [])

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024) // lg breakpoint
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Dark mode detection
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
        checkDarkMode()
        // Listen for dark mode changes
        const observer = new MutationObserver(checkDarkMode)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })
        return () => observer.disconnect()
    }, [])

    // Intersection Observer to detect when section is visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Trigger animation when section becomes visible
                if (entry.isIntersecting) {
                    setIsVisible(false) // Reset first
                    // Small delay to ensure CSS animation restarts
                    setTimeout(() => setIsVisible(true), 50)
                }
            },
            {
                threshold: 0.5, // Trigger when 50% of section is visible
            }
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

    // Smooth scroll to next section
    const scrollToNextSection = () => {
        const heroHeight = sectionRef.current?.offsetHeight || 0
        window.scrollTo({
            top: heroHeight,
            behavior: 'smooth'
        })
    }

    return (
        <>
            <section
                ref={sectionRef}
                className="flex items-center justify-center py-8 sm:py-4 px-4 relative transition-all duration-500 ease-in-out"
                style={{
                    minHeight: isMobile && showLoginForm ? 'calc(100vh + 200px)' : 'calc(100vh - 100px)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background images with fade transition */}
                {backgroundImages.map((image, index) => (
                    <div
                        key={index}
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            opacity: currentImageIndex === index ? 1 : 0,
                            transition: 'opacity 1s ease-in-out',
                            zIndex: 0
                        }}
                    />
                ))}
                {/* Color overlay dengan opacity */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundColor: 'var(--accent-200)', // Warna overlay
                        opacity: 0.65
                    }}
                />

                {/* Bubble Effect */}
                <BubbleEffect />

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 xl:gap-20 items-center">
                        {/* Left: Heading with slide-up animation */}
                        <div className={`text-center lg:text-left ${isVisible ? 'animate-slideUpFade' : 'opacity-0'}`}>
                            <h1
                                className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6 drop-shadow-sm"
                                style={{ color: isDarkMode ? 'var(--primary-600)' : 'var(--primary-900)' }} // Bright orange in dark mode
                            >
                                Sekolah Minggu Buddha Suvanna Dipa
                            </h1>
                            <p
                                className="text-base sm:text-lg font-bold mb-6"
                                style={{ color: isDarkMode ? '#ffffff' : '#000000' }} // White in dark mode
                            >
                                Yuk Temukan Informasi tentang Kami di sini.
                            </p>

                            {/* Mobile-only buttons */}
                            {isMobile && (
                                <div className="flex flex-row gap-3 justify-center lg:justify-start">
                                    <button
                                        onClick={scrollToNextSection}
                                        className="flex-1 px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 hover:scale-105"
                                        style={{
                                            backgroundColor: isDarkMode ? 'var(--primary-600)' : 'var(--primary-900)',
                                            boxShadow: isDarkMode
                                                ? '0 0 20px rgba(252, 211, 77, 0.8), 0 4px 15px rgba(249, 115, 22, 0.4)'
                                                : '0 0 30px rgba(124, 45, 18, 0.6)'
                                        }}
                                    >
                                        Jelajahi
                                    </button>

                                    <button
                                        onClick={() => setShowLoginForm(!showLoginForm)}
                                        className="flex-1 px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 hover:scale-105"
                                        style={{
                                            backgroundColor: isDarkMode ? 'var(--primary-600)' : 'var(--primary-900)',
                                            boxShadow: isDarkMode
                                                ? '0 0 20px rgba(252, 211, 77, 0.8), 0 4px 15px rgba(249, 115, 22, 0.4)'
                                                : '0 0 30px rgba(124, 45, 18, 0.6)'
                                        }}
                                    >
                                        {showLoginForm ? 'Tutup' : 'Login'}
                                    </button>
                                </div>
                            )}

                            {/* Desktop-only Jelajahi button */}
                            {!isMobile && (
                                <button
                                    onClick={scrollToNextSection}
                                    className="px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 hover:scale-105"
                                    style={{
                                        backgroundColor: isDarkMode ? 'var(--primary-600)' : 'var(--primary-900)',
                                        boxShadow: '0 0 20px rgba(252, 211, 77, 0.8), 0 4px 15px rgba(124, 45, 18, 0.4)'
                                    }}
                                >
                                    Jelajahi
                                </button>
                            )}
                        </div>

                        {/* Right: Login Form - Always visible on desktop, collapsible on mobile */}
                        {(!isMobile || showLoginForm) && (
                            <div
                                className={`w-full max-w-md mx-auto lg:mx-0 lg:ml-auto ${isMobile
                                    ? showLoginForm
                                        ? 'animate-slideDownExpand'
                                        : 'hidden'
                                    : isVisible
                                        ? 'animate-slideDownFade'
                                        : 'opacity-0'
                                    }`}
                            >
                                <LoginForm />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes slideDownExpand {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                        max-height: 0;
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                        max-height: 600px;
                    }
                }

                :global(.animate-slideDownExpand) {
                    animation: slideDownExpand 0.5s ease-out forwards;
                }
            `}</style>
        </>
    )
}
