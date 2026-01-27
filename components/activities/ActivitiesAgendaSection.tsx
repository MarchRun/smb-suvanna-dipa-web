/**
 * Agenda Cards Component
 * 4 yearly activity cards with hover effects
 * Mobile: Auto-scrolling horizontal carousel
 * With dark mode support - Fetches from database
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Card from '@/components/shared/Card'
import SectionHeader from '@/components/shared/SectionHeader'
import { useDarkMode } from '@/hooks/useDarkMode'
import { getPublicContentBySection } from '@/actions/admin/publicContent'

export default function ActivitiesAgendaSection() {
    const [isVisible, setIsVisible] = useState(false)
    const isDarkMode = useDarkMode()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [activities, setActivities] = useState<{ title: string }[]>([])
    const [loading, setLoading] = useState(true)
    const sectionRef = useRef<HTMLElement>(null)

    // Fetch agenda data from database
    useEffect(() => {
        const fetchAgenda = async () => {
            try {
                const result = await getPublicContentBySection('activities')
                if (result.success && result.data?.content?.agenda) {
                    const agendaItems: string[] = result.data.content.agenda
                    // Map database items to activity format
                    const mappedActivities = agendaItems
                        .map((item) => ({ title: item }))
                        .filter(a => a.title) // Only include non-empty items
                    setActivities(mappedActivities)
                }
            } catch (error) {
                console.error('Error fetching agenda:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAgenda()
    }, [])


    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640) // sm breakpoint
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Auto-scroll for mobile
    useEffect(() => {
        if (!isMobile) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activities.length)
        }, 3000) // 3 seconds

        return () => clearInterval(interval)
    }, [isMobile, activities.length])

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
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

    // Dynamic colors - Cream theme with orange accent
    const bgColor = 'var(--background)' // Cream background
    const titleColor = '#E57526' // Logo orange
    const cardBgColor = '#E57526' // Logo orange
    const cardShadow = '0 4px 15px rgba(229, 117, 38, 0.4)'

    return (
        <>
            <section
                id="agenda"
                ref={sectionRef}
                className="py-8 sm:py-10 md:py-12 scroll-mt-40 min-h-[20vh] flex flex-col justify-center"
                style={{ backgroundColor: bgColor }}
            >
                <div className="max-w-7xl mx-auto px-4">
                    {/* Section Title */}
                    <SectionHeader
                        title="Agenda Tahunan Kegiatan"
                        color={titleColor}
                        isVisible={isVisible}
                        className="mb-6 sm:mb-8"
                    />

                    {loading ? (
                        <div className="text-center py-8" style={{ color: titleColor }}>Loading...</div>
                    ) : activities.length === 0 ? (
                        <div className="text-center py-8 opacity-70" style={{ color: titleColor }}>
                            Belum ada agenda kegiatan. Silakan tambahkan melalui halaman admin.
                        </div>
                    ) : (
                        <>
                            {/* Mobile Carousel */}
                            {isMobile ? (
                                <div className="relative overflow-hidden">
                                    <div
                                        className="flex transition-transform duration-500 ease-in-out"
                                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                    >
                                        {activities.map((activity, index) => (
                                            <div
                                                key={index}
                                                className="w-full flex-shrink-0 px-4"
                                            >
                                                <Card
                                                    className="text-center"
                                                    customStyle={{
                                                        backgroundColor: cardBgColor,
                                                        boxShadow: cardShadow,
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

                                    {/* Dot Indicators */}
                                    <div className="flex justify-center items-center gap-2 mt-4">
                                        {activities.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentIndex(index)}
                                                className="transition-all duration-300 rounded-full"
                                                style={{
                                                    width: index === currentIndex ? '24px' : '8px',
                                                    height: '8px',
                                                    backgroundColor: index === currentIndex
                                                        ? titleColor
                                                        : 'rgba(124, 45, 18, 0.3)',
                                                }}
                                                aria-label={`Go to slide ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Desktop Grid */
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
                                    {activities.map((activity, index) => (
                                        <div
                                            key={index}
                                            className={`${isVisible ? 'animate-scaleIn' : 'opacity-0'}`}
                                            style={{ animationDelay: `${index * 0.15}s` }}
                                        >
                                            <Card
                                                className="text-center h-full"
                                                hoverable={true}
                                                customStyle={{
                                                    backgroundColor: cardBgColor,
                                                    boxShadow: cardShadow,
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
                            )}
                        </>
                    )}
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
            `}</style>
        </>
    )
}

