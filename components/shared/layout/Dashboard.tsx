'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { getCurrentUserProfile } from '@/actions/auth/profile'
import { createClient } from '@/lib/supabase/client'
import SessionTimeoutProvider from '@/components/providers/SessionTimeoutProvider'

// --- DashboardSidebar Component ---

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

// Default icons for common menu items
const getDefaultIcon = (label: string, color: string, isActive: boolean) => {
    // Inactive icons are white, Active are White (matching text)
    const iconColor = isActive ? '#FFFFFF' : '#FFFFFF'
    const strokeWidth = 2

    const icons: Record<string, React.ReactNode> = {
        'Dashboard': (
            <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
        'Pengguna': (
            <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        'Hadiah': (
            <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
        ),
        'Konten Publik': (
            <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
        ),
        'Profil': (
            <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        'Kelas': (
            <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        'Jadwal': (
            <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        'Poin': (
            <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        ),
        'Siswa': (
            <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
        ),
        'Tugas': (
            <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
        'Nilai': (
            <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        'Aktivitas': (
            <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        'Laporan': (
            <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    }

    // Return matching icon or a default one
    return icons[label] || (
        <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24" strokeWidth={strokeWidth}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    )
}

export function DashboardSidebar({ role, menuItems, isOpen, onClose }: DashboardSidebarProps) {
    const pathname = usePathname()
    const [userName, setUserName] = useState<string>('User')
    const [userInitials, setUserInitials] = useState<string>(role.charAt(0))
    const [profilePicture, setProfilePicture] = useState<string | null>(null)

    // Fetch user profile data
    useEffect(() => {
        async function fetchUserProfile() {
            const result = await getCurrentUserProfile()
            if (result.success && result.data) {
                const fullName = result.data.full_name || 'User'
                setUserName(fullName)
                setProfilePicture(result.data.profile_picture || null)

                // Generate initials from full name
                const names = fullName.split(' ')
                if (names.length >= 2) {
                    setUserInitials(names[0].charAt(0) + names[names.length - 1].charAt(0))
                } else {
                    setUserInitials(fullName.substring(0, 2))
                }
            }
        }
        fetchUserProfile()
    }, [])

    // Colors
    const sidebarBg = '#2A2A2A' // Matches Footer Dark Gray
    const activeColor = '#E57526' // Orange
    const inactiveColor = '#FFFFFF' // White
    const hoverItemBg = 'rgba(255, 255, 255, 0.05)'

    const handleLogout = async () => {
        try {
            const supabase = createClient()
            await supabase.auth.signOut()
            // Hard reload to clear all state
            window.location.href = '/'
        } catch (error) {
            console.error('Logout error:', error)
            // Force redirect anyway
            window.location.href = '/'
        }
    }

    // Determine dashboard root link based on role
    const getDashboardRoot = () => {
        switch (role) {
            case 'Admin': return '/admin/dashboard'
            case 'Pembina': return '/teacher/dashboard'
            case 'Siswa': return '/student/dashboard'
            default: return '/'
        }
    }

    return (
        <>
            {/* Overlay for mobile - with backdrop blur */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar - Sticky on desktop, fixed on mobile */}
            <aside
                className={`fixed lg:sticky top-0 left-0 w-64 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                style={{
                    backgroundColor: sidebarBg,
                    height: '100vh',
                    minHeight: '100vh',
                    borderRight: '1px solid rgba(255,255,255,0.05)'
                }}
            >
                {/* Logo Section - Top */}
                <div className="flex justify-center items-center py-6 relative overflow-hidden shrink-0">
                    <Link href={getDashboardRoot()} onClick={onClose} className="relative z-10 hover:scale-105 transition-transform duration-200">
                        {/* Blob Background - Similar to Navbar but simpler/smaller */}
                        <svg
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute w-[200%] h-[200%] -z-10"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                opacity: 0.8
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
                            width={120}
                            height={120}
                            className="h-16 w-auto object-contain"
                            style={{ mixBlendMode: 'multiply' }}
                            priority
                        />
                    </Link>
                </div>

                {/* Navigation Menu - flex-1 to take remaining space */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden group font-bold"
                                        style={{
                                            backgroundColor: isActive ? activeColor : 'transparent',
                                            color: isActive ? '#FFFFFF' : inactiveColor,
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
                                        <span className="w-5 h-5 flex-shrink-0 relative z-10 transition-transform duration-200 group-hover:scale-110">
                                            {item.icon || getDefaultIcon(item.label, activeColor, isActive)}
                                        </span>
                                        <span className="relative z-10">{item.label}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Bottom Section: Profile & Logout */}
                <div className="shrink-0 p-4 space-y-2 border-t border-gray-800 bg-black/20">
                    {/* Profile Summary */}
                    <div className="flex items-center gap-3 px-2 mb-2">
                        {/* Avatar */}
                        <div
                            className="flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden ring-2 ring-orange-500/50"
                            style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: profilePicture ? 'transparent' : activeColor,
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '1rem',
                                fontFamily: 'var(--font-brand)'
                            }}
                        >
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt={userName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                userInitials.toUpperCase()
                            )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h2 className="text-white text-sm font-bold truncate">
                                {userName}
                            </h2>
                            <p className="text-gray-400 text-xs truncate font-bold">
                                {role}
                            </p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-white/10 text-red-400 hover:text-red-300 text-sm font-bold"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    )
}

// --- DashboardLayout Component ---

interface DashboardLayoutProps {
    role: 'Siswa' | 'Pembina' | 'Admin'
    menuItems: MenuItem[]
    children: React.ReactNode
}

export default function DashboardLayout({ role, menuItems, children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <SessionTimeoutProvider>
            <div className="min-h-screen flex bg-[var(--background)]">
                {/* Sidebar */}
                <DashboardSidebar
                    role={role}
                    menuItems={menuItems}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <div
                    className={`flex-1 flex flex-col min-h-screen lg:ml-0 transition-all duration-300 ${sidebarOpen ? 'lg:blur-none blur-sm pointer-events-none lg:pointer-events-auto' : ''
                        }`}
                >
                    {/* Mobile Header: Hamburger + Logo in Center */}
                    <div className="lg:hidden p-4 sticky top-0 z-30 bg-[var(--background)] flex items-center justify-between shadow-sm">
                        {/* Hamburger */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 text-gray-600 hover:text-gray-900"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Center Logo for Mobile */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                            {/* Blob Background - Small */}
                            <svg
                                viewBox="0 0 200 200"
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute w-[200%] h-[200%] -z-10"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    opacity: 0.8
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
                                alt="SMB Logo"
                                width={60}
                                height={60}
                                className="h-14 w-auto object-contain relative z-10"
                                style={{ mixBlendMode: 'multiply' }}
                            />
                        </div>

                        {/* Placeholder for right side balance (optional) */}
                        <div className="w-10"></div>
                    </div>

                    {/* Content - Scrollable */}
                    <main className="flex-1 overflow-auto bg-transparent">
                        {children}
                    </main>
                </div>
            </div>
        </SessionTimeoutProvider>
    )
}
