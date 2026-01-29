/**
 * Unified Users Table Component
 * Combines UserTable (Admin) and StudentTable (Teacher)
 * Handles pagination, sorting (admin), and variant-specific columns/actions
 */

'use client'

import { useState } from 'react'
import type { Profile } from '@/types'
import type { UserSort } from '@/actions/admin/users'

interface UsersTableProps {
    data: Profile[]
    variant: 'admin' | 'teacher'
    onView: (user: Profile) => void
    // Admin Actions
    onEdit?: (user: Profile) => void
    onDelete?: (user: Profile) => void
    onSort?: (sort: UserSort) => void
    currentSort?: UserSort
    // Teacher Actions
    onGivePoints?: (user: Profile) => void
    // Shared
    isLoading?: boolean
    itemsPerPage?: number
}

export default function UsersTable({
    data,
    variant,
    onView,
    onEdit,
    onDelete,
    onSort,
    currentSort,
    onGivePoints,
    isLoading = false,
    itemsPerPage = 10
}: UsersTableProps) {
    const [currentPage, setCurrentPage] = useState(1)

    // Calculate pagination
    const totalItems = data.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const paginatedData = data.slice(startIndex, endIndex)

    const handleSort = (column: UserSort['column']) => {
        if (!onSort || !currentSort) return
        if (currentSort.column === column) {
            onSort({
                column,
                direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
            })
        } else {
            onSort({ column, direction: 'asc' })
        }
        setCurrentPage(1)
    }

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const SortIcon = ({ column }: { column: UserSort['column'] }) => {
        if (!currentSort || currentSort.column !== column) {
            return (
                <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            )
        }
        return currentSort.direction === 'asc' ? (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        )
    }

    // Generate page numbers
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

    if (data.length === 0) {
        return (
            <div className="border-2 p-8 text-center" style={{ borderColor: '#E57526' }}>
                <p className="text-gray-500 dark:text-gray-400">
                    Tidak ada data {variant === 'admin' ? 'pengguna' : 'siswa'}
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
                            <th className="px-4 py-3 text-center text-sm font-bold text-white w-16 border-r-2 border-white/30">
                                No
                            </th>
                            {/* Name Column - Sorting only for Admin */}
                            <th
                                className={`px-4 py-3 text-left text-sm font-bold text-white border-r-2 border-white/30 ${variant === 'admin' ? 'cursor-pointer hover:brightness-110 transition-colors' : ''}`}
                                onClick={() => variant === 'admin' && handleSort('full_name')}
                            >
                                <div className="flex items-center gap-2">
                                    {variant === 'admin' ? 'Nama Pengguna' : 'Nama Siswa'}
                                    {variant === 'admin' && <SortIcon column="full_name" />}
                                </div>
                            </th>

                            {/* Variant Specific Column */}
                            {variant === 'admin' && (
                                <th
                                    className="px-4 py-3 text-center text-sm font-bold text-white cursor-pointer transition-colors border-r-2 border-white/30 w-32 hover:brightness-110"
                                    onClick={() => handleSort('role')}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        Peran
                                        <SortIcon column="role" />
                                    </div>
                                </th>
                            )}
                            {variant === 'teacher' && (
                                <th className="px-4 py-3 text-center text-sm font-bold text-white w-24 border-r-2 border-white/30">
                                    Poin
                                </th>
                            )}

                            <th className="px-4 py-3 text-center text-sm font-bold text-white w-36">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                        {paginatedData.map((item, index) => (
                            <tr
                                key={item.id}
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
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {item.full_name || '-'}
                                    </span>
                                </td>

                                {variant === 'admin' && (
                                    <td
                                        className="px-4 py-4 text-center border-r-2"
                                        style={{ borderColor }}
                                    >
                                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                                            {item.role || '-'}
                                        </span>
                                    </td>
                                )}
                                {variant === 'teacher' && (
                                    <td
                                        className="px-4 py-4 text-center border-r-2"
                                        style={{ borderColor }}
                                    >
                                        <span className="font-bold text-orange-600 dark:text-orange-400">
                                            {item.points ?? 0}
                                        </span>
                                    </td>
                                )}

                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-center gap-1">
                                        {/* View Button - Shared */}
                                        <button
                                            onClick={() => onView(item)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                            title="Lihat"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>

                                        {/* Admin specific buttons */}
                                        {variant === 'admin' && onEdit && (
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        )}
                                        {variant === 'admin' && onDelete && (
                                            <button
                                                onClick={() => onDelete(item)}
                                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}

                                        {/* Teacher specific buttons */}
                                        {variant === 'teacher' && onGivePoints && (
                                            <button
                                                onClick={() => onGivePoints(item)}
                                                className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                title="Beri Poin"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination - Shared */}
            {totalPages > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 px-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Menampilkan {startIndex + 1} - {endIndex} dari {totalItems} entri
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium rounded-lg transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed
                                text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            &lt; Sebelumnya
                        </button>

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
