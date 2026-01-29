/**
 * Student - Jadwal Page
 * Read-only schedule viewing for students with month filter
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/shared/layout/Dashboard'
import ScheduleTable from '@/components/shared/specialized/ScheduleTable'
import { getStudentSchedules } from '@/actions/student/schedule'
import type { Schedule } from '@/types'

// Menu items for Student
const studentMenuItems = [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'Jadwal', href: '/student/jadwal' },
    { label: 'Poin', href: '/student/poin' },
    { label: 'Presensi', href: '/student/presensi' },
    { label: 'Profil', href: '/student/profil' }
]

export default function StudentJadwalPage() {
    const router = useRouter()
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [loading, setLoading] = useState(true)

    // Filter state
    const currentDate = new Date()
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1) // 1-12
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

    // Fetch schedules
    const fetchSchedules = useCallback(async () => {
        setLoading(true)
        const result = await getStudentSchedules(selectedMonth, selectedYear)
        if (result.success && result.data) {
            setSchedules(result.data)
        }
        setLoading(false)
    }, [selectedMonth, selectedYear])

    useEffect(() => {
        fetchSchedules()
    }, [fetchSchedules])

    // Handlers
    const handleView = (schedule: Schedule) => {
        router.push(`/student/jadwal/${schedule.id}`)
    }

    const textColor = 'var(--primary-900)'

    // Month options
    const months = [
        { value: 1, label: 'Januari' },
        { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Mei' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'Desember' }
    ]

    // Generate year options (current year ± 2)
    const years = [
        selectedYear - 2,
        selectedYear - 1,
        selectedYear,
        selectedYear + 1,
        selectedYear + 2
    ]

    return (
        <DashboardLayout role="Siswa" menuItems={studentMenuItems}>
            <div className="p-6 md:p-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: textColor }}
                    >
                        Jadwal Kegiatan Bulanan
                    </h1>
                </div>

                {/* Month/Year Filter */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                            Bulan
                        </label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-full border-2
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-orange-500
                                 transition-all duration-200"
                            style={{ borderColor: textColor }}
                        >
                            {months.map(month => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                            Tahun
                        </label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="w-full px-4 py-3 rounded-full border-2
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-orange-500
                                 transition-all duration-200"
                            style={{ borderColor: textColor }}
                        >
                            {years.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Schedule Table */}
                <ScheduleTable
                    schedules={schedules}
                    variant="student"
                    onView={handleView}
                    isLoading={loading}
                />
            </div>
        </DashboardLayout>
    )
}
