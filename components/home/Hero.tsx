/**
 * Hero Section Component - VIBRANT Warm Sunny Theme
 * Strong orange gradient background with rotating images
 * Mobile: Collapsible login form with smooth animations
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function Hero() {
    // Single vihara background image
    const backgroundImages = [
        '/images/smbsd-bg-hd.jpg'
    ]

    const [isVisible, setIsVisible] = useState(false)
    const [showLoginForm, setShowLoginForm] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const isDarkMode = useDarkMode()
    const sectionRef = useRef<HTMLElement>(null)
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024) // lg breakpoint
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
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
            top: heroHeight - 120, // Adjusted to > 112px (header height)
            behavior: 'smooth'
        })
    }


    return (
        <>
            <section
                ref={sectionRef}
                className="flex items-center justify-center py-8 sm:py-4 px-4 relative transition-all duration-500 ease-in-out"
                style={{
                    minHeight: isMobile && showLoginForm ? 'calc(100vh + 200px)' : '100vh',
                    paddingTop: '80px', // Account for fixed header
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background images with fade transition and grayscale filter */}
                {backgroundImages.map((image, index) => (
                    <div
                        key={index}
                        className="absolute inset-0"
                    >
                        {/* Grayscale Image Layer */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `url(${image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'top',
                                backgroundRepeat: 'no-repeat',
                                // filter: 'grayscale(100%) brightness(1.1) contrast(1.5)', // Removed for normal look
                                opacity: 1,
                                transition: 'opacity 1s ease-in-out',
                            }}
                        />
                        {/* Orange Overlay Layer Removed */}
                        {/* <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: '#E57526', // Brand Orange
                                mixBlendMode: 'multiply',
                                opacity: 0.85 
                            }}
                        /> */}
                    </div>
                ))}

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 xl:gap-20 items-center">
                        {/* Left: Heading with slide-up animation */}
                        <div className={`text-center lg:text-left ${isVisible ? 'animate-slideUpFade' : 'opacity-0'}`}>
                            <h1
                                className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 drop-shadow-sm leading-tight" // Reduced mobile size (4xl -> 3xl)
                                style={{
                                    color: '#ffffff', // White Fill
                                    // Responsive Outline: 2px on Mobile, 4px on Desktop
                                    textShadow: isMobile
                                        ? '2px 2px 0 #E57526, -2px 2px 0 #E57526, 2px -2px 0 #E57526, -2px -2px 0 #E57526, 2px 0 0 #E57526, -2px 0 0 #E57526, 0 2px 0 #E57526, 0 -2px 0 #E57526'
                                        : '4px 4px 0 #E57526, -4px 4px 0 #E57526, 4px -4px 0 #E57526, -4px -4px 0 #E57526, 4px 0 0 #E57526, -4px 0 0 #E57526, 0 4px 0 #E57526, 0 -4px 0 #E57526'
                                }}
                            >
                                Sekolah Minggu Buddha Suvanna Dipa
                            </h1>
                            <p
                                className="text-base sm:text-xl font-bold mb-6"
                                style={{
                                    color: '#1A1A1A', // Dark text, no outline
                                }}
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
                                            backgroundColor: '#E57526', // Logo orange
                                            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.4)' // Bright White Glow
                                        }}
                                    >
                                        Jelajahi
                                    </button>

                                    <button
                                        onClick={() => setShowLoginForm(!showLoginForm)}
                                        className="flex-1 px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 hover:scale-105"
                                        style={{
                                            backgroundColor: '#E57526', // Logo orange
                                            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.4)' // Bright White Glow
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
                                        backgroundColor: '#E57526', // Logo orange
                                        boxShadow: '0 4px 20px rgba(255, 255, 255, 0.4)' // Bright White Glow
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
