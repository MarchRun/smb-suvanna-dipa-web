/**
 * Dashboard Sidebar Component
 * Navigation sidebar with role title, menu items, and logout
 * Used across all dashboard types (Siswa, Pembina, Admin)
 * Light mode matches public page navbar
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface MenuItem {
    label: string
    href: string
    icon?: React.ReactNode
}

interface DashboardSidebarProps {
    role: 'Siswa' | 'Pembina' | 'Admin'
    menuItems: MenuItem[]
    isOpen: boolean
    onClose: () => void
}

export default function DashboardSidebar({ role, menuItems, isOpen, onClose }: DashboardSidebarProps) {
    const pathname = usePathname()
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

    // Colors based on dark mode - light mode uses CSS variables
    const sidebarBg = isDarkMode ? '#1e293b' : 'var(--accent-100)'
    const roleHeaderBg = isDarkMode ? '#0f172a' : 'var(--accent-200)'
    const textColor = isDarkMode ? '#ea580c' : 'var(--primary-900)'
    const borderColor = isDarkMode ? '#374151' : '#9ca3af'
    const hoverItemBg = isDarkMode ? 'rgba(234, 88, 12, 0.1)' : 'rgba(124, 45, 18, 0.08)'

    const handleLogout = async () => {
        // TODO: Implement logout logic
        console.log('Logout clicked')
        window.location.href = '/'
    }

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar - Full height of viewport */}
            <aside
                className={`fixed lg:static top-0 left-0 w-64 z-50 transform transition-transform duration-300 ease-in-out flex flex-col
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                style={{
                    backgroundColor: sidebarBg,
                    height: '100vh',
                    minHeight: '100vh'
                }}
            >
                {/* Role Header - with FULL border box (all 4 sides) */}
                <div
                    className="h-16 flex items-center justify-center shrink-0"
                    style={{
                        backgroundColor: roleHeaderBg,
                        border: `3px solid ${textColor}`
                    }}
                >
                    <h2
                        className="text-xl tracking-wide uppercase"
                        style={{
                            color: isDarkMode ? '#ffffff' : 'var(--primary-900)',
                            fontFamily: 'var(--font-brand)',
                            fontWeight: 900
                        }}
                    >
                        {role}
                    </h2>
                </div>

                {/* Navigation Menu - flex-1 to take remaining space */}
                <nav className="flex-1 py-6 overflow-y-auto">
                    <ul className="space-y-2 px-4">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                                        style={{
                                            // Active: SMB color background, white text
                                            backgroundColor: isActive ? textColor : 'transparent',
                                            color: isActive ? '#ffffff' : textColor,
                                            fontWeight: 700,
                                            fontSize: '1rem'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.backgroundColor = hoverItemBg
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.backgroundColor = 'transparent'
                                            }
                                        }}
                                    >
                                        {item.icon && (
                                            <span className="w-5 h-5">{item.icon}</span>
                                        )}
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Logout Button - At absolute bottom with FULL border box */}
                <div
                    className="shrink-0 p-4"
                    style={{
                        border: `3px solid ${textColor}`,
                        backgroundColor: isDarkMode ? '#0f172a' : 'var(--accent-200)'
                    }}
                >
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                        style={{
                            color: textColor,
                            fontWeight: 700
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = hoverItemBg
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                    >
                        {/* Logout Icon */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
