/**
 * Teacher - Jadwal Page
 * Lists all schedules for teacher's class with month filter and CRUD operations
 * Styled to match wireframe and existing patterns
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/shared/DashboardLayout'
import ScheduleTable from '@/components/teacher/ScheduleTable'
import ScheduleFormModal from '@/components/teacher/ScheduleFormModal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    getTeacherSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
} from '@/actions/teacher/schedule'
import type { Schedule } from '@/types'

// Menu items for Pembina
const pembinaMenuItems = [
    { label: 'Dashboard', href: '/teacher/dashboard' },
    { label: 'Jadwal', href: '/teacher/jadwal' },
    { label: 'Kelas', href: '/teacher/kelas' },
    { label: 'Profil', href: '/teacher/profil' },
]

export default function JadwalPage() {
    const router = useRouter()
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [loading, setLoading] = useState(true)
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Filter state
    const currentDate = new Date()
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1) // 1-12
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

    // Modal states
    const [formModalOpen, setFormModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
    const [modalLoading, setModalLoading] = useState(false)

    // Delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null)

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

    // Fetch schedules
    const fetchSchedules = useCallback(async () => {
        setLoading(true)
        const result = await getTeacherSchedules(selectedMonth, selectedYear)
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
        router.push(`/teacher/jadwal/${schedule.id}`)
    }

    const handleAddClick = () => {
        setModalMode('create')
        setSelectedSchedule(null)
        setFormModalOpen(true)
    }

    const handleEditClick = (schedule: Schedule) => {
        setModalMode('edit')
        setSelectedSchedule(schedule)
        setFormModalOpen(true)
    }

    const handleDeleteClick = (schedule: Schedule) => {
        setScheduleToDelete(schedule)
        setDeleteDialogOpen(true)
    }

    const handleFormSubmit = async (data: { name: string; event_date: string; description?: string }) => {
        setModalLoading(true)

        let result
        if (modalMode === 'create') {
            result = await createSchedule(data)
        } else if (selectedSchedule) {
            result = await updateSchedule(selectedSchedule.id, data)
        }

        if (result?.success) {
            setFormModalOpen(false)
            setSelectedSchedule(null)
            fetchSchedules()
        } else {
            alert(result?.error || 'Gagal menyimpan jadwal')
        }

        setModalLoading(false)
    }

    const handleDeleteConfirm = async () => {
        if (!scheduleToDelete) return

        const result = await deleteSchedule(scheduleToDelete.id)

        if (result.success) {
            setDeleteDialogOpen(false)
            setScheduleToDelete(null)
            fetchSchedules()
        } else {
            alert(result.error || 'Gagal menghapus jadwal')
        }
    }

    const textColor = isDarkMode ? '#ea580c' : 'var(--primary-900)'

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
        <DashboardLayout role="Pembina" menuItems={pembinaMenuItems}>
            <div className="p-6 md:p-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: textColor }}
                    >
                        Jadwal Kegiatan Bulanan
                    </h1>
                    <button
                        onClick={handleAddClick}
                        className="px-6 py-3 rounded-xl font-bold text-white hover:opacity-90 transition-all"
                        style={{ backgroundColor: textColor }}
                    >
                        Tambah Kegiatan
                    </button>
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
                    onView={handleView}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    isLoading={loading}
                />

                {/* Form Modal */}
                <ScheduleFormModal
                    isOpen={formModalOpen}
                    onClose={() => {
                        setFormModalOpen(false)
                        setSelectedSchedule(null)
                    }}
                    mode={modalMode}
                    schedule={selectedSchedule}
                    onSubmit={handleFormSubmit}
                    isLoading={modalLoading}
                />

                {/* Delete Confirmation Dialog */}
                <ConfirmDialog
                    isOpen={deleteDialogOpen}
                    onCancel={() => {
                        setDeleteDialogOpen(false)
                        setScheduleToDelete(null)
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Hapus Jadwal"
                    message={`Apakah Anda yakin ingin menghapus jadwal "${scheduleToDelete?.name}"?`}
                    confirmLabel="Hapus"
                    variant="danger"
                />
            </div>
        </DashboardLayout>
    )
}
