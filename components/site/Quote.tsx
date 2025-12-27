/**
 * Quote Component
 * Displays a styled quote with attribution
 * Responsive text sizing with fade-in animation and dark mode support
 */

'use client'

import { useState, useEffect, useRef } from 'react'

export default function Quote() {
    const [isVisible, setIsVisible] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

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

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Track both entering and leaving for refresh effect
                setIsVisible(entry.isIntersecting)
            },
            { threshold: 0.3 }
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

    // Dynamic colors
    const textColor = isDarkMode ? '#ea580c' : '#7c2d12' // Bright orange in dark, brownish in light
    const bgColor = isDarkMode ? '#BAE6FD' : '#FFEFD5' // Sky blue in dark, cream in light

    return (
        <section
            ref={sectionRef}
            className="py-12 sm:py-16"
            style={{ backgroundColor: bgColor }}
        >
            <div
                className={`max-w-6xl mx-auto px-4 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <blockquote className="text-center">
                    <p
                        className="text-base sm:text-lg md:text-xl font-bold mb-4 italic text-justify"
                        style={{ color: textColor }}
                    >
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante."
                    </p>
                    <cite
                        className="text-base sm:text-lg not-italic font-medium"
                        style={{ color: textColor }}
                    >
                        -Lorem Ipsum Dolor Sit Amet-
                    </cite>
                </blockquote>
            </div>
        </section>
    )
}
