/**
 * Vision & Mission Component
 * 2-column layout (Visi left, Misi right)
 * Stacks vertically on mobile
 * With gradient background, trapezoid decorations, and dark mode support
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/shared/ui/Cards'
import SectionHeader from '@/components/shared/layout/SectionHeader'

export default function AboutVisionMissionSection() {
    const [isVisible, setIsVisible] = useState(false)
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

    // Dynamic colors - White theme with orange accent
    const cardBgColor = '#C25F1D' // Darker orange (matching button)
    const cardShadow = '0 4px 20px rgba(255, 255, 255, 0.4)' // Bright White Glow (matching button)

    return (
        <>
            <section
                id="vision"
                ref={sectionRef}
                className="py-8 sm:py-10 md:py-12 relative overflow-hidden scroll-mt-40 min-h-[30vh] flex flex-col justify-center"
                style={{
                    backgroundColor: '#E57526' // Logo orange
                }}
            >


                <div className="max-w-7xl mx-auto px-4 relative z-10 my-4">
                    {/* Section Header */}
                    <SectionHeader
                        title="Visi & Misi"
                        color="#ffffff"
                        isVisible={isVisible}
                        className="mb-8 sm:mb-12"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
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
                                    className="text-sm sm:text-base font-bold text-justify px-4 sm:px-6"
                                    style={{ color: '#ffffff' }}
                                >
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis.
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
                                    className="text-sm sm:text-base font-bold text-justify px-4 sm:px-6"
                                    style={{ color: '#ffffff' }}
                                >
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis.
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
