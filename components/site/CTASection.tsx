/**
 * CTA Section Component
 * Call-to-action for community joining
 * Gray background with button
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/shared/Button'

export default function CTASection() {
    const router = useRouter()
    const [isVisible, setIsVisible] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

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

    return (
        <>
            <section
                ref={sectionRef}
                className="py-12 sm:py-16 md:py-20 relative overflow-hidden"
                style={{
                    backgroundColor: isDarkMode ? 'var(--primary-600)' : 'var(--primary-900)' // Dark brown matching header text
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

                <div className={`max-w-7xl mx-auto px-4 text-center relative z-10 ${isVisible ? 'animate-slideUpFade' : 'opacity-0'}`}>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
                        style={{ color: '#ffffff' }}
                    >
                        Bergabunglah Dengan Komunitas Kami
                    </h2>
                    <p
                        className="text-base sm:text-lg mb-6 sm:mb-8 mx-auto font-semibold px-4 sm:px-8 md:px-12 text-justify"
                        style={{ color: '#ffffff' }}
                    >
                        Kami mengadakan berbagai kegiatan menarik dan bermakna untuk mengembangkan pemahaman Dharma dan mempererat tali persaudaraan. Dari kegiatan pembelajaran, meditasi, hingga bakti sosial, setiap aktivitas dirancang untuk menumbuhkan kebajikan dan kebahagiaan. Jelajahi aktivitas kami dan temukan cara untuk berkontribusi dalam membangun komunitas yang penuh kasih dan kebijaksanaan. Mari bersama-sama berproses menuju pencerahan.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/activities')}
                        customStyle={{
                            backgroundColor: isDarkMode ? 'var(--primary-900)' : 'var(--primary-600)',
                            color: '#ffffff',
                            boxShadow: isDarkMode
                                ? '0 0 30px rgba(124, 45, 18, 0.6)'
                                : '0 0 20px rgba(252, 211, 77, 0.8), 0 4px 15px rgba(249, 115, 22, 0.4)'
                        }}
                    >
                        Lihat Aktivitas Kami
                    </Button>
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
            `}</style>
        </>
    )
}
