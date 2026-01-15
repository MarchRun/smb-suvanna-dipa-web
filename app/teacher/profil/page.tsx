/**
 * Teacher Profile Page
 * Displays teacher profile with read-only fields and edit modal
 */

'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/shared/DashboardLayout'
import ProfileEditModal from '@/components/profile/ProfileEditModal'
import { getCurrentUserProfile } from '@/actions/auth/profile'
import { useDarkMode } from '@/hooks/useDarkMode'
import type { UserProfile } from '@/types'

const teacherMenuItems = [
    { label: 'Dashboard', href: '/teacher/dashboard' },
    { label: 'Jadwal', href: '/teacher/jadwal' },
    { label: 'Kelas', href: '/teacher/kelas' },
    { label: 'Profil', href: '/teacher/profil' }
]

export default function TeacherProfilPage() {
    const isDarkMode = useDarkMode()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Fetch profile
    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        setLoading(true)
        try {
            const result = await getCurrentUserProfile()
            if (result.success && result.data) {
                setProfile(result.data)
            }
        } catch (error) {
            console.error('Failed to load profile:', error)
        }
        setLoading(false)
    }

    const handleUpdateSuccess = () => {
        loadProfile() // Reload profile after update
    }

    const textColor = isDarkMode ? '#ea580c' : '#7c2d12'
    const bgColor = isDarkMode ? '#0f172a' : 'var(--accent-200)'

    return (
        <DashboardLayout role="Pembina" menuItems={teacherMenuItems}>
            <div className="p-6 md:p-8">
                {/* Title */}
                <h1
                    className="text-2xl md:text-3xl font-bold mb-8"
                    style={{ color: textColor }}
                >
                    Profil Pembina
                </h1>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : (
                    <>
                        {/* Profile Picture */}
                        <div className="flex justify-center mb-8">
                            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                {profile?.profile_picture ? (
                                    <img
                                        src={profile.profile_picture}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-6xl">👤</span>
                                )}
                            </div>
                        </div>

                        {/* Profile Fields (Read-Only) */}
                        <div className="space-y-4 max-w-4xl mx-auto">
                            {/* Row 1: Nama & Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: textColor }}>
                                        Nama Lengkap :
                                    </label>
                                    <div
                                        className="w-full px-4 py-3 rounded-lg italic text-gray-600 min-h-[48px] flex items-center"
                                        style={{ backgroundColor: bgColor }}
                                    >
                                        {profile?.full_name || ''}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: textColor }}>
                                        Nomor Telepon :
                                    </label>
                                    <div
                                        className="w-full px-4 py-3 rounded-lg italic text-gray-600 min-h-[48px] flex items-center"
                                        style={{ backgroundColor: bgColor }}
                                    >
                                        {profile?.phone || ''}
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Gender & Birth Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: textColor }}>
                                        Jenis Kelamin :
                                    </label>
                                    <div
                                        className="w-full px-4 py-3 rounded-lg italic text-gray-600 min-h-[48px] flex items-center"
                                        style={{ backgroundColor: bgColor }}
                                    >
                                        {profile?.gender || ''}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: textColor }}>
                                        Tanggal Lahir :
                                    </label>
                                    <div
                                        className="w-full px-4 py-3 rounded-lg italic text-gray-600 min-h-[48px] flex items-center"
                                        style={{ backgroundColor: bgColor }}
                                    >
                                        {profile?.birth_date || ''}
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Address */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: textColor }}>
                                    Alamat Rumah :
                                </label>
                                <div
                                    className="w-full px-4 py-3 rounded-lg italic text-gray-600 min-h-[100px]"
                                    style={{ backgroundColor: bgColor }}
                                >
                                    {profile?.address || ''}
                                </div>
                            </div>

                            {/* Edit Button */}
                            <div className="pt-6">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-4 rounded-lg font-bold text-white text-lg transition-all duration-200 hover:opacity-90"
                                    style={{ backgroundColor: textColor }}
                                >
                                    Ubah Profil
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Edit Modal */}
            {profile && (
                <ProfileEditModal
                    key={profile.id}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    currentData={{
                        full_name: profile.full_name,
                        phone: profile.phone,
                        gender: profile.gender,
                        birth_date: profile.birth_date,
                        address: profile.address,
                        profile_picture: profile.profile_picture
                    }}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </DashboardLayout>
    )
}
