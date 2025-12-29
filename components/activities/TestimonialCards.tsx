/**
 * Testimonial Cards Component
 * 3 testimonial cards with hover effects
 * Mobile: Auto-scrolling horizontal carousel
 * With dark mode support
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Card from '@/components/shared/Card'

export default function TestimonialCards() {
    const [isVisible, setIsVisible] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    const testimonials = [
        {
            name: 'Andi Wijaya',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante.'
        },
        {
            name: 'Siti Rahayu',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante.'
        },
        {
            name: 'Budi Santoso',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante.'
        }
    ]

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

    // Dark mode detection
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
        checkDarkMode()
        const observer = new MutationObserver(checkDarkMode)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })
        return () => observer.disconnect()
    }, [])

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

    // Dynamic colors
    const bgColor = isDarkMode ? '#BAE6FD' : '#FFEFD5' // Sky blue in dark, cream in light
    const titleColor = isDarkMode ? '#ea580c' : '#7c2d12' // Bright orange in dark, brownish in light
    const cardBgColor = isDarkMode ? 'var(--primary-600)' : 'var(--primary-900)' // Bright orange in dark, brownish in light
    const cardShadow = isDarkMode
        ? '0 0 20px rgba(252, 211, 77, 0.8), 0 4px 15px rgba(249, 115, 22, 0.4)'
        : '0 0 30px rgba(124, 45, 18, 0.6)' // Brownish shadow in light

    return (
        <>
            <section
                ref={sectionRef}
                className="py-8 sm:py-10"
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className={`${isVisible ? 'animate-scaleIn' : 'opacity-0'} hover-bounce`}
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                >
                                    <Card
                                        className="h-full"
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
