/**
 * Enhanced Navbar - VIBRANT Warm Sunny Theme
 * Using CSS variables for colors with STRONGER orange presence
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
        <nav
            className="border-b-4 shadow-lg"
            style={{
                background: 'linear-gradient(135deg, var(--primary-400) 0%, var(--accent-300) 50%, var(--primary-400) 100%)',
                borderBottomColor: 'var(--primary-600)'
            }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-6 sm:py-7">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold transition-all duration-200 hover:scale-105"
                        style={{ color: 'var(--primary-900)' }}
                    >
                        SMB Suvanna Dipa
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex gap-4 lg:gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="font-bold text-lg px-4 py-2 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-md"
                                style={{
                                    color: 'var(--primary-900)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)'
                                    e.currentTarget.style.color = 'var(--primary-800)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
                                    e.currentTarget.style.color = 'var(--primary-900)'
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-3 transition-all rounded-lg shadow-md"
                        style={{
                            color: 'var(--primary-900)',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)'
                        }}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div
                        className="md:hidden border-t-4 py-4 space-y-2"
                        style={{
                            borderTopColor: 'var(--primary-600)',
                            background: 'linear-gradient(to bottom, var(--primary-300), var(--accent-200))'
                        }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block py-3 px-4 font-bold text-lg rounded-lg transition-all shadow-sm"
                                style={{
                                    color: 'var(--primary-900)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.4)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'
                                }}
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
