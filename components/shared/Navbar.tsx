/**
 * Enhanced Navbar - VIBRANT Warm Sunny Theme
 * Using CSS variables for colors with STRONGER orange presence
 */

'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const pathname = usePathname()
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Load dark mode preference from localStorage
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode')
        if (savedMode) {
            setIsDarkMode(savedMode === 'true')
        }
    }, [])

    // Apply dark mode when state changes
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('darkMode', isDarkMode.toString())
    }, [isDarkMode])

    // Scroll detection for header opacity
    useEffect(() => {
        const handleScroll = () => {
            // Change opacity after scrolling past ~80vh (hero section height)
            setScrolled(window.scrollY > window.innerHeight * 0.8)
        }

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

    return (
        <nav
            className="sticky top-0 z-50 transition-all duration-300"
            style={{
                backgroundColor: 'var(--accent-200)', // Solid warm yellow/orange
                backdropFilter: scrolled ? 'blur(12px)' : 'blur(8px)',
                boxShadow: '0 4px 12px rgba(217, 87, 20, 0.20), 0 2px 4px rgba(217, 87, 20, 0.12)',
                opacity: scrolled ? 0.85 : 1
            }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-6 sm:py-7">
                    {/* Logo - Bold Uppercase with Hover Effect and Entrance Animation */}
                    <Link
                        href="/"
                        className="text-2xl sm:text-3xl lg:text-4xl tracking-wide transition-all duration-200 hover:scale-110 uppercase animate-fadeIn"
                        style={{
                            color: 'var(--primary-900)',
                            fontFamily: 'var(--font-brand)',
                            fontWeight: 900,
                            animationDelay: '0.8s' // Appears last
                        }}
                    >
                        SMB Suvanna Dipa
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
                                        color: isActive ? '#ffffff' : 'var(--primary-900)',
                                        fontWeight: isActive ? 800 : 700,
                                        textShadow: isActive ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.15)',
                                        animationDelay: `${index * 0.1}s` // Stagger: 0s, 0.1s, 0.2s, 0.3s
                                    }}
                                >
                                    {/* Animated rounded background box */}
                                    <span
                                        className={`absolute inset-0 rounded-xl transition-all duration-300 -z-10 ${isActive ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                                            }`}
                                        style={{
                                            background: isActive
                                                ? 'var(--primary-900)' // Dark brown solid for active
                                                : 'rgba(255, 255, 255, 0.5)' // Light semi-transparent for hover
                                        }}
                                    />
                                    {link.label}
                                </Link>
                            )
                        })}

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="ml-2 p-2 rounded-full transition-all duration-300 hover:scale-110 animate-fadeInDown"
                            style={{
                                color: 'var(--primary-900)',
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                border: '3px solid var(--primary-900)', // Thick border matching icon color
                                animationDelay: '0.4s'
                            }}
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                /* Moon icon for dark mode */
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            ) : (
                                /* Sun icon for light mode */
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                            )}
                        </button>
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
                            color: 'var(--primary-900)'
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
                            borderColor: 'var(--primary-600)',
                            backgroundColor: 'var(--primary-900)' // Solid dark brown
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
                                            color: isActive ? '#ffffff' : 'var(--primary-50)',
                                            backgroundColor: isActive ? 'var(--primary-600)' : 'rgba(255, 255, 255, 0.1)',
                                            fontWeight: isActive ? 800 : 700
                                        }}
                                        onClick={() => handleMenuClose()}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}

                            {/* Dark Mode Toggle for Mobile */}
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="mt-2 px-4 py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                                style={{
                                    color: 'var(--primary-50)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    border: '3px solid var(--primary-50)' // Thick border matching icon color for mobile
                                }}
                                aria-label="Toggle dark mode"
                            >
                                {isDarkMode ? (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                        </svg>
                                        <span className="text-lg font-bold">Dark Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                        </svg>
                                        <span className="text-lg font-bold">Light Mode</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
