/**
 * Shared Page Header Component
 * Reusable page title and subtitle for all pages
 * With typewriter animation and dark mode support
 */

'use client'

import { useState, useEffect, useRef } from 'react'

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
    const [isDarkMode, setIsDarkMode] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    const alignmentClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }

    // Dark mode detection
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
        checkDarkMode()
        const observer = new MutationObserver(checkDarkMode)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })
        return () => observer.disconnect()
    }, [])

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

    // Dynamic colors
    const titleColor = isDarkMode ? '#ea580c' : '#7c2d12' // Bright orange in dark, brownish in light
    const bgColor = isDarkMode ? '#BAE6FD' : '#FFEFD5' // Sky blue in dark, cream in light

    return (
        <>
            <section
                ref={sectionRef}
                className="py-8 sm:py-10"
                style={{ backgroundColor: bgColor }}
            >
                <div className="max-w-7xl mx-auto px-4">
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
