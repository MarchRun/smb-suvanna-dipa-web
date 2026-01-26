/**
 * Teacher - Kelas Page
 * Lists all students in teacher's class with search and action buttons
 * Styled to match wireframe
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/shared/DashboardLayout'
import StudentTable from '@/components/teacher/StudentTable'
import GivePointsModal from '@/components/teacher/GivePointsModal'
import { getTeacherStudents, getTeacherClassInfo, givePoints } from '@/actions/teacher/students'
import type { Profile } from '@/types'

// Menu items for Pembina
const pembinaMenuItems = [
    { label: 'Dashboard', href: '/teacher/dashboard' },
    { label: 'Jadwal', href: '/teacher/schedule' },
    { label: 'Kelas', href: '/teacher/classes' },
    { label: 'Profil', href: '/teacher/profile' },
]

export default function KelasPage() {
    const router = useRouter()
    const [students, setStudents] = useState<Profile[]>([])
    const [className, setClassName] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Search state
    const [search, setSearch] = useState('')

    // Modal states
    const [pointsModalOpen, setPointsModalOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Profile | null>(null)
    const [modalLoading, setModalLoading] = useState(false)

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

    // Fetch class info
    useEffect(() => {
        async function fetchClassInfo() {
            const result = await getTeacherClassInfo()
            if (result.success && result.data) {
                setClassName(result.data.className)
            }
        }
        fetchClassInfo()
    }, [])

    // Fetch students
    const fetchStudents = useCallback(async () => {
        setLoading(true)
        const result = await getTeacherStudents(search || undefined)
        if (result.success && result.data) {
            setStudents(result.data)
        }
        setLoading(false)
    }, [search])

    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    // Handlers
    const handleView = (student: Profile) => {
        router.push(`/teacher/classes/${student.id}`)
    }

    const handleGivePointsClick = (student: Profile) => {
        setSelectedStudent(student)
        setPointsModalOpen(true)
    }

    const handleGivePointsSubmit = async (amount: number, reason: string) => {
        if (!selectedStudent) return

        setModalLoading(true)
        const result = await givePoints(selectedStudent.id, amount, reason)

        if (result.success) {
            setPointsModalOpen(false)
            setSelectedStudent(null)
            fetchStudents() // Refresh the list
        } else {
            alert(result.error || 'Gagal memberikan poin')
        }

        setModalLoading(false)
    }

    const textColor = isDarkMode ? '#ea580c' : 'var(--primary-900)'

    return (
        <DashboardLayout role="Pembina" menuItems={pembinaMenuItems}>
            <div className="p-6 md:p-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1
                            className="text-2xl md:text-3xl font-bold"
                            style={{ color: textColor }}
                        >
                            Kelas Sekolah Minggu
                        </h1>
                        {className && (
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Kelas: <span className="font-semibold">{className}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex gap-4 mb-6">
                    {/* Rounded Search Input */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari Siswa..."
                            className="w-full pl-12 pr-4 py-3 rounded-full border-2
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-orange-500
                                 transition-all duration-200"
                            style={{ borderColor: textColor }}
                        />
                        <svg
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Students Table */}
                <StudentTable
                    students={students}
                    onView={handleView}
                    onGivePoints={handleGivePointsClick}
                    isLoading={loading}
                />

                {/* Give Points Modal */}
                <GivePointsModal
                    isOpen={pointsModalOpen}
                    onClose={() => {
                        setPointsModalOpen(false)
                        setSelectedStudent(null)
                    }}
                    student={selectedStudent}
                    onSubmit={handleGivePointsSubmit}
                    isLoading={modalLoading}
                />
            </div>
        </DashboardLayout>
    )
}
