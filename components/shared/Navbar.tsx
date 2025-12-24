/**
 * Shared Navbar Component
 * Used across all portals (visitor, student, teacher, admin)
 * RESPONSIVE: Hamburger menu on mobile, full menu on desktop
 */

'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navLinks = [
        { href: '/', label: 'Beranda' },
        { href: '/about', label: 'Tentang' },
        { href: '/activities', label: 'Aktivitas' },
        { href: '/contact', label: 'Kontak' }
    ]

    return (
        <nav className="bg-gray-200 border-b-2 border-black">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="text-lg sm:text-xl font-bold text-black hover:text-gray-600">
                        SMB Suvanna Dipa
                    </Link>

                    {/* Desktop Navigation - Hidden on mobile */}
                    <div className="hidden md:flex gap-6 lg:gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-black font-medium hover:text-gray-600 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Hamburger Button - Shown only on mobile */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-black hover:text-gray-600"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu - Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t-2 border-gray-400 py-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block py-2 text-black font-medium hover:bg-gray-300 px-4"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    )
}
