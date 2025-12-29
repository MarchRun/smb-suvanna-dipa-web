/**
 * Admin Dashboard Page
 * Main dashboard for administrators
 */

'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StatCard from '@/components/dashboard/StatCard'

// Menu items for Admin
const adminMenuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pengguna', href: '/admin/pengguna' },
    { label: 'Hadiah', href: '/admin/hadiah' },
    { label: 'Konten Publik', href: '/admin/konten' },
    { label: 'Profil', href: '/admin/profil' },
]

export default function AdminDashboardPage() {
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

    const textColor = isDarkMode ? '#ea580c' : '#7c2d12'

    return (
        <DashboardLayout role="Admin" menuItems={adminMenuItems}>
            {/* Greeting */}
            <h1
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ color: textColor }}
            >
                Halo, <span className="text-gray-700 dark:text-gray-300">&lt;Nama Admin&gt;</span>
            </h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                <StatCard title="Jumlah Siswa" value="150" />
                <StatCard title="Jumlah Kelas" value="6" />
                <StatCard title="Jumlah Pembina" value="12" />
            </div>

            {/* Grafik Widget */}
            <div
                className="rounded-xl p-6 md:p-8"
                style={{
                    backgroundColor: isDarkMode ? '#374151' : '#6b7280',
                    minHeight: '300px'
                }}
            >
                <h2 className="text-xl md:text-2xl font-bold text-white text-center italic">
                    GRAFIK JUMLAH PENGUNJUNG
                </h2>
                <p className="text-white/70 text-center mt-4">
                    Area untuk menampilkan grafik statistik pengunjung website.
                </p>
            </div>
        </DashboardLayout>
    )
}
