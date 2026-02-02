'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { getCurrentYear } from '@/lib/utils'

// --- Navbar Component ---

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
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
        }, 400)
    }

    const orangeColor = '#E57526'

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 min-h-[80px] sm:min-h-[100px]"
            style={{
                backgroundColor: scrolled ? 'var(--background)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                boxShadow: 'none',
                borderBottom: scrolled ? '2px solid #E57526' : 'none'
            }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="relative flex justify-center md:justify-between items-center">
                    <Link
                        href="/"
                        className="transition-all duration-200 hover:scale-105 animate-fadeIn flex items-center my-1 md:ml-2 relative justify-center"
                        style={{
                            animationDelay: '0.8s',
                        }}
                    >
                        <svg
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`absolute w-[350%] h-[200%] -z-10 transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
                            style={{
                                left: '50%',
                                top: '55%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <path
                                fill="#ffffff"
                                d="M57.1,-22.4C68.6,-9.3,69.1,11.5,60.5,27.1C51.9,42.7,34.2,53.1,16.2,55.9C-1.8,58.7,-20.1,53.9,-35,41.9C-49.9,29.9,-61.4,10.7,-58.5,-3.8C-55.6,-18.3,-38.3,-28.1,-23.1,-39.8C-7.9,-51.5,5.2,-65.1,15.8,-63.1C26.4,-61.1,34.5,-43.5,45.6,-31Z"
                                transform="translate(100 100) scale(1.8 0.7)"
                            />
                        </svg>

                        <Image
                            src="/images/logo-smbsd-v2.png"
                            alt="SMB Suvanna Dipa"
                            width={400}
                            height={400}
                            className="h-16 sm:h-20 w-auto object-contain relative z-10"
                            style={{ mixBlendMode: 'multiply' }}
                            priority
                        />
                    </Link>

                    <div className="hidden md:flex items-center gap-2 lg:gap-4 ml-auto">
                        {navLinks.map((link, index) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-4 py-2 text-lg transition-all duration-300 group"
                                    style={{
                                        color: isActive ? '#ffffff' : (scrolled ? '#1A1A1A' : '#ffffff'),
                                        fontWeight: isActive ? 800 : 700,
                                        textShadow: isActive ? '0 1px 2px rgba(0, 0, 0, 0.2)' : (scrolled ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.5)'),
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                >
                                    {isActive && (
                                        <span
                                            className="absolute left-0 right-0 rounded-b-[40px] -z-10 animate-slideDownBox"
                                            style={{
                                                backgroundColor: orangeColor,
                                                transformOrigin: 'top',
                                                top: '-50px',
                                                bottom: '-28px',
                                            }}
                                        />
                                    )}
                                    {!isActive && (
                                        <span
                                            className="absolute bottom-3 left-1/2 w-0 h-0.5 bg-[#FF8C00] transition-all duration-300 ease-out group-hover:w-1/2 group-hover:-translate-x-1/2"
                                            style={{ backgroundColor: orangeColor }}
                                        />
                                    )}
                                    <span className="relative z-10">
                                        {link.label}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>

                    <button
                        onClick={() => {
                            if (mobileMenuOpen) {
                                handleMenuClose()
                            } else {
                                setMobileMenuOpen(true)
                            }
                        }}
                        className="md:hidden p-3 transition-all absolute right-0"
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
                        className={`md:hidden border-t-0 overflow-hidden rounded-b-3xl ${isClosing ? 'animate-slideUp' : 'animate-slideDown'}`}
                        style={{
                            borderColor: orangeColor,
                            backgroundColor: '#D35400'
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

// --- Footer Component ---

export function Footer() {
    return (
        <footer
            className="py-12 min-h-[30vh]"
            style={{
                backgroundColor: '#2A2A2A',
                boxShadow: 'none',
                borderTop: '2px solid #E57526'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <p
                        className="text-base font-bold"
                        style={{
                            color: '#ffffff',
                        }}
                    >
                        © {getCurrentYear()} SMB Suvanna Dipa. All rights reserved.
                    </p>
                </div>

                <div className="flex flex-row flex-wrap sm:flex-nowrap w-full sm:w-auto justify-between sm:justify-start gap-8 sm:gap-16 text-left">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-[#E57526]">Menu</h3>
                        <a href="/" className="text-gray-300 hover:text-white transition-colors">Beranda</a>
                        <a href="/about" className="text-gray-300 hover:text-white transition-colors">Tentang</a>
                        <a href="/activities" className="text-gray-300 hover:text-white transition-colors">Aktivitas</a>
                        <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Kontak</a>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-[#E57526]">Jelajahi</h3>
                        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-12 text-left">
                            <div className="flex flex-col gap-4">
                                <a href="/home" className="text-gray-300 hover:text-white transition-colors">Login</a>
                                <a href="/forgot-password" className="text-gray-300 hover:text-white transition-colors">Lupa Password</a>
                                <a href="/about#profile" className="text-gray-300 hover:text-white transition-colors">Profil</a>
                                <a href="/about#vision" className="text-gray-300 hover:text-white transition-colors">Visi & Misi</a>
                            </div>
                            <div className="flex flex-col gap-4">
                                <a href="/activities#agenda" className="text-gray-300 hover:text-white transition-colors">Agenda Tahunan</a>
                                <a href="/activities#gallery" className="text-gray-300 hover:text-white transition-colors">Galeri</a>
                                <a href="/activities#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimoni</a>
                                <a href="/contact#location" className="text-gray-300 hover:text-white transition-colors">Informasi Lengkap</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}


