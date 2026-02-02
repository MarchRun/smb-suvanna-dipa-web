/**
 * Student Profile Page
 * Displays student profile with read-only fields and edit modal
 */

'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/shared/layout/Dashboard'
import ProfileEditModal from '@/components/shared/forms/ProfileEditModal'
import { getCurrentUserProfile } from '@/actions/auth/profile'
import type { UserProfile } from '@/types'

const studentMenuItems = [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'Jadwal', href: '/student/schedule' },
    { label: 'Poin', href: '/student/points' },
    { label: 'Profil', href: '/student/profile' }
]

export default function StudentProfilPage() {
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

    // Generate initials from full name
    const getInitials = (fullName: string | null | undefined): string => {
        if (!fullName) return '?'
        const names = fullName.split(' ')
        if (names.length >= 2) {
            return names[0].charAt(0) + names[names.length - 1].charAt(0)
        }
        return fullName.substring(0, 2)
    }

    const textColor = '#E57526'
    const dataTextColor = '#000000'

    return (
        <DashboardLayout role="Siswa" menuItems={studentMenuItems}>
            <div className="p-6 md:p-8">
                {/* Title */}
                <h1
                    className="text-2xl md:text-3xl font-bold mb-8"
                    style={{ color: textColor }}
                >
                    Profil Siswa
                </h1>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : (
                    <>
                        {/* Profile Picture */}
                        <div className="flex justify-center mb-8">
                            <div
                                className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold border-2"
                                style={{
                                    borderColor: textColor,
                                    backgroundColor: profile?.profile_picture ? 'transparent' : textColor,
                                    backgroundImage: profile?.profile_picture ? `url(${profile.profile_picture})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {!profile?.profile_picture && getInitials(profile?.full_name).toUpperCase()}
                            </div>
                        </div>

                        {/* Profile Fields (Read-Only) */}
                        <div className="space-y-4 max-w-4xl mx-auto">
                            {/* Row 1: Nama & Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                        Nama Lengkap
                                    </label>
                                    <div
                                        className="w-full px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-[#D9D9D9] dark:bg-gray-700"
                                        style={{ borderColor: textColor, color: dataTextColor }}
                                    >
                                        {profile?.full_name || '-'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                        Nomor Telepon
                                    </label>
                                    <div
                                        className="w-full px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-[#D9D9D9] dark:bg-gray-700"
                                        style={{ borderColor: textColor, color: dataTextColor }}
                                    >
                                        {profile?.phone || '-'}
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Gender & Birth Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                        Jenis Kelamin
                                    </label>
                                    <div
                                        className="w-full px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-[#D9D9D9] dark:bg-gray-700"
                                        style={{ borderColor: textColor, color: dataTextColor }}
                                    >
                                        {profile?.gender || '-'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                        Tanggal Lahir
                                    </label>
                                    <div
                                        className="w-full px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-[#D9D9D9] dark:bg-gray-700"
                                        style={{ borderColor: textColor, color: dataTextColor }}
                                    >
                                        {profile?.birth_date || '-'}
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Address */}
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                    Alamat Rumah
                                </label>
                                <div
                                    className="w-full px-4 py-3 rounded-xl border-2 min-h-[100px] bg-[#D9D9D9] dark:bg-gray-700"
                                    style={{ borderColor: textColor, color: dataTextColor }}
                                >
                                    {profile?.address || '-'}
                                </div>
                            </div>

                            {/* Edit Button */}
                            <div className="pt-6">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:opacity-90"
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
