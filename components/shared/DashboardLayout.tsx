/**
 * Dashboard Layout Component
 * Combines Header + Sidebar + Content area
 * Provides consistent layout for all dashboard pages
 */

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import DashboardSidebar, { MenuItem } from './DashboardSidebar'
import SessionTimeoutProvider from '@/components/providers/SessionTimeoutProvider'

interface DashboardLayoutProps {
    role: 'Siswa' | 'Pembina' | 'Admin'
    menuItems: MenuItem[]
    children: React.ReactNode
}

export default function DashboardLayout({ role, menuItems, children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Close sidebar on window resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])



    // ... existing imports

    // ... existing code

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
                                    transform="translate(100 100) scale(1.1)"
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
