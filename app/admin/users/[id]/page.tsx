'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/shared/layout/Dashboard'
import { getUserById, updateUser } from '@/actions/admin/users'
import type { Profile } from '@/types'
import { useToast } from '@/components/providers/ToastContext'

const adminMenuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pengguna', href: '/admin/users' },
    { label: 'Hadiah', href: '/admin/rewards' },
    { label: 'Konten Publik', href: '/admin/content' },
    { label: 'Profil', href: '/admin/profile' },
]

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { showToast } = useToast()
    const [user, setUser] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    // Fetch user
    useEffect(() => {
        loadUser()
    }, [id])

    const loadUser = async () => {
        setLoading(true)
        try {
            const result = await getUserById(id)
            if (result.success && result.data) {
                setUser(result.data)
            } else {
                showToast('Pengguna tidak ditemukan', 'error')
                router.push('/admin/users')
            }
        } catch (error) {
            console.error('Failed to load user:', error)
            router.push('/admin/users')
        }
        setLoading(false)
    }

    // Generate initials from full name (2 letters like sidebar)
    const getInitials = (fullName: string | null | undefined): string => {
        if (!fullName) return '?'
        const names = fullName.split(' ')
        if (names.length >= 2) {
            return names[0].charAt(0) + names[names.length - 1].charAt(0)
        }
        return fullName.substring(0, 2)
    }

    const textColor = '#E57526'
    const dataTextColor = '#000000' // Changed to black for read-only fields

    return (
        <DashboardLayout role="Admin" menuItems={adminMenuItems}>
            <div className="p-6 md:p-8">
                {/* Header with Title and Back Button */}
                <div className="flex justify-between items-center mb-8">
                    <h1
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: textColor }}
                    >
                        Detail Pengguna
                    </h1>

                    <button
                        onClick={() => router.push('/admin/users')}
                        className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90 flex items-center gap-2"
                        style={{ backgroundColor: textColor }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : user ? (
                    <div className="max-w-4xl mx-auto">
                        {/* Profile Picture */}
                        <div className="flex justify-center mb-8">
                            <div
                                className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold"
                                style={{
                                    backgroundColor: user.profile_picture ? 'transparent' : textColor,
                                    backgroundImage: user.profile_picture ? `url(${user.profile_picture})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {!user.profile_picture && getInitials(user.full_name).toUpperCase()}
                            </div>
                        </div>

                        {/* Profile Data Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Nama Lengkap */}
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                    Nama Lengkap
                                </label>
                                <div
                                    className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-[#D9D9D9] dark:bg-gray-700"
                                    style={{ borderColor: textColor, color: dataTextColor }}
                                >
                                    {user.full_name || '-'}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                    Email
                                </label>
                                <div
                                    className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-[#D9D9D9] dark:bg-gray-700"
                                    style={{ borderColor: textColor, color: dataTextColor }}
                                >
                                    {user.email || '-'}
                                </div>
                            </div>

                            {/* Nomor Telepon */}
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                    Nomor Telepon
                                </label>
                                <div
                                    className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-[#D9D9D9] dark:bg-gray-700"
                                    style={{ borderColor: textColor, color: dataTextColor }}
                                >
                                    {user.phone || '-'}
                                </div>
                            </div>

                            {/* Jenis Kelamin */}
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                    Jenis Kelamin
                                </label>
                                <div
                                    className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-[#D9D9D9] dark:bg-gray-700"
                                    style={{ borderColor: textColor, color: dataTextColor }}
                                >
                                    {user.gender || '-'}
                                </div>
                            </div>

                            {/* Tanggal Lahir */}
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                    Tanggal Lahir
                                </label>
                                <div
                                    className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-[#D9D9D9] dark:bg-gray-700"
                                    style={{ borderColor: textColor, color: dataTextColor }}
                                >
                                    {user.birth_date || '-'}
                                </div>
                            </div>

                            {/* Peran */}
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                    Peran
                                </label>
                                <div
                                    className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center capitalize bg-[#D9D9D9] dark:bg-gray-700"
                                    style={{ borderColor: textColor, color: dataTextColor }}
                                >
                                    {user.role || '-'}
                                </div>
                            </div>

                            {/* Kelas */}
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                    Kelas
                                </label>
                                <div
                                    className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-[#D9D9D9] dark:bg-gray-700"
                                    style={{ borderColor: textColor, color: dataTextColor }}
                                >
                                    {(user as any).classes?.name || '-'}
                                </div>
                            </div>

                            {/* Points */}
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                    Points
                                </label>
                                <div
                                    className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-[#D9D9D9] dark:bg-gray-700"
                                    style={{ borderColor: textColor, color: dataTextColor }}
                                >
                                    {user.points ?? 0}
                                </div>
                            </div>
                        </div>

                        {/* Alamat Rumah - Full Width */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                Alamat Rumah
                            </label>
                            <div
                                className="px-4 py-3 rounded-xl border-2 min-h-[100px] bg-[#D9D9D9] dark:bg-gray-700"
                                style={{ borderColor: textColor, color: dataTextColor }}
                            >
                                {user.address || '-'}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        Pengguna tidak ditemukan
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
