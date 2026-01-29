'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/shared/layout/Dashboard'
import { getStudentById } from '@/actions/teacher/students'
import type { Profile } from '@/types'

const pembinaMenuItems = [
    { label: 'Dashboard', href: '/teacher/dashboard' },
    { label: 'Jadwal', href: '/teacher/jadwal' },
    { label: 'Kelas', href: '/teacher/kelas' },
    { label: 'Profil', href: '/teacher/profil' },
]

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [student, setStudent] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    // Fetch student
    useEffect(() => {
        loadStudent()
    }, [id])

    const loadStudent = async () => {
        setLoading(true)
        try {
            const result = await getStudentById(id)
            if (result.success && result.data) {
                setStudent(result.data)
            } else {
                alert('Siswa tidak ditemukan')
                router.push('/teacher/kelas')
            }
        } catch (error) {
            console.error('Failed to load student:', error)
            router.push('/teacher/kelas')
        }
        setLoading(false)
    }

    const textColor = '#E57526'
    const dataTextColor = '#9a3412'

    return (
        <DashboardLayout role="Pembina" menuItems={pembinaMenuItems}>
            <div className="p-6 md:p-8">
                {/* Header with Title and Back Button */}
                <div className="flex justify-between items-center mb-8">
                    <h1
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: textColor }}
                    >
                        Detail Siswa
                    </h1>

                    <button
                        onClick={() => router.push('/teacher/kelas')}
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
                ) : student ? (
                    <div className="max-w-4xl mx-auto">
                        {/* Profile Picture */}
                        <div className="flex justify-center mb-8">
                            <div
                                className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold"
                                style={{
                                    backgroundColor: student.profile_picture ? 'transparent' : textColor,
                                    backgroundImage: student.profile_picture ? `url(${student.profile_picture})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {!student.profile_picture && (student.full_name?.charAt(0)?.toUpperCase() || '?')}
                            </div>
                        </div>

                        {/* Profile Data Grid - Based on Wireframe */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Nama Lengkap */}
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                    Nama Lengkap :
                                </label>
                                <div
                                    className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-gray-200 dark:bg-gray-600"
                                    style={{ borderColor: textColor, color: dataTextColor }}
                                >
                                    {student.full_name || '-'}
                                </div>
                            </div>

                            {/* Nomor Telepon */}
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                    Nomor Telepon :
                                </label>
                                <div
                                    className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-gray-200 dark:bg-gray-600"
                                    style={{ borderColor: textColor, color: dataTextColor }}
                                >
                                    {student.phone || '-'}
                                </div>
                            </div>

                            {/* Jenis Kelamin */}
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                    Jenis Kelamin :
                                </label>
                                <div
                                    className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-gray-200 dark:bg-gray-600"
                                    style={{ borderColor: textColor, color: dataTextColor }}
                                >
                                    {student.gender || '-'}
                                </div>
                            </div>

                            {/* Tanggal Lahir */}
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                    Tanggal Lahir :
                                </label>
                                <div
                                    className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-gray-200 dark:bg-gray-600"
                                    style={{ borderColor: textColor, color: dataTextColor }}
                                >
                                    {student.birth_date || '-'}
                                </div>
                            </div>
                        </div>

                        {/* Jumlah Poin - Full Width */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                Jumlah Poin :
                            </label>
                            <div
                                className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-gray-200 dark:bg-gray-600"
                                style={{ borderColor: textColor, color: dataTextColor }}
                            >
                                <span className="font-bold">{student.points ?? 0}</span>
                            </div>
                        </div>

                        {/* Alamat Rumah - Full Width */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                Alamat Rumah :
                            </label>
                            <div
                                className="px-4 py-3 rounded-xl border-2 min-h-[100px] bg-gray-200 dark:bg-gray-600"
                                style={{ borderColor: textColor, color: dataTextColor }}
                            >
                                {student.address || '-'}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        Siswa tidak ditemukan
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
