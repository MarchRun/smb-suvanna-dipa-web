/**
 * About Page
 * 4-Section Layout: Header, Image+Description, Vision/Mission, Quote
 * With dark mode support
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import PageHeader from '@/components/shared/PageHeader'
import VisionMission from '@/components/site/VisionMission'
import Quote from '@/components/site/Quote'

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

    // Dynamic colors
    const bgColor = isDarkMode ? '#BAE6FD' : '#FFEFD5' // Sky blue in dark, cream in light
    const textColor = isDarkMode ? '#ea580c' : '#7c2d12' // Bright orange in dark, brownish in light

    return (
        <>
            {/* Section 1: Page Header with dynamic background */}
            <PageHeader
                title="Tentang SMB Suvanna Dipa"
            />

            {/* Section 2: Image + Long Description */}
            <section
                ref={section2Ref}
                className="pt-4 pb-12 sm:pb-16"
                style={{ backgroundColor: bgColor }}
            >
                <div
                    className={`max-w-6xl mx-auto px-4 transition-all duration-700 ${section2Visible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-12'
                        }`}
                >
                    {/* SMB SD Logo */}
                    <div className="mb-8 sm:mb-12 flex justify-center">
                        <div className="relative w-full max-w-lg aspect-video rounded-lg overflow-hidden">
                            <Image
                                src="/images/logo-smbsd.png"
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
            </section>

            {/* Section 3: Vision & Mission */}
            <VisionMission />

            {/* Section 4: Quote */}
            <Quote />
        </>
    )
}
