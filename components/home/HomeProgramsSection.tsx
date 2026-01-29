'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/shared/ui/Cards'
import SectionHeader from '@/components/shared/layout/SectionHeader'

export default function HomeProgramsSection() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    const programs = [
        {
            title: 'Pujabakti & Meditasi',
            description: 'Membangun kedamaian batin melalui doa dan latihan meditasi rutin setiap minggu.',
            iconType: 'lotus'
        },
        {
            title: 'Pembelajaran Dhamma',
            description: 'Kelas interaktif mengenal ajaran Buddha, moralitas, dan budi pekerti luhur.',
            iconType: 'book'
        },
        {
            title: 'Kreativitas & Seni',
            description: 'Mengasah bakat melalui seni, nyanyian buddhis, dan berbagai aktivitas kreatif.',
            iconType: 'palette'
        }
    ]

    // Intersection Observer to detect when section is visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
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
            case 'lotus':
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor" style={{ color: iconColor }}>
                        <path d="M12 2c0 0-7 6-7 12 0 4 5 7 7 7s7-3 7-7c0-6-7-12-7-12zm0 15c-1.4 0-2.5-1.1-2.5-2.5S10.6 12 12 12s2.5 1.1 2.5 2.5S13.4 17 12 17z" />
                    </svg>
                )
            case 'book':
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor" style={{ color: iconColor }}>
                        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                    </svg>
                )
            case 'palette':
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor" style={{ color: iconColor }}>
                        <path d="M12 3a9 9 0 0 0 0 18c4.97 0 9-3.58 9-8a9 9 0 0 0-9-10zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1.5-10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-3 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-3 4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm9 3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
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
                className="py-8 sm:py-10 md:py-12 min-h-[30vh] flex flex-col justify-center"
                style={{ backgroundColor: 'var(--background)' }} // Cream background
            >
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeader
                        title="Program Unggulan Kami"
                        color="#E57526"
                        isVisible={isVisible}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {programs.map((program, index) => (
                            <div
                                key={index}
                                className={`${isVisible ? 'animate-scaleIn' : 'opacity-0'}`}
                                style={{
                                    animationDelay: `${index * 0.2}s`,
                                }}
                            >
                                <Card
                                    className="text-center h-full"
                                    hoverable={true}
                                    customStyle={{
                                        backgroundColor: '#E57526', // Logo orange
                                        boxShadow: 'none',
                                        borderRadius: '32px' // More rounded
                                    }}
                                >
                                    {/* Icon - SVG single color with glow */}
                                    <div className="mb-4 flex justify-center">
                                        {renderIcon(program.iconType)}
                                    </div>

                                    <h3
                                        className="text-lg sm:text-xl font-bold mb-2"
                                        style={{ color: '#ffffff' }}
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
            `}</style>
        </>
    )
}
