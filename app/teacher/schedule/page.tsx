/**
 * Teacher - Jadwal Page
 * Lists all schedules for teacher's class with month filter and CRUD operations
 * Styled to match wireframe and existing patterns
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/shared/layout/Dashboard'
import ScheduleFormModal, { ScheduleFormData } from '@/components/teacher/ScheduleFormModal'
import ScheduleTable from '@/components/shared/specialized/ScheduleTable'
import { ConfirmDialog } from '@/components/shared/ui/Modals'
import {
    getTeacherSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
} from '@/actions/teacher/schedule'
import type { Schedule } from '@/types'
import { useToast } from '@/components/providers/ToastContext'

// Menu items for Pembina
const pembinaMenuItems = [
    { label: 'Dashboard', href: '/teacher/dashboard' },
    { label: 'Jadwal', href: '/teacher/schedule' },
    { label: 'Kelas', href: '/teacher/classes' },
    { label: 'Profil', href: '/teacher/profile' },
]

export default function JadwalPembinaPage() {
    const router = useRouter()
    const { showToast } = useToast()
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [loading, setLoading] = useState(true)

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
        router.push(`/teacher/schedule/${schedule.id}`)
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
            showToast(result?.error || 'Gagal menyimpan jadwal', 'error')
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
            showToast(result.error || 'Gagal menghapus jadwal', 'error')
        }
    }

    const textColor = '#E57526'

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
                    variant="teacher"
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
