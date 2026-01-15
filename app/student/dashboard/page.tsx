/**
 * Student Dashboard Page
 * Main dashboard for students (Siswa)
 */

'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import { getStudentDashboardStats, type StudentDashboardStats } from '@/actions/student/stats'
import { getCurrentUserProfile } from '@/actions/auth/profile'
import { useDarkMode } from '@/hooks/useDarkMode'
import { getTextColor } from '@/lib/utils/colorHelpers'

// Menu items for Siswa
const siswaMenuItems = [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'Jadwal', href: '/student/jadwal' },
    { label: 'Poin', href: '/student/poin' },
    { label: 'Presensi', href: '/student/presensi' },
    { label: 'Profil', href: '/student/profil' },
]

export default function StudentDashboardPage() {
    const isDarkMode = useDarkMode()
    const [stats, setStats] = useState<StudentDashboardStats | null>(null)
    const [userName, setUserName] = useState<string>('')
    const [loading, setLoading] = useState(true)

    // Fetch stats and user profile from database
    useEffect(() => {
        async function fetchData() {
            setLoading(true)

            // Fetch stats
            const statsResult = await getStudentDashboardStats()
            if (statsResult.success && statsResult.data) {
                setStats(statsResult.data)
            }

            // Fetch user profile
            const profileResult = await getCurrentUserProfile()
            if (profileResult.success && profileResult.data) {
                setUserName(profileResult.data.full_name || 'Siswa')
            }

            setLoading(false)
        }
        fetchData()
    }, [])

    const textColor = getTextColor(isDarkMode)

    return (
        <DashboardLayout role="Siswa" menuItems={siswaMenuItems}>
            <div className="p-6 md:p-8">
                {/* Greeting with real user name */}
                <h1
                    className="text-2xl md:text-3xl font-bold mb-6"
                    style={{ color: textColor }}
                >
                    Halo, <span className="text-gray-700 dark:text-gray-300">
                        {loading ? '...' : userName}
                    </span>
                </h1>

                {/* Stat Cards - Real data from database */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                    <StatCard
                        title="Status Presensi"
                        value="-"
                        loading={loading}
                    />
                    <StatCard
                        title="Kelas Sekolah Minggu"
                        value={stats?.className || '-'}
                        loading={loading}
                    />
                    {/* Card 3: Full width on mobile, centered on tablet (2-col grid), normal on desktop */}
                    <div className="sm:col-span-2 sm:flex sm:justify-center lg:col-span-1 lg:block">
                        <div className="sm:w-1/2 lg:w-full">
                            <StatCard
                                title="Wali Kelas"
                                value={stats?.teacherName || '-'}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Widget Informasi - Matching chart widget styling */}
                <div
                    className="rounded-xl p-6 md:p-8"
                    style={{
                        backgroundColor: textColor,
                        boxShadow: isDarkMode
                            ? '0 4px 15px rgba(234, 88, 12, 0.3)'
                            : '0 4px 15px rgba(124, 45, 18, 0.3)'
                    }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
                        WIDGET INFORMASI
                    </h2>
                    <p className="text-white/70 text-center mb-6" style={{ fontSize: '1rem' }}>
                        Area untuk menampilkan informasi penting, pengumuman, atau konten lainnya.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    )
}
