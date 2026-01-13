/**
 * Dashboard Layout Component
 * Combines Header + Sidebar + Content area
 * Provides consistent layout for all dashboard pages
 */

'use client'

import { useState, useEffect } from 'react'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar, { MenuItem } from './DashboardSidebar'

interface DashboardLayoutProps {
    role: 'Siswa' | 'Pembina' | 'Admin'
    menuItems: MenuItem[]
    children: React.ReactNode
}

export default function DashboardLayout({ role, menuItems, children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
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

    const contentBg = isDarkMode ? '#0f172a' : '#f5f5f5'

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <DashboardSidebar
                role={role}
                menuItems={menuItems}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area - with blur effect when mobile sidebar is open */}
            <div
                className={`flex-1 flex flex-col min-h-screen lg:ml-0 transition-all duration-300 ${sidebarOpen ? 'lg:blur-none blur-sm pointer-events-none lg:pointer-events-auto' : ''
                    }`}
            >
                {/* Header - Sticky */}
                <div className="sticky top-0 z-40">
                    <DashboardHeader
                        role={role}
                        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
                        showMenuButton={true}
                        blurred={sidebarOpen}
                    />
                </div>

                {/* Content - Scrollable */}
                <main
                    className="flex-1 overflow-auto"
                    style={{ backgroundColor: contentBg }}
                >
                    {children}
                </main>
            </div>
        </div>
    )
}
