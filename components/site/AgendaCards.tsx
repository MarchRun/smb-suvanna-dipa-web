/**
 * Agenda Cards Component
 * 4 yearly activity cards with hover effects
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Card from '@/components/shared/Card'

export default function AgendaCards() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    const activities = [
        { title: 'Waisak' },
        { title: 'Kathina' },
        { title: 'Asadha' },
        { title: 'Magha Puja' }
    ]

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            { threshold: 0.2 }
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

    return (
        <>
            <section
                ref={sectionRef}
                className="py-12 sm:py-16"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
                <div className="max-w-6xl mx-auto px-4">
                    {/* Section Title */}
                    <h2
                        className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ color: 'var(--primary-700)' }}
                    >
                        Agenda Tahunan Kegiatan SMB
                    </h2>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {activities.map((activity, index) => (
                            <div
                                key={index}
                                className={`${isVisible ? 'animate-scaleIn' : 'opacity-0'} hover-bounce`}
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >
                                <Card
                                    className="text-center h-full"
                                    customStyle={{
                                        backgroundColor: 'var(--primary-500)',
                                        boxShadow: '0 10px 30px rgba(249, 115, 22, 0.5), 0 0 40px rgba(252, 211, 77, 0.3)',
                                    }}
                                >
                                    <h3
                                        className="text-lg sm:text-xl font-bold"
                                        style={{ color: '#ffffff' }}
                                    >
                                        {activity.title}
                                    </h3>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx>{`
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
