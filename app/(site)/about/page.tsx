/**
 * About Page
 * 4-Section Layout: Header, Image+Description, Vision/Mission, Quote
 * With dark mode support
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import PageHeader from '@/components/shared/PageHeader'
import AboutVisionMissionSection from '@/components/about/AboutVisionMissionSection'
import AboutQuoteSection from '@/components/about/AboutQuoteSection'

export default function AboutPage() {
    const [section2Visible, setSection2Visible] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const section2Ref = useRef<HTMLElement>(null)

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

    // Intersection Observer for section 2 - refreshes on re-entry
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Track both entering and leaving
                setSection2Visible(entry.isIntersecting)
            },
            { threshold: 0.2 }
        )

        if (section2Ref.current) {
            observer.observe(section2Ref.current)
        }

        return () => {
            if (section2Ref.current) {
                observer.unobserve(section2Ref.current)
            }
        }
    }, [])

    // Dynamic colors - Dark text on Cream background
    const bgColor = 'var(--background)' // Cream background
    const textColor = '#4A4A4A' // Gray text for readability

    return (
        <>
            <div className="flex flex-col min-h-screen">
                {/* Section 1: Page Header with dynamic background */}
                <PageHeader
                    title="Tentang"
                />

                {/* Section 2: Image + Long Description */}
                <section
                    id="profile"
                    ref={section2Ref}
                    className="pb-12 sm:pb-16 scroll-mt-40 flex-grow flex flex-col justify-center"
                    style={{ backgroundColor: bgColor }}
                >
                    <div
                        className={`max-w-6xl mx-auto px-4 transition-all duration-700 ${section2Visible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-12'
                            }`}
                    >
                        {/* SMB SD Logo */}
                        <div className="mb-6 sm:mb-8 flex justify-center">
                            <div className="relative w-full max-w-xs aspect-video rounded-lg overflow-hidden">
                                <Image
                                    src="/images/logo-smbsd-v2.png"
                                    alt="Logo SMB Suvanna Dipa"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Long Description */}
                        <div>
                            <p className="text-base sm:text-lg leading-relaxed text-justify" style={{ color: textColor }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante. Aliquam in mauris feugiat, viverra enim quis, lobortis nunc. Maecenas ut tristique lacus, eu elementum ante. Integer sodio felis elit, vulgutate isneret nulla euismod, consectetur et massa sed. Integer euismod vulputate lacerat, placerat at sollicitudin in, igestas at odio. Quisque scelerisque elit amet risus porttitor. In imperdiet et fringilla. Donec condimentum pretium vitae augue laoreet lacus eu condimentum. Non risus vinia, mauris eros in sollicitudin sem. Nunc duis quam. Donec cursus lobortis tincus. Phasellus ac molestie nisl, a sollicitudin dolor.
                            </p>
                        </div>
                    </div>
                </section >
            </div>

            {/* Section 3: Vision & Mission */}
            < AboutVisionMissionSection />

            {/* Section 4: Quote */}
            < AboutQuoteSection />
        </>
    )
}
