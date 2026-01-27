/**
 * Contact Cards Component
 * 4 contact information cards with Material Icons
 * With dark mode support
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Card from '@/components/shared/Card'
import SectionHeader from '@/components/shared/SectionHeader'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function ContactInfoSection() {
    const [isVisible, setIsVisible] = useState(false)
    const isDarkMode = useDarkMode()
    const sectionRef = useRef<HTMLDivElement>(null)

    const contacts = [
        {
            iconType: 'location',
            title: 'Alamat',
            info: 'Jl. Basuki Rahmat No.14, Gedong Pakuon, Teluk Betung Selatan, Bandar Lampung'
        },
        {
            iconType: 'phone',
            title: 'Telepon',
            info: '+62 812 3456 7890'
        },
        {
            iconType: 'email',
            title: 'Email',
            info: 'smbsuvannadipa@gmail.com'
        },
        {
            iconType: 'instagram',
            title: 'Instagram',
            info: '@smb.suvannadipa'
        }
    ]

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

    // Dynamic colors - White theme with orange accent
    const bgColor = '#FFFFFF' // White background
    const cardBgColor = '#E57526' // Logo orange
    const cardShadow = 'none'

    // Material Icons as SVG
    const renderIcon = (iconType: string) => {
        const iconStyle = {
            width: '40px',
            height: '40px',
            color: '#ffffff',
            // filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))' // Removed
        }

        switch (iconType) {
            case 'location':
                return (
                    <svg style={iconStyle} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                )
            case 'phone':
                return (
                    <svg style={iconStyle} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                )
            case 'email':
                return (
                    <svg style={iconStyle} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                )
            case 'instagram':
                return (
                    <svg style={iconStyle} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                    </svg>
                )
            default:
                return null
        }
    }

    return (
        <>
            <div
                ref={sectionRef}
                className="w-full py-8 sm:py-10 md:py-12"
            >
                <div className="max-w-7xl mx-auto px-4 z-10 relative">
                    {/* Section Header */}
                    <SectionHeader
                        title="Informasi Kontak"
                        color="#E57526" // Orange to match other sections
                        isVisible={isVisible}
                        className="mb-8 sm:mb-12"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {contacts.map((contact, index) => (
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
                                        borderRadius: '32px'
                                    }}
                                >
                                    {/* Icon */}
                                    <div className="mb-4 flex justify-center">
                                        {renderIcon(contact.iconType)}
                                    </div>

                                    <h3
                                        className="text-lg sm:text-xl font-bold mb-2"
                                        style={{ color: '#ffffff' }}
                                    >
                                        {contact.title}
                                    </h3>
                                    <p
                                        className="text-sm sm:text-base font-bold"
                                        style={{ color: '#ffffff' }}
                                    >
                                        {contact.info}
                                    </p>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

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

                :global(.animate-scaleIn) {
                    animation: scaleIn 0.6s ease-out forwards;
                }
            `}</style>
        </>
    )
}
