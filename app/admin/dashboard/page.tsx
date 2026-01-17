/**
 * Admin Dashboard Page
 * Main dashboard for administrators
 * Shows real-time statistics and visitor chart
 */

'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/shared/DashboardLayout'
import StatCard from '@/components/shared/StatCard'
import StatsGrid from '@/components/shared/StatsGrid'
import VisitorChart from '@/components/shared/VisitorChart'
import { getDashboardStats, type DashboardStats } from '@/actions/admin/stats'
import { getCurrentUserProfile } from '@/actions/auth/profile'
import { useDarkMode } from '@/hooks/useDarkMode'
import { getTextColor } from '@/lib/utils/colorHelpers'

// Menu items for Admin
const adminMenuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pengguna', href: '/admin/pengguna' },
    { label: 'Hadiah', href: '/admin/hadiah' },
    { label: 'Konten Publik', href: '/admin/konten' },
    { label: 'Profil', href: '/admin/profil' },
]

export default function AdminDashboardPage() {
    const isDarkMode = useDarkMode()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [userName, setUserName] = useState<string>('')
    const [loading, setLoading] = useState(true)

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

    const textColor = getTextColor(isDarkMode)

    return (
        <DashboardLayout role="Admin" menuItems={adminMenuItems}>
            <div className="p-6 md:p-8">
                {/* Greeting with real user name */}
                <h1
                    className="text-2xl md:text-3xl font-bold mb-6"
                    style={{ color: textColor }}
                >
                    Dashboard
                </h1>

                {/* Stat Cards - Real-time data from Supabase */}
                <StatsGrid>
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
                </StatsGrid>

                {/* Grafik Widget - Matching StatCard styling */}
                <div
                    className="rounded-xl p-6 md:p-8 mt-8"
                    style={{
                        backgroundColor: textColor,
                        boxShadow: isDarkMode
                            ? '0 4px 15px rgba(234, 88, 12, 0.3)'
                            : '0 4px 15px rgba(124, 45, 18, 0.3)'
                    }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
                        GRAFIK JUMLAH PENGUNJUNG
                    </h2>
                    <p className="text-white/70 text-center mb-6" style={{ fontSize: '1rem' }}>
                        Statistik pengunjung halaman publik (Beranda, Tentang, Aktivitas, Kontak)
                    </p>

                    {/* Visitor Chart */}
                    <VisitorChart days={7} />
                </div>
            </div>
        </DashboardLayout>
    )
}
