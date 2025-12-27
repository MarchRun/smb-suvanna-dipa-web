/**
 * Vision & Mission Component
 * 2-column layout (Visi left, Misi right)
 * Stacks vertically on mobile
 * With gradient background, trapezoid decorations, and dark mode support
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Card from '@/components/shared/Card'

export default function VisionMission() {
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

    // Dynamic colors - in dark mode, use same color as buttons (brownish orange with brownish shadow)
    const cardBgColor = isDarkMode ? 'var(--primary-900)' : 'var(--primary-500)' // Brownish in dark, bright orange in light
    const cardShadow = isDarkMode
        ? '0 0 30px rgba(124, 45, 18, 0.6)' // Brownish shadow in dark mode (same as buttons)
        : '0 0 20px rgba(252, 211, 77, 0.8), 0 4px 15px rgba(249, 115, 22, 0.4)' // Yellow glow in light mode

    return (
        <>
            <section
                ref={sectionRef}
                className="py-16 sm:py-20 md:py-24 relative overflow-hidden"
                style={{
                    backgroundColor: isDarkMode ? 'var(--primary-600)' : 'var(--primary-900)' // Bright orange in dark, dark brown in light
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

                <div className="max-w-6xl mx-auto px-4 relative z-10 my-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Visi */}
                        <div
                            className={`${isVisible ? 'animate-scaleIn' : 'opacity-0'} hover-bounce`}
                            style={{ animationDelay: '0s' }}
                        >
                            <Card
                                className="text-center h-full"
                                customStyle={{
                                    backgroundColor: cardBgColor,
                                    boxShadow: cardShadow,
                                    border: 'none',
                                }}
                            >
                                <h3
                                    className="text-2xl sm:text-3xl font-bold mb-4 text-center"
                                    style={{ color: '#ffffff' }}
                                >
                                    VISI
                                </h3>
                                <p
                                    className="text-sm sm:text-base font-bold text-justify"
                                    style={{ color: '#ffffff' }}
                                >
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante.
                                </p>
                            </Card>
                        </div>

                        {/* Misi */}
                        <div
                            className={`${isVisible ? 'animate-scaleIn' : 'opacity-0'} hover-bounce`}
                            style={{ animationDelay: '0.2s' }}
                        >
                            <Card
                                className="text-center h-full"
                                customStyle={{
                                    backgroundColor: cardBgColor,
                                    boxShadow: cardShadow,
                                    border: 'none',
                                }}
                            >
                                <h3
                                    className="text-2xl sm:text-3xl font-bold mb-4 text-center"
                                    style={{ color: '#ffffff' }}
                                >
                                    MISI
                                </h3>
                                <p
                                    className="text-sm sm:text-base font-bold text-justify"
                                    style={{ color: '#ffffff' }}
                                >
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante.
                                </p>
                            </Card>
                        </div>
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

                @keyframes scaleIn {
                    from {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                :global(.animate-slideFromLeft) {
                    animation: slideFromLeft 0.8s ease-out forwards;
                }

                :global(.animate-slideFromRight) {
                    animation: slideFromRight 0.8s ease-out forwards;
                }

                :global(.animate-scaleIn) {
                    animation: scaleIn 0.6s ease-out forwards;
                }

                :global(.hover-bounce) {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                :global(.hover-bounce:hover) {
                    transform: scale(1.05) !important;
                }
            `}</style>
        </>
    )
}
