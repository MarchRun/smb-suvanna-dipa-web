/**
 * Shared Page Header Component
 * Reusable page title and subtitle for all pages
 * With typewriter animation and dark mode support
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useDarkMode } from '@/hooks/useDarkMode'

interface PageHeaderProps {
    title: string
    subtitle?: string
    align?: 'left' | 'center' | 'right'
}

export default function PageHeader({
    title,
    subtitle,
    align = 'center'
}: PageHeaderProps) {
    const [displayedTitle, setDisplayedTitle] = useState('')
    const [showCursor, setShowCursor] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const isDarkMode = useDarkMode()
    const sectionRef = useRef<HTMLElement>(null)

    const alignmentClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }

    // Intersection Observer to track visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            { threshold: 0.5 }
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

    // Typewriter effect - triggers when section becomes visible
    useEffect(() => {
        if (!isVisible) {
            // Reset when not visible
            setDisplayedTitle('')
            setShowCursor(true)
            return
        }

        // Start typing animation when visible
        setDisplayedTitle('')
        setShowCursor(true)
        let currentIndex = 0
        const typingInterval = setInterval(() => {
            if (currentIndex < title.length) {
                setDisplayedTitle(title.substring(0, currentIndex + 1))
                currentIndex++
            } else {
                clearInterval(typingInterval)
                // Hide cursor completely after typing complete
                setShowCursor(false)
            }
        }, 80) // Speed of typing

        return () => clearInterval(typingInterval)
    }, [title, isVisible])

    // Dynamic colors - White theme with orange accent
    const titleColor = '#FFFFFF' // Logo orange
    const bgColor = '#FFFFFF' // White background

    return (
        <>
            <section
                ref={sectionRef}
                className="relative py-16 sm:py-20"
                style={{
                    paddingTop: '120px', // Account for fixed header
                    minHeight: '300px'
                }}
            >
                {/* Background Image - Cropped to show top portion only */}
                <div
                    className="absolute inset-0 z-0"
                >
                    {/* Grayscale Image Base */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: 'url(/images/smbsd-bg-hd.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'top',
                            backgroundRepeat: 'no-repeat',
                            // filter: 'grayscale(100%) brightness(1.1) contrast(1.5)',
                        }}
                    />
                    {/* Orange Overlay Removed */}
                    {/* <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor: '#E57526',
                            mixBlendMode: 'multiply',
                            opacity: 0.85
                        }}
                    /> */}
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className={alignmentClass[align]}>
                        <div className={`flex items-center gap-4 leading-tight ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
                            {/* Left Decorative Line */}
                            <div className="hidden sm:block h-[2px] w-12 sm:w-24 bg-white opacity-80 rounded-full"></div>

                            <h1
                                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-center sm:text-left" // Ensure text alignment matches context
                                style={{ color: titleColor }}
                            >
                                {displayedTitle}
                                <span
                                    className="inline-block w-1 ml-1"
                                    style={{
                                        backgroundColor: showCursor ? titleColor : 'transparent',
                                        height: '1em',
                                        verticalAlign: 'text-bottom'
                                    }}
                                />
                            </h1>

                            {/* Right Decorative Line */}
                            <div className="hidden sm:block h-[2px] w-12 sm:w-24 bg-white opacity-80 rounded-full"></div>
                        </div>

                        {subtitle && (
                            <p
                                className="text-sm sm:text-base md:text-lg px-4 mt-2"
                                style={{ color: titleColor }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
