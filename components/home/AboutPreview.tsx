/**
 * About Preview Section
 * Gray background with heading, description, and CTA button
 * Responsive layout
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/shared/Button'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function AboutPreview() {
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

    return (
        <>
            <section
                ref={sectionRef}
                className="py-12 sm:py-16 md:py-20 relative overflow-hidden"
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

                <div className={`max-w-7xl mx-auto px-4 text-center relative z-10 ${isVisible ? 'animate-slideUpFade' : 'opacity-0'}`}>
                    <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
                        {/* Left Line */}
                        <div className="hidden sm:block h-[2px] w-12 sm:w-24 bg-white opacity-80 rounded-full"></div>

                        <h2
                            className="text-3xl sm:text-4xl md:text-5xl font-bold"
                            style={{ color: '#ffffff' }}
                        >
                            Mengenal SMB Suvanna Dipa
                        </h2>

                        {/* Right Line */}
                        <div className="hidden sm:block h-[2px] w-12 sm:w-24 bg-white opacity-80 rounded-full"></div>
                    </div>
                    <p
                        className="text-base sm:text-lg mb-6 sm:mb-8 mx-auto font-semibold px-4 sm:px-8 md:px-12 text-justify"
                        style={{ color: '#ffffff' }}
                    >
                        Sekolah Minggu Buddha Suvanna Dipa merupakan wadah pembelajaran dan pengembangan spiritual bagi anak-anak dan remaja Buddhist. Kami berkomitmen untuk memberikan pendidikan Dharma yang berkualitas dalam suasana yang menyenangkan dan penuh kasih sayang. Melalui berbagai kegiatan, kami membantu siswa memahami ajaran Buddha dan menerapkannya dalam kehidupan sehari-hari. Bergabunglah dengan kami untuk menumbuhkan benih kebajikan dan kebijaksanaan sejak dini.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/about')}
                        customStyle={{
                            backgroundColor: '#C25F1D', // Darker orange for button
                            color: '#ffffff',
                            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.4)' // Bright White Glow
                        }}
                    >
                        Selengkapnya Tentang Kami
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
