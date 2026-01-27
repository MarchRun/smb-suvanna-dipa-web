/**
 * About Preview Section
 * Gray background with heading, description, and CTA button
 * Responsive layout
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import SectionHeader from '@/components/shared/SectionHeader'
import Button from '@/components/shared/Button'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function HomeAboutSection() {
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
                    observer.unobserve(entry.target) // Stop observing once visible
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
                className="py-8 sm:py-10 md:py-12 relative overflow-hidden min-h-[30vh] flex flex-col justify-center"
                style={{
                    backgroundColor: '#E57526' // Logo orange
                }}
            >


                <div className={`max-w-7xl mx-auto px-4 text-center relative z-10 ${isVisible ? 'animate-slideUpFade' : 'opacity-0'}`}>
                    {/* Section Header */}
                    <SectionHeader
                        title="Tentang Kami"
                        color="#ffffff"
                        isVisible={isVisible}
                        className="mb-8"
                    />
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
