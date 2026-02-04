/**
 * Student - Jadwal Page
 * Read-only schedule viewing for students with list card layout
 * Simplified design matching wireframe
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/shared/layout/Dashboard'
import { getStudentSchedules } from '@/actions/student/schedule'
import type { Schedule } from '@/types'

// Menu items for Student
const studentMenuItems = [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'Jadwal', href: '/student/schedule' },
    { label: 'Poin', href: '/student/points' },
    { label: 'Profil', href: '/student/profile' },
]

export default function StudentJadwalPage() {
    const router = useRouter()
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch all schedules (no filter, sorted by newest)
    const fetchSchedules = useCallback(async () => {
        setLoading(true)
        const result = await getStudentSchedules()
        if (result.success && result.data) {
            // Sort by event_date descending (newest first)
            const sorted = [...result.data].sort((a, b) =>
                new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
            )
            setSchedules(sorted)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchSchedules()
    }, [fetchSchedules])

    // Navigate to detail page
    const handleViewDetail = (schedule: Schedule) => {
        router.push(`/student/schedule/${schedule.id}`)
    }

    const textColor = '#E57526'

    return (
        <DashboardLayout role="Siswa" menuItems={studentMenuItems}>
            <div className="p-6 md:p-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: textColor }}
                    >
                        Jadwal
                    </h1>
                </div>

                {/* Schedule List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"
                            />
                        ))}
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        Tidak ada jadwal kegiatan
                    </div>
                ) : (
                    <div className="space-y-4">
                        {schedules.map((schedule) => (
                            <div
                                key={schedule.id}
                                className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                                style={{ borderColor: textColor }}
                                onClick={() => handleViewDetail(schedule)}
                            >
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {schedule.name}
                                </span>
                                <button
                                    className="font-bold transition-colors hover:opacity-80"
                                    style={{ color: textColor }}
                                >
                                    Detail &gt;
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
