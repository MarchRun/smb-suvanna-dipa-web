'use client'

import React, { useState, useEffect, useRef } from 'react'

interface PageHeaderProps {
    title: string
    subtitle?: string
    align?: 'left' | 'center' | 'right'
    backgroundImage?: string
}

export default function PageHeader({
    title,
    subtitle,
    align = 'center',
    backgroundImage = '/images/smbsd-bg-hd.jpg' // Default to the Vihara image
}: PageHeaderProps) {
    const [displayedTitle, setDisplayedTitle] = useState('')
    const [showCursor, setShowCursor] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    const alignmentClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            { threshold: 0.5 }
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

    useEffect(() => {
        if (!isVisible) {
            setDisplayedTitle('')
            setShowCursor(true)
            return
        }

        setDisplayedTitle('')
        setShowCursor(true)
        let currentIndex = 0
        const typingInterval = setInterval(() => {
            if (currentIndex < title.length) {
                setDisplayedTitle(title.substring(0, currentIndex + 1))
                currentIndex++
            } else {
                clearInterval(typingInterval)
                setShowCursor(false)
            }
        }, 80)

        return () => clearInterval(typingInterval)
    }, [title, isVisible])

    const titleColor = '#FFFFFF'

    return (
        <section
            ref={sectionRef}
            className="relative py-2 sm:py-4"
            style={{
                paddingTop: '80px',
                minHeight: '150px' // Reduced height further
            }}
        >
            <div className="absolute inset-0 z-0 opacity-40">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'top',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: '#E57526' // Fallback
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
                <div className={alignmentClass[align]}>
                    <div className={`flex items-center gap-4 leading-tight ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
                        <div className="hidden sm:block h-[2px] w-8 sm:w-16 bg-[#FFFFFF] opacity-80 rounded-full"></div>

                        <h1
                            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-center sm:text-left drop-shadow-md"
                            style={{ color: titleColor }}
                        >
                            {displayedTitle}
                            <span
                                className="inline-block w-1 ml-1"
                                style={{
                                    backgroundColor: showCursor ? titleColor : 'transparent',
                                    height: '1em',
                                    verticalAlign: 'text-bottom'
                                }}
                            />
                        </h1>

                        <div className="hidden sm:block h-[2px] w-8 sm:w-16 bg-[#FFFFFF] opacity-80 rounded-full"></div>
                    </div>

                    {subtitle && (
                        <p
                            className="text-sm sm:text-base md:text-lg px-4 mt-1 font-medium"
                            style={{ color: '#F3F4F6' }}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}
