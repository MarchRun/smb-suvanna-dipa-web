/**
 * Admin - Detail Pengguna Page
 * Read-only view of user profile
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { getUserById } from '@/actions/admin/users'
import type { Profile, Class } from '@/types'

// Menu items for Admin
const adminMenuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pengguna', href: '/admin/pengguna' },
    { label: 'Hadiah', href: '/admin/hadiah' },
    { label: 'Konten Publik', href: '/admin/konten' },
    { label: 'Profil', href: '/admin/profil' },
]

export default function DetailPenggunaPage() {
    const router = useRouter()
    const params = useParams()
    const userId = params.id as string

    const [user, setUser] = useState<Profile | null>(null)
    const [className, setClassName] = useState<string>('')
    const [pageLoading, setPageLoading] = useState(true)
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

    // Fetch user
    useEffect(() => {
        async function fetchData() {
            setPageLoading(true)

            const userResult = await getUserById(userId)
            if (userResult.success && userResult.data) {
                setUser(userResult.data)

                // Fetch class name if user has class_id
                if (userResult.data.class_id) {
                    try {
                        const response = await fetch('/api/classes')
                        if (response.ok) {
                            const classes = await response.json()
                            const userClass = classes.find((c: Class) => c.id === userResult.data!.class_id)
                            if (userClass) {
                                setClassName(userClass.name)
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching class:', error)
                    }
                }
            } else {
                alert('Pengguna tidak ditemukan')
                router.push('/admin/pengguna')
                return
            }

            setPageLoading(false)
        }
        fetchData()
    }, [userId, router])

    const textColor = isDarkMode ? '#ea580c' : 'var(--primary-900)'
    const fieldBgColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-100'

    const DetailField = ({ label, value }: { label: string; value: string }) => (
        <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <div className={`px-4 py-3 rounded-lg ${fieldBgColor} text-gray-600 dark:text-gray-300`}>
                {value || '-'}
            </div>
        </div>
    )

    if (pageLoading) {
        return (
            <DashboardLayout role="Admin" menuItems={adminMenuItems}>
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout role="Admin" menuItems={adminMenuItems}>
            {/* Header with back button */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1
                    className="text-2xl md:text-3xl font-bold"
                    style={{ color: textColor }}
                >
                    Detail Pengguna
                </h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                {/* Profile Picture */}
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        {user?.profile_picture ? (
                            <img
                                src={user.profile_picture}
                                alt={user.full_name || 'User'}
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <svg className="w-12 h-12 text-orange-600 dark:text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Profile Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailField label="Nama Lengkap" value={user?.full_name || ''} />
                    <DetailField label="Nomor Telepon" value={user?.phone || ''} />
                    <DetailField label="Jenis Kelamin" value={user?.gender || ''} />
                    <DetailField
                        label="Tanggal Lahir"
                        value={user?.birth_date ? new Date(user.birth_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }) : ''}
                    />
                    <DetailField label="Kelas" value={className} />
                    <DetailField label="Peran" value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''} />
                </div>

                {/* Address - Full width */}
                <div className="mt-6">
                    <DetailField label="Alamat Rumah" value={user?.address || ''} />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                    <Link
                        href={`/admin/pengguna/edit/${userId}`}
                        className="flex-1 px-6 py-3 rounded-lg text-center font-medium text-white transition-all duration-200 hover:opacity-90"
                        style={{ backgroundColor: textColor }}
                    >
                        Edit Pengguna
                    </Link>
                    <button
                        onClick={() => router.push('/admin/pengguna')}
                        className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600
                                 text-gray-700 dark:text-gray-300 font-medium
                                 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </DashboardLayout>
    )
}
