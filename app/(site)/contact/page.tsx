/**
 * Contact Page
 * Displays contact information with map and contact details
 * With dark mode support
 */

'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import ContactCards from '@/components/contact/ContactCards'

export default function ContactPage() {
    const [isDarkMode, setIsDarkMode] = useState(false)

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

    // Dynamic colors - White theme with orange accent
    const bgColor = '#FFFFFF' // White background
    const borderColor = '#E57526' // Logo orange

    return (
        <>
            {/* Page Header with dynamic background */}
            <PageHeader
                title="Kontak"
            />

            {/* Map Section */}
            <section
                id="location"
                className="scroll-mt-40 flex items-center justify-center"
                style={{
                    backgroundColor: bgColor,
                    minHeight: 'calc(100vh - 80px)', // Viewport minus header
                    padding: '2rem 1rem' // Default padding
                }}
            >
                <div className="max-w-7xl mx-auto px-4 w-full">
                    <div
                        className="mb-0 rounded-lg overflow-hidden shadow-lg relative group w-full max-w-4xl mx-auto"
                        style={{
                            border: `4px solid ${borderColor}`,
                            height: '350px',
                            backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6'
                        }}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: 'radial-gradient(#E57526 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}></div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-[#E57526]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>

                            <h3 className="text-2xl font-bold mb-2 text-[#E57526]">Lokasi Vihara</h3>
                            <p className="max-w-md mb-6 font-medium text-gray-600 dark:text-gray-300">
                                Vihara Suvanna Dipa<br />
                                Jl. Basuki Rahmat No.14, Gedong Pakuon, Teluk Betung Selatan, Bandar Lampung
                            </p>

                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Vihara+Suvanna+Dipa+Bandar+Lampung"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 rounded-full font-bold text-white transition-transform hover:scale-105 shadow-xl flex items-center gap-2"
                                style={{ backgroundColor: '#E57526' }}
                            >
                                <span>Buka di Google Maps</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Contact Info Cards - Merged into same section */}
                    <ContactCards />
                </div>
            </section>
        </>
    )
}
