/**
 * User Table Component
 * Displays list of users with sortable headers and action buttons
 * Styled to match wireframe with vertical separators
 */

'use client'

import type { Profile } from '@/types'
import type { UserSort } from '@/actions/admin/users'

interface UserTableProps {
    users: Profile[]
    onSort: (sort: UserSort) => void
    currentSort: UserSort
    onView: (user: Profile) => void
    onEdit: (user: Profile) => void
    onDelete: (user: Profile) => void
    isLoading?: boolean
}

export default function UserTable({
    users,
    onSort,
    currentSort,
    onView,
    onEdit,
    onDelete,
    isLoading = false
}: UserTableProps) {
    const handleSort = (column: UserSort['column']) => {
        if (currentSort.column === column) {
            onSort({
                column,
                direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
            })
        } else {
            onSort({ column, direction: 'asc' })
        }
    }

    const SortIcon = ({ column }: { column: UserSort['column'] }) => {
        if (currentSort.column !== column) {
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

    if (isLoading) {
        return (
            <div className="overflow-hidden border-2" style={{ borderColor: 'var(--primary-900)' }}>
                <div className="animate-pulse p-8">
                    <div className="h-10 rounded mb-4" style={{ backgroundColor: 'var(--primary-900)', opacity: 0.3 }}></div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded mb-2"></div>
                    ))}
                </div>
            </div>
        )
    }

    if (users.length === 0) {
        return (
            <div className="border-2 p-8 text-center" style={{ borderColor: 'var(--primary-900)' }}>
                <p className="text-gray-500 dark:text-gray-400">
                    Tidak ada data pengguna
                </p>
            </div>
        )
    }

    const headerBg = 'var(--primary-900)'
    const borderColor = 'var(--primary-900)'

    return (
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
                            className="px-4 py-3 text-left text-sm font-bold text-white cursor-pointer transition-colors border-r-2 border-white/30 hover:brightness-110"
                            onClick={() => handleSort('full_name')}
                        >
                            <div className="flex items-center gap-2">
                                Nama Pengguna
                                <SortIcon column="full_name" />
                            </div>
                        </th>
                        <th
                            className="px-4 py-3 text-center text-sm font-bold text-white cursor-pointer transition-colors border-r-2 border-white/30 w-32 hover:brightness-110"
                            onClick={() => handleSort('role')}
                        >
                            <div className="flex items-center justify-center gap-2">
                                Peran
                                <SortIcon column="role" />
                            </div>
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-white w-36">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr
                            key={user.id}
                            className="border-t-2 hover:bg-orange-50 dark:hover:bg-gray-700/50 transition-colors"
                            style={{ borderColor: borderColor }}
                        >
                            <td
                                className="px-4 py-4 text-center text-gray-700 dark:text-gray-300 font-medium border-r-2"
                                style={{ borderColor }}
                            >
                                {index + 1}
                            </td>
                            <td
                                className="px-4 py-4 border-r-2"
                                style={{ borderColor }}
                            >
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {user.full_name || '-'}
                                </span>
                            </td>
                            <td
                                className="px-4 py-4 text-center border-r-2"
                                style={{ borderColor }}
                            >
                                <span className="font-medium text-gray-900 dark:text-white capitalize">
                                    {user.role || '-'}
                                </span>
                            </td>
                            <td className="px-4 py-4">
                                <div className="flex items-center justify-center gap-1">
                                    {/* View Button */}
                                    <button
                                        onClick={() => onView(user)}
                                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                        title="Lihat"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>

                                    {/* Edit Button */}
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => onDelete(user)}
                                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                        title="Hapus"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
