/**
 * Admin Dashboard Page
 * Main dashboard for administrators
 * Shows real-time statistics and visitor chart
 */

'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import VisitorChart from '@/components/dashboard/VisitorChart'
import { getDashboardStats, type DashboardStats } from '@/actions/admin/stats'
import { getCurrentUserProfile } from '@/actions/auth/profile'

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
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [userName, setUserName] = useState<string>('')
    const [loading, setLoading] = useState(true)

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

    // Fetch stats and user profile from Supabase
    useEffect(() => {
        async function fetchData() {
            setLoading(true)

            // Fetch stats
            const statsResult = await getDashboardStats()
            if (statsResult.success && statsResult.data) {
                setStats(statsResult.data)
            }

            // Fetch user profile
            const profileResult = await getCurrentUserProfile()
            if (profileResult.success && profileResult.data) {
                setUserName(profileResult.data.full_name || 'Admin')
            }

            setLoading(false)
        }
        fetchData()
    }, [])

    const textColor = isDarkMode ? '#ea580c' : 'var(--primary-900)'

    return (
        <DashboardLayout role="Admin" menuItems={adminMenuItems}>
            {/* Greeting with real user name */}
            <h1
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ color: textColor }}
            >
                Halo, <span className="text-gray-700 dark:text-gray-300">
                    {loading ? '...' : userName}
                </span>
            </h1>

            {/* Stat Cards - Real-time data from Supabase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                <StatCard
                    title="Jumlah Siswa"
                    value={stats?.totalSiswa ?? 0}
                    loading={loading}
                />
                <StatCard
                    title="Jumlah Kelas"
                    value={stats?.totalKelas ?? 0}
                    loading={loading}
                />
                <StatCard
                    title="Jumlah Pembina"
                    value={stats?.totalPembina ?? 0}
                    loading={loading}
                />
            </div>

            {/* Grafik Widget - Color matches textColor */}
            <div
                className="rounded-xl p-6 md:p-8"
                style={{
                    backgroundColor: textColor,
                    minHeight: '300px'
                }}
            >
                <h2 className="text-xl md:text-2xl font-bold text-white text-center">
                    GRAFIK JUMLAH PENGUNJUNG
                </h2>
                <p className="text-white/70 text-center mt-2 text-sm">
                    Statistik pengunjung halaman publik (Beranda, Tentang, Aktivitas, Kontak)
                </p>

                {/* Visitor Chart */}
                <VisitorChart days={7} />
            </div>
        </DashboardLayout>
    )
}
