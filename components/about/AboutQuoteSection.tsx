/**
 * Quote Component
 * Displays a styled quote with attribution
 * Responsive text sizing with fade-in animation and dark mode support
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import SectionHeader from '@/components/shared/SectionHeader'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function AboutQuoteSection() {
    const [isVisible, setIsVisible] = useState(false)
    const isDarkMode = useDarkMode()
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
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

    // Dynamic colors - Cream theme with orange accent
    const textColor = '#E57526' // Logo orange
    const bgColor = 'var(--background)' // Cream background

    return (
        <section
            ref={sectionRef}
            className="py-8 sm:py-10 md:py-12 min-h-[20vh] flex flex-col justify-center"
            style={{ backgroundColor: bgColor }}
        >
            <div
                className={`max-w-7xl mx-auto px-4 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                {/* Section Header */}
                <SectionHeader
                    title="Kutipan Bijak"
                    color="#E57526"
                    isVisible={isVisible}
                    className="mb-8"
                />
                <div className="relative py-12 px-6 sm:py-16 sm:px-12 max-w-4xl mx-auto">
                    {/* Corner Ornaments (Ukiran) - Complex Floral/Baroque Style */}
                    {/* Top Left */}
                    <svg className="absolute top-0 left-0 w-20 h-20 sm:w-28 sm:h-28 text-[#E57526] opacity-30" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M0 0 L0 50 Q0 80 30 80 L40 80 Q70 80 80 50 L80 0 H60 L60 40 Q60 60 40 60 Q20 60 20 30 L20 0 H0 Z" />
                        <path d="M10 10 C10 20 20 30 10 40 C5 35 5 15 10 10 Z" />
                        <path d="M30 30 Q50 30 50 50 Q50 70 30 70 Q10 70 10 50 Q10 30 30 30 Z M30 40 Q25 40 25 50 Q25 60 30 60 Q35 60 35 50 Q35 40 30 40 Z" />
                        <circle cx="70" cy="20" r="5" />
                        <circle cx="20" cy="70" r="5" />
                        <circle cx="50" cy="50" r="3" />
                    </svg>
                    {/* Top Right */}
                    <svg className="absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28 text-[#E57526] opacity-30 transform scale-x-[-1]" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M0 0 L0 50 Q0 80 30 80 L40 80 Q70 80 80 50 L80 0 H60 L60 40 Q60 60 40 60 Q20 60 20 30 L20 0 H0 Z" />
                        <path d="M10 10 C10 20 20 30 10 40 C5 35 5 15 10 10 Z" />
                        <path d="M30 30 Q50 30 50 50 Q50 70 30 70 Q10 70 10 50 Q10 30 30 30 Z M30 40 Q25 40 25 50 Q25 60 30 60 Q35 60 35 50 Q35 40 30 40 Z" />
                        <circle cx="70" cy="20" r="5" />
                        <circle cx="20" cy="70" r="5" />
                        <circle cx="50" cy="50" r="3" />
                    </svg>
                    {/* Bottom Left */}
                    <svg className="absolute bottom-0 left-0 w-20 h-20 sm:w-28 sm:h-28 text-[#E57526] opacity-30 transform scale-y-[-1]" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M0 0 L0 50 Q0 80 30 80 L40 80 Q70 80 80 50 L80 0 H60 L60 40 Q60 60 40 60 Q20 60 20 30 L20 0 H0 Z" />
                        <path d="M10 10 C10 20 20 30 10 40 C5 35 5 15 10 10 Z" />
                        <path d="M30 30 Q50 30 50 50 Q50 70 30 70 Q10 70 10 50 Q10 30 30 30 Z M30 40 Q25 40 25 50 Q25 60 30 60 Q35 60 35 50 Q35 40 30 40 Z" />
                        <circle cx="70" cy="20" r="5" />
                        <circle cx="20" cy="70" r="5" />
                        <circle cx="50" cy="50" r="3" />
                    </svg>
                    {/* Bottom Right */}
                    <svg className="absolute bottom-0 right-0 w-20 h-20 sm:w-28 sm:h-28 text-[#E57526] opacity-30 transform scale-x-[-1] scale-y-[-1]" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M0 0 L0 50 Q0 80 30 80 L40 80 Q70 80 80 50 L80 0 H60 L60 40 Q60 60 40 60 Q20 60 20 30 L20 0 H0 Z" />
                        <path d="M10 10 C10 20 20 30 10 40 C5 35 5 15 10 10 Z" />
                        <path d="M30 30 Q50 30 50 50 Q50 70 30 70 Q10 70 10 50 Q10 30 30 30 Z M30 40 Q25 40 25 50 Q25 60 30 60 Q35 60 35 50 Q35 40 30 40 Z" />
                        <circle cx="70" cy="20" r="5" />
                        <circle cx="20" cy="70" r="5" />
                        <circle cx="50" cy="50" r="3" />
                    </svg>

                    {/* Background Mandala / Dharma Wheel */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                        <svg
                            className="w-[120%] h-[120%] sm:w-[100%] sm:h-[100%] text-[#E57526] opacity-[0.05] animate-spin"
                            viewBox="0 0 100 100"
                            fill="currentColor"
                            style={{ animationDuration: '60s' }}
                        >
                            {/* Outer Ring */}
                            <path d="M50 5 A 45 45 0 1 1 50 95 A 45 45 0 1 1 50 5 Z M50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10 Z" />
                            {/* Inner Ring */}
                            <path d="M50 35 A 15 15 0 1 1 50 65 A 15 15 0 1 1 50 35 Z M50 40 A 10 10 0 1 0 50 60 A 10 10 0 1 0 50 40 Z" />
                            {/* Spokes */}
                            <rect x="48" y="10" width="4" height="80" rx="2" />
                            <rect x="10" y="48" width="80" height="4" rx="2" />
                            <rect x="48" y="10" width="4" height="80" rx="2" transform="rotate(45 50 50)" />
                            <rect x="48" y="10" width="4" height="80" rx="2" transform="rotate(-45 50 50)" />
                            {/* Decorative Dots */}
                            <circle cx="50" cy="5" r="3" />
                            <circle cx="95" cy="50" r="3" />
                            <circle cx="50" cy="95" r="3" />
                            <circle cx="5" cy="50" r="3" />
                        </svg>
                    </div>

                    <blockquote className="text-center relative z-10">
                        <p
                            className="text-base sm:text-lg md:text-xl font-bold mb-4 italic text-center"
                            style={{ color: textColor }}
                        >
                            "Janganlah berbuat jahat, perbanyaklah perbuatan baik, sucikan hati dan pikiran. Inilah ajaran para Buddha."
                        </p>
                        <cite
                            className="text-base sm:text-lg not-italic font-medium"
                            style={{ color: textColor }}
                        >
                            - Syair Buddha Vagga, Ayat 183 -
                        </cite>
                    </blockquote>
                </div>
            </div>
        </section>
    )
}
