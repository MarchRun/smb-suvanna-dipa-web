/**
 * Hero Section Component - VIBRANT Warm Sunny Theme
 * Strong orange gradient background with rotating images
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import LoginForm from './LoginForm'
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

    return (
        <section
            ref={sectionRef}
            className="flex items-center justify-center py-8 sm:py-4 px-4 relative"
            style={{
                minHeight: 'calc(100vh - 100px)',
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
                    opacity: 0.6 // Adjust: 0.5-0.9 untuk opacity
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
                            style={{ color: 'var(--primary-900)' }}
                        >
                            Sekolah Minggu Buddha Suvanna Dipa
                        </h1>
                        <p
                            className="text-base sm:text-lg font-bold"
                            style={{ color: 'var(--neutral-900)' }}
                        >
                            Yuk Temukan Informasi tentang Kami di sini.
                        </p>
                    </div>

                    {/* Right: Login Form with slide-down animation */}
                    <div className={`w-full max-w-md mx-auto lg:mx-0 lg:ml-auto ${isVisible ? 'animate-slideDownFade' : 'opacity-0'}`}>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </section>
    )
}
