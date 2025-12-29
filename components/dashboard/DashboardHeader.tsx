/**
 * Dashboard Header Component
 * Top header bar with logo, dark mode toggle
 * Used across all dashboard types (Siswa, Pembina, Admin)
 */

'use client'

import { useState, useEffect } from 'react'

interface DashboardHeaderProps {
    onMenuToggle?: () => void
    showMenuButton?: boolean
}

export default function DashboardHeader({ onMenuToggle, showMenuButton = true }: DashboardHeaderProps) {
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Dark mode detection and toggle
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

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark')
        setIsDarkMode(!isDarkMode)
    }

    return (
        <header
            className="h-16 flex items-center justify-between px-4 md:px-6 shadow-md sticky top-0 z-40"
            style={{
                backgroundColor: isDarkMode ? '#1e293b' : '#FFEFD5'
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
                            stroke={isDarkMode ? '#ea580c' : '#7c2d12'}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}

                {/* Logo/Title */}
                <h1
                    className="text-lg md:text-xl font-bold"
                    style={{ color: isDarkMode ? '#ea580c' : '#7c2d12' }}
                >
                    SMB Suvanna Dipa
                </h1>
            </div>

            {/* Right: Dark Mode Toggle */}
            <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                style={{
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                    border: `2px solid ${isDarkMode ? '#ea580c' : '#7c2d12'}`
                }}
                aria-label="Toggle dark mode"
            >
                {isDarkMode ? (
                    // Sun icon
                    <svg className="w-5 h-5" fill="#fbbf24" viewBox="0 0 24 24">
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                    </svg>
                ) : (
                    // Moon icon
                    <svg className="w-5 h-5" fill="#7c2d12" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
        </header>
    )
}
