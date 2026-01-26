/**
 * Testimonial Cards Component
 * 3 testimonial cards with hover effects
 * Mobile: Auto-scrolling horizontal carousel
 * With dark mode support - Fetches from database
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Card from '@/components/shared/Card'
import { useDarkMode } from '@/hooks/useDarkMode'
import { getPublicContentBySection, type TestimonialItem } from '@/actions/admin/publicContent'

export default function TestimonialCards() {
    const [isVisible, setIsVisible] = useState(false)
    const isDarkMode = useDarkMode()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [testimonials, setTestimonials] = useState<{ name: string; text: string }[]>([])
    const [loading, setLoading] = useState(true)
    const sectionRef = useRef<HTMLElement>(null)

    // Fetch testimonials data from database
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const result = await getPublicContentBySection('testimonials')
                if (result.success && result.data?.content?.items) {
                    const dbItems: TestimonialItem[] = result.data.content.items
                    // Map database items to testimonial format
                    const mappedTestimonials = dbItems
                        .map((item) => ({
                            name: item.name || '',
                            text: item.description || ''
                        }))
                        .filter(t => t.name || t.text) // Only include non-empty items
                    setTestimonials(mappedTestimonials)
                }
            } catch (error) {
                console.error('Error fetching testimonials:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchTestimonials()
    }, [])


    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768) // md breakpoint
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Auto-scroll for mobile
    useEffect(() => {
        if (!isMobile) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        }, 4000) // 4 seconds

        return () => clearInterval(interval)
    }, [isMobile, testimonials.length])

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

    // Dynamic colors - White theme with orange accent
    const bgColor = '#FFFFFF' // White background
    const titleColor = '#E57526' // Logo orange
    const cardBgColor = '#E57526' // Logo orange
    const cardShadow = '0 4px 15px rgba(229, 117, 38, 0.4)'

    return (
        <>
            <section
                id="testimonials"
                ref={sectionRef}
                className="py-8 sm:py-10 scroll-mt-40"
                style={{ backgroundColor: bgColor }}
            >
                <div className="max-w-6xl mx-auto px-4">
                    {/* Section Title */}
                    <h2
                        className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ color: titleColor }}
                    >
                        Testimoni
                    </h2>

                    {loading ? (
                        <div className="text-center py-8" style={{ color: titleColor }}>Loading...</div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center py-8 opacity-70" style={{ color: titleColor }}>
                            Belum ada testimoni. Silakan tambahkan melalui halaman admin.
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
                                        {testimonials.map((testimonial, index) => (
                                            <div
                                                key={index}
                                                className="w-full flex-shrink-0 px-2"
                                            >
                                                <Card
                                                    customStyle={{
                                                        backgroundColor: cardBgColor,
                                                        boxShadow: cardShadow,
                                                    }}
                                                >
                                                    <h3
                                                        className="text-lg font-bold mb-3 text-left"
                                                        style={{ color: '#ffffff' }}
                                                    >
                                                        {testimonial.name}
                                                    </h3>
                                                    <p
                                                        className="text-sm italic text-justify"
                                                        style={{ color: '#ffffff' }}
                                                    >
                                                        &quot;{testimonial.text}&quot;
                                                    </p>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Dot Indicators */}
                                    <div className="flex justify-center items-center gap-2 mt-4">
                                        {testimonials.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentIndex(index)}
                                                className="transition-all duration-300 rounded-full"
                                                style={{
                                                    width: index === currentIndex ? '24px' : '8px',
                                                    height: '24px',
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                                    {testimonials.map((testimonial, index) => (
                                        <div
                                            key={index}
                                            className={`${isVisible ? 'animate-scaleIn' : 'opacity-0'}`}
                                            style={{ animationDelay: `${index * 0.15}s` }}
                                        >
                                            <Card
                                                className="h-full"
                                                hoverable={true}
                                                customStyle={{
                                                    backgroundColor: cardBgColor,
                                                    boxShadow: cardShadow,
                                                }}
                                            >
                                                <h3
                                                    className="text-lg sm:text-xl font-bold mb-3 text-left"
                                                    style={{ color: '#ffffff' }}
                                                >
                                                    {testimonial.name}
                                                </h3>
                                                <p
                                                    className="text-sm sm:text-base italic text-justify"
                                                    style={{ color: '#ffffff' }}
                                                >
                                                    &quot;{testimonial.text}&quot;
                                                </p>
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
