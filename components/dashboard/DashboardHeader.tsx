/**
 * Dashboard Header Component
 * Top header bar with logo, dark mode toggle
 * Used across all dashboard types (Siswa, Pembina, Admin)
 * Light mode matches public page navbar
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DashboardHeaderProps {
    role: 'Siswa' | 'Pembina' | 'Admin'
    onMenuToggle?: () => void
    showMenuButton?: boolean
}

export default function DashboardHeader({ role, onMenuToggle, showMenuButton = true }: DashboardHeaderProps) {
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Get dashboard path based on role
    const getDashboardPath = () => {
        switch (role) {
            case 'Admin': return '/admin/dashboard'
            case 'Pembina': return '/teacher/dashboard'
            case 'Siswa': return '/student/dashboard'
            default: return '/'
        }
    }

    // Load and sync dark mode
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode')
        if (savedMode) {
            setIsDarkMode(savedMode === 'true')
            if (savedMode === 'true') {
                document.documentElement.classList.add('dark')
            }
        }
    }, [])

    // Toggle dark mode (matching Navbar behavior)
    const toggleDarkMode = () => {
        const newMode = !isDarkMode
        setIsDarkMode(newMode)
        if (newMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('darkMode', newMode.toString())
    }

    const textColor = isDarkMode ? '#ea580c' : 'var(--primary-900)'

    return (
        <header
            className="h-20 flex items-center justify-between px-4 md:px-6 shadow-md sticky top-0 z-40"
            style={{
                backgroundColor: isDarkMode ? '#1e293b' : 'var(--accent-200)',
                boxShadow: isDarkMode
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                    : '0 4px 12px rgba(217, 87, 20, 0.20), 0 2px 4px rgba(217, 87, 20, 0.12)'
            }}
        >
            {/* Left: Menu button (mobile) + Logo */}
            <div className="flex items-center gap-3">
                {/* Hamburger Menu Button (mobile only) */}
                {showMenuButton && (
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 rounded-lg transition-colors hover:bg-black/10"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke={textColor}
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}

                {/* Logo/Title - Navigates to role's dashboard */}
                <Link
                    href={getDashboardPath()}
                    className="text-xl md:text-2xl tracking-wide transition-all duration-200 hover:scale-110 uppercase"
                    style={{
                        color: textColor,
                        fontFamily: 'var(--font-brand)',
                        fontWeight: 900
                    }}
                >
                    SMB SUVANNA DIPA
                </Link>
            </div>

            {/* Right: Dark Mode Toggle - Matching Navbar style */}
            <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                style={{
                    color: textColor,
                    backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                    border: `3px solid ${textColor}`
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
        </header>
    )
}
