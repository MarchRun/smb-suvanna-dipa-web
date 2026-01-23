/**
 * Enhanced Navbar - VIBRANT Warm Sunny Theme
 * Using CSS variables for colors with STRONGER orange presence
 * Light mode only
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)

    // Scroll detection for header background change
    useEffect(() => {
        const handleScroll = () => {
            // Change background after scrolling past 100px
            setScrolled(window.scrollY > 100)
        }

        // Check initial scroll position
        handleScroll()

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { href: '/', label: 'Beranda' },
        { href: '/about', label: 'Tentang' },
        { href: '/activities', label: 'Aktivitas' },
        { href: '/contact', label: 'Kontak' }
    ]

    const handleMenuClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setMobileMenuOpen(false)
            setIsClosing(false)
        }, 400) // Match slideUp animation duration
    }

    // Orange color matching the logo
    const orangeColor = '#E57526'

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
            style={{
                backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                boxShadow: scrolled ? '0 4px 20px rgba(229, 117, 38, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)' : 'none'
            }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-3 sm:py-4">
                    {/* Logo - Large with overflow effect */}
                    <Link
                        href="/"
                        className="transition-all duration-200 hover:scale-105 animate-fadeIn flex items-center"
                        style={{
                            animationDelay: '0.8s',
                            marginTop: '-8px',
                            marginBottom: '-8px'
                        }}
                    >
                        <Image
                            src="/images/logo-smbsd-orange.png"
                            alt="SMB Suvanna Dipa"
                            width={400}
                            height={400}
                            className="h-16 sm:h-20 md:h-24 w-auto object-contain"
                            style={{ mixBlendMode: 'multiply' }}
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-6">
                        {navLinks.map((link, index) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-4 py-2 text-lg transition-all duration-300 overflow-visible group animate-fadeInDown"
                                    style={{
                                        color: isActive ? '#ffffff' : '#1a1a1a',
                                        fontWeight: isActive ? 800 : 700,
                                        textShadow: isActive ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
                                        animationDelay: `${index * 0.1}s` // Stagger: 0s, 0.1s, 0.2s, 0.3s
                                    }}
                                >
                                    {/* Animated rounded background box */}
                                    <span
                                        className={`absolute inset-0 rounded-xl transition-all duration-300 -z-10 ${isActive ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                                            }`}
                                        style={{
                                            background: isActive
                                                ? orangeColor
                                                : 'rgba(229, 117, 38, 0.1)' // Light orange for hover
                                        }}
                                    />
                                    {link.label}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => {
                            if (mobileMenuOpen) {
                                handleMenuClose()
                            } else {
                                setMobileMenuOpen(true)
                            }
                        }}
                        className="md:hidden p-3 transition-all"
                        style={{
                            color: orangeColor
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

                {mobileMenuOpen && (
                    <div
                        className={`md:hidden border-t-2 overflow-hidden ${isClosing ? 'animate-slideUp' : 'animate-slideDown'}`}
                        style={{
                            borderColor: orangeColor,
                            backgroundColor: '#D35400' // Darker orange
                        }}
                    >
                        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="px-4 py-3 rounded-2xl text-lg font-semibold transition-all duration-200"
                                        style={{
                                            color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
                                            backgroundColor: isActive ? orangeColor : 'rgba(255, 255, 255, 0.1)',
                                            fontWeight: isActive ? 800 : 700
                                        }}
                                        onClick={() => handleMenuClose()}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
