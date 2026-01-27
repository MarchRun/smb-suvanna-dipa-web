/**
 * CTA Section Component
 * Call-to-action for community joining
 * Gray background with button
 */

'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import SectionHeader from '@/components/shared/SectionHeader'
import { useRouter } from 'next/navigation'
import Button from '@/components/shared/Button'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function HomeCTASection() {
    const router = useRouter()
    const [isVisible, setIsVisible] = useState(false)
    const isDarkMode = useDarkMode()
    const sectionRef = useRef<HTMLElement>(null)

    // Intersection Observer to detect when section is visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Trigger animation when section becomes visible
                if (entry.isIntersecting) {
                    setIsVisible(true)
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

    return (
        <>
            <section
                id="cta"
                ref={sectionRef}
                className="py-8 sm:py-10 md:py-12 relative overflow-hidden min-h-[30vh] flex flex-col justify-center"
                style={{
                    backgroundColor: '#E57526' // Logo orange
                }}
            >


                <div className={`max-w-7xl mx-auto px-4 text-center relative z-10 ${isVisible ? 'animate-slideUpFade' : 'opacity-0'}`}>
                    {/* Section Header */}
                    <SectionHeader
                        title="Bergabunglah Dengan Komunitas Kami"
                        color="#ffffff"
                        isVisible={isVisible}
                        className="mb-8"
                    />
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
                            backgroundColor: '#C25F1D', // Darker orange for button
                            color: '#ffffff',
                            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.4)' // Bright White Glow
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
