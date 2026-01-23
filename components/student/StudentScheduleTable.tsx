/**
 * Student Schedule Table Component
 * Read-only schedule table for students (View only, no Edit/Delete)
 * Styled consistently with ScheduleTable
 */

'use client'

import { useState } from 'react'
import type { Schedule } from '@/types'

interface StudentScheduleTableProps {
    schedules: Schedule[]
    onView: (schedule: Schedule) => void
    isLoading?: boolean
    itemsPerPage?: number
}

export default function StudentScheduleTable({
    schedules,
    onView,
    isLoading = false,
    itemsPerPage = 10
}: StudentScheduleTableProps) {
    const [currentPage, setCurrentPage] = useState(1)

    // Calculate pagination
    const totalItems = schedules.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const paginatedSchedules = schedules.slice(startIndex, endIndex)

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 3) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
            } else {
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            }
        }
        return pages
    }

    // Format date to display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    if (isLoading) {
        return (
            <div className="overflow-hidden border-2" style={{ borderColor: '#E57526' }}>
                <div className="animate-pulse p-8">
                    <div className="h-10 rounded mb-4" style={{ backgroundColor: '#E57526', opacity: 0.3 }}></div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded mb-2"></div>
                    ))}
                </div>
            </div>
        )
    }

    if (schedules.length === 0) {
        return (
            <div className="border-2 p-8 text-center" style={{ borderColor: '#E57526' }}>
                <p className="text-gray-500 dark:text-gray-400">
                    Tidak ada jadwal kegiatan
                </p>
            </div>
        )
    }

    const headerBg = '#E57526'
    const borderColor = '#E57526'

    return (
        <div>
            <div className="overflow-hidden border-2" style={{ borderColor }}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr style={{ backgroundColor: headerBg }}>
                            <th
                                className="px-4 py-3 text-center text-sm font-bold text-white w-16 border-r-2 border-white/30"
                            >
                                No
                            </th>
                            <th
                                className="px-4 py-3 text-left text-sm font-bold text-white border-r-2 border-white/30"
                            >
                                Nama Kegiatan
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-bold text-white w-24">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                        {paginatedSchedules.map((schedule, index) => (
                            <tr
                                key={schedule.id}
                                className="border-t-2 hover:bg-orange-50 dark:hover:bg-gray-700/50 transition-colors"
                                style={{ borderColor: borderColor }}
                            >
                                <td
                                    className="px-4 py-4 text-center text-gray-700 dark:text-gray-300 font-medium border-r-2"
                                    style={{ borderColor }}
                                >
                                    {startIndex + index + 1}
                                </td>
                                <td
                                    className="px-4 py-4 border-r-2"
                                    style={{ borderColor }}
                                >
                                    <div>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {schedule.name}
                                        </span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {formatDate(schedule.event_date)}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-center">
                                        {/* View Button Only */}
                                        <button
                                            onClick={() => onView(schedule)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                            title="Lihat"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 px-2">
                    {/* Entries Info */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Menampilkan {startIndex + 1} - {endIndex} dari {totalItems} entri
                    </div>

                    {/* Page Navigation */}
                    <div className="flex items-center gap-1">
                        {/* Previous Button */}
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium rounded-lg transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed
                                text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            &lt; Sebelumnya
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page, index) => (
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page as number)}
                                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors
                                        ${currentPage === page
                                            ? 'text-white'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    style={currentPage === page ? { backgroundColor: '#E57526' } : {}}
                                >
                                    {page}
                                </button>
                            )
                        ))}

                        {/* Next Button */}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium rounded-lg transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed
                                text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Berikutnya &gt;
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
