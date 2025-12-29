/**
 * Student Dashboard Page
 * Main dashboard for students (Siswa)
 */

'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StatCard from '@/components/dashboard/StatCard'

// Menu items for Siswa
const siswaMenuItems = [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'Jadwal', href: '/student/jadwal' },
    { label: 'Poin', href: '/student/poin' },
    { label: 'Presensi', href: '/student/presensi' },
    { label: 'Profil', href: '/student/profil' },
]

export default function StudentDashboardPage() {
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
        <DashboardLayout role="Siswa" menuItems={siswaMenuItems}>
            {/* Greeting */}
            <h1
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ color: textColor }}
            >
                Halo, <span className="text-gray-700 dark:text-gray-300">&lt;Nama Siswa&gt;</span>
            </h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                <StatCard title="Status Presensi" value="Hadir" />
                <StatCard title="Kelas Sekolah Minggu" value="Kelas A" />
                <StatCard title="Wali Kelas" value="Pembina X" />
            </div>

            {/* Widget Informasi */}
            <div
                className="rounded-xl p-6 md:p-8"
                style={{
                    backgroundColor: isDarkMode ? '#374151' : '#6b7280',
                    minHeight: '300px'
                }}
            >
                <h2 className="text-xl md:text-2xl font-bold text-white text-center italic">
                    WIDGET INFORMASI
                </h2>
                <p className="text-white/70 text-center mt-4">
                    Area untuk menampilkan informasi penting, pengumuman, atau konten lainnya.
                </p>
            </div>
        </DashboardLayout>
    )
}
