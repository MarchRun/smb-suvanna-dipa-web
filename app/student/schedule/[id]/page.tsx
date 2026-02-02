'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/shared/layout/Dashboard'
import { getStudentScheduleById } from '@/actions/student/schedule'
import type { Schedule } from '@/types'

const studentMenuItems = [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'Jadwal', href: '/student/schedule' },
    { label: 'Poin', href: '/student/points' },
    { label: 'Profil', href: '/student/profile' }
]

export default function StudentScheduleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [schedule, setSchedule] = useState<Schedule | null>(null)
    const [loading, setLoading] = useState(true)

    // Fetch schedule
    useEffect(() => {
        loadSchedule()
    }, [id])

    const loadSchedule = async () => {
        setLoading(true)
        try {
            const result = await getStudentScheduleById(Number(id))
            if (result.success && result.data) {
                setSchedule(result.data)
            } else {
                alert('Jadwal tidak ditemukan')
                router.push('/student/schedule')
            }
        } catch (error) {
            console.error('Failed to load schedule:', error)
            router.push('/student/schedule')
        }
        setLoading(false)
    }

    // Format date to readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const textColor = '#E57526'
    const dataTextColor = '#E57526'

    return (
        <DashboardLayout role="Siswa" menuItems={studentMenuItems}>
            <div className="p-6 md:p-8">
                {/* Header with Title and Back Button */}
                <div className="flex justify-between items-center mb-8">
                    <h1
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: textColor }}
                    >
                        Detail Kegiatan Bulanan
                    </h1>

                    <button
                        onClick={() => router.push('/student/schedule')}
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
                ) : schedule ? (
                    <div className="max-w-4xl mx-auto">
                        {/* Nama Kegiatan */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                Nama Kegiatan :
                            </label>
                            <div
                                className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-gray-200 dark:bg-gray-600"
                                style={{ borderColor: textColor, color: dataTextColor }}
                            >
                                {schedule.name || '-'}
                            </div>
                        </div>

                        {/* Waktu */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                Waktu :
                            </label>
                            <div
                                className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center bg-gray-200 dark:bg-gray-600"
                                style={{ borderColor: textColor, color: dataTextColor }}
                            >
                                {formatDate(schedule.event_date)}
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                                Deskripsi :
                            </label>
                            <div
                                className="px-4 py-3 rounded-xl border-2 min-h-[150px] bg-gray-200 dark:bg-gray-600 whitespace-pre-wrap"
                                style={{ borderColor: textColor, color: dataTextColor }}
                            >
                                {schedule.description || 'Tidak ada deskripsi'}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        Jadwal tidak ditemukan
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
