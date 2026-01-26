/**
 * Vision & Mission Component
 * 2-column layout (Visi left, Misi right)
 * Stacks vertically on mobile
 * With gradient background, trapezoid decorations, and dark mode support
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Card from '@/components/shared/Card'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function AboutVisionMissionSection() {
    const [isVisible, setIsVisible] = useState(false)
    const isDarkMode = useDarkMode()
    const sectionRef = useRef<HTMLElement>(null)

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

    // Dynamic colors - White theme with orange accent
    const cardBgColor = '#C25F1D' // Darker orange (matching button)
    const cardShadow = '0 4px 20px rgba(255, 255, 255, 0.4)' // Bright White Glow (matching button)

    return (
        <>
            <section
                id="vision"
                ref={sectionRef}
                className="py-12 sm:py-16 md:py-20 relative overflow-hidden scroll-mt-40"
                style={{
                    backgroundColor: '#E57526' // Logo orange
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
                            className={`${isVisible ? 'animate-scaleIn' : 'opacity-0'}`}
                            style={{ animationDelay: '0s' }}
                        >
                            <Card
                                className="text-center h-full"
                                hoverable={true}
                                customStyle={{
                                    backgroundColor: cardBgColor,
                                    boxShadow: cardShadow,
                                    border: 'none',
                                    borderRadius: '40px' // Rounded like pill button
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
                            className={`${isVisible ? 'animate-scaleIn' : 'opacity-0'}`}
                            style={{ animationDelay: '0.2s' }}
                        >
                            <Card
                                className="text-center h-full"
                                hoverable={true}
                                customStyle={{
                                    backgroundColor: cardBgColor,
                                    boxShadow: cardShadow,
                                    border: 'none',
                                    borderRadius: '40px' // Rounded like pill button
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
            </section >

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
            `}</style>
        </>
    )
}
