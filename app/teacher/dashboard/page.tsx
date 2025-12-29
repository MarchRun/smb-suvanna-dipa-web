/**
 * Teacher Dashboard Page
 * Main dashboard for teachers (Pembina)
 */

'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StatCard from '@/components/dashboard/StatCard'

// Menu items for Pembina
const pembinaMenuItems = [
    { label: 'Dashboard', href: '/teacher/dashboard' },
    { label: 'Jadwal', href: '/teacher/jadwal' },
    { label: 'Kelas', href: '/teacher/kelas' },
    { label: 'Profil', href: '/teacher/profil' },
]

export default function TeacherDashboardPage() {
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
        <DashboardLayout role="Pembina" menuItems={pembinaMenuItems}>
            {/* Greeting */}
            <h1
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ color: textColor }}
            >
                Halo, <span className="text-gray-700 dark:text-gray-300">&lt;Nama Pembina&gt;</span>
            </h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                <StatCard title="Jumlah Presensi" value="85%" />
                <StatCard title="Kelas Sekolah Minggu" value="Kelas A" />
                <StatCard title="Jumlah Siswa" value="25" />
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
                    Area untuk menampilkan informasi penting, daftar siswa, atau konten lainnya.
                </p>
            </div>
        </DashboardLayout>
    )
}
