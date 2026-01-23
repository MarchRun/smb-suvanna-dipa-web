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
    const titleColor = '#E57526' // Logo orange
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
                    style={{
                        backgroundImage: 'url(/images/vihara-full.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'top', // Crop from top - only show upper portion
                        backgroundRepeat: 'no-repeat',
                        opacity: 1 // Increased opacity for better visibility
                    }}
                />

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className={alignmentClass[align]}>
                        <h1
                            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4"
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
                        {subtitle && (
                            <p
                                className="text-sm sm:text-base md:text-lg px-4"
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
