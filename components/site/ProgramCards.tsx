/**
 * Program Cards Section
 * 3 cards showcasing programs
 * Responsive: 1 column mobile, 3 columns desktop
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Card from '@/components/shared/Card'

export default function ProgramCards() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    const programs = [
        {
            title: 'Lorem ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            iconType: 'star'
        },
        {
            title: 'Lorem ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            iconType: 'book'
        },
        {
            title: 'Lorem ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            iconType: 'medal'
        }
    ]

    // Intersection Observer to detect when section is visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(false)
                    setTimeout(() => setIsVisible(true), 50)
                }
            },
            {
                threshold: 0.3,
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

    const renderIcon = (iconType: string) => {
        const iconColor = '#FFF8E7' // Cream color
        const iconSize = '48px'

        switch (iconType) {
            case 'star':
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 12px rgba(252, 211, 77, 1)) drop-shadow(0 0 20px rgba(255, 248, 231, 0.8))' }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={iconColor} />
                    </svg>
                )
            case 'book':
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 12px rgba(252, 211, 77, 1)) drop-shadow(0 0 20px rgba(255, 248, 231, 0.8))' }}>
                        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" fill={iconColor} />
                    </svg>
                )
            case 'medal':
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 12px rgba(252, 211, 77, 1)) drop-shadow(0 0 20px rgba(255, 248, 231, 0.8))' }}>
                        <circle cx="12" cy="15" r="5" fill={iconColor} />
                        <path d="M12 10.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 6.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill={iconColor} />
                        <path d="M14.5 2L12 6 9.5 2 8 9l4 1.5L16 9z" fill={iconColor} />
                    </svg>
                )
            default:
                return null
        }
    }

    return (
        <>
            <section
                ref={sectionRef}
                className="py-12 sm:py-16 md:py-20"
                style={{ backgroundColor: '#FFEFD5' }} // Richer cream background (Papaya Whip)
            >
                <div className="max-w-6xl mx-auto px-4">
                    <h2
                        className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 ${isVisible ? 'animate-slideUpFade' : 'opacity-0'}`}
                        style={{ color: '#7c2d12' }} // SMB Suvanna Dipa color (dark brown/maroon)
                    >
                        Program Unggulan Kami
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {programs.map((program, index) => (
                            <div
                                key={index}
                                className={`${isVisible ? 'animate-scaleIn' : 'opacity-0'} hover-bounce`}
                                style={{
                                    animationDelay: `${index * 0.2}s`,
                                }}
                            >
                                <Card
                                    className="text-center h-full"
                                    customStyle={{
                                        backgroundColor: 'var(--primary-500)',
                                        boxShadow: '0 10px 30px rgba(249, 115, 22, 0.5), 0 0 40px rgba(252, 211, 77, 0.3)',
                                    }}
                                >
                                    {/* Icon - SVG single color with glow */}
                                    <div className="mb-4 flex justify-center">
                                        {renderIcon(program.iconType)}
                                    </div>

                                    <h3
                                        className="text-lg sm:text-xl font-bold mb-2"
                                        style={{ color: '#7c2d12' }}
                                    >
                                        {program.title}
                                    </h3>
                                    <p
                                        className="text-sm sm:text-base font-bold"
                                        style={{ color: '#ffffff' }}
                                    >
                                        {program.description}
                                    </p>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes scaleIn {
                    from {
                        transform: scale(0);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
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
