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
        <div className="flex flex-col min-h-screen">
            {/* PageHeader included in flow */}
            <PageHeader
                title="Kontak"
            />

            {/* Map Section - Fills remaining space */}
            <section
                id="location"
                className="scroll-mt-40 flex-grow flex flex-col"
                style={{
                    backgroundColor: bgColor,
                    padding: '0' // Remove padding from section to allow full edge-to-edge if needed, but inner div handles it
                }}
            >
                <div className="max-w-7xl mx-auto px-4 w-full flex-grow flex flex-col justify-between py-8">
                    <div
                        className="mb-0 rounded-none overflow-hidden shadow-lg relative group w-full mx-auto"
                        style={{
                            border: `4px solid ${borderColor}`,
                            height: '250px',
                            backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6'
                        }}
                    >
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src="https://maps.google.com/maps?q=Vihara%20Suvanna%20Dipa%20Bandar%20Lampung&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            title="Lokasi Vihara Suvanna Dipa"
                        ></iframe>
                    </div>

                    {/* Contact Info Cards - Merged into same section */}
                    <ContactCards />
                </div>
            </section>
        </div>
    )
}
