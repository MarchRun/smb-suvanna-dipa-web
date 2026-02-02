/**
 * Admin - Validasi Tukar Poin Page
 * Table view for approving/rejecting point exchange requests
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/shared/layout/Dashboard'
import { approveOrder, rejectOrder, getPendingOrders } from '@/actions/admin/productOrders'
import type { OrderWithDetails } from '@/types'
import { useToast } from '@/components/providers/ToastContext'

const adminMenuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pengguna', href: '/admin/users' },
    { label: 'Hadiah', href: '/admin/rewards' },
    { label: 'Konten Publik', href: '/admin/content' },
    { label: 'Profil', href: '/admin/profile' },
]

export default function ValidasiHadiahPage() {
    const router = useRouter()
    const { showToast } = useToast()
    const [orders, setOrders] = useState<OrderWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<number | null>(null)

    useEffect(() => {
        loadOrders()
    }, [])

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Calculate pagination
    const totalItems = orders.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const paginatedOrders = orders.slice(startIndex, endIndex)

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

    const loadOrders = async () => {
        setLoading(true)
        const result = await getPendingOrders()
        if (result.success && result.data) {
            setOrders(result.data)
        }
        setLoading(false)
    }

    const handleApprove = async (order: OrderWithDetails) => {
        if (!confirm(`Setujui tukar poin untuk ${order.user?.full_name || 'pengguna'}?`)) return

        setProcessingId(order.id)
        const result = await approveOrder(order.id)

        if (result.success) {
            showToast('Tukar poin berhasil disetujui!', 'success')
            loadOrders()
        } else {
            showToast(result.error || 'Gagal menyetujui', 'error')
        }
        setProcessingId(null)
    }

    const handleReject = async (order: OrderWithDetails) => {
        if (!confirm(`Tolak tukar poin untuk ${order.user?.full_name || 'pengguna'}?`)) return

        setProcessingId(order.id)
        const result = await rejectOrder(order.id)

        if (result.success) {
            showToast('Tukar poin ditolak', 'info')
            loadOrders()
        } else {
            showToast(result.error || 'Gagal menolak', 'error')
        }
        setProcessingId(null)
    }

    const textColor = '#E57526'
    const bgColor = '#f5f5f5'

    return (
        <DashboardLayout role="Admin" menuItems={adminMenuItems}>
            <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: textColor }}
                    >
                        Validasi Tukar Poin
                    </h1>

                    <button
                        onClick={() => router.push('/admin/rewards')}
                        className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90 flex items-center gap-2"
                        style={{ backgroundColor: textColor }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </button>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="overflow-hidden border-2" style={{ borderColor: 'var(--primary-500)' }}>
                        <div className="animate-pulse p-8">
                            <div className="h-10 rounded mb-4" style={{ backgroundColor: 'var(--primary-500)', opacity: 0.3 }}></div>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded mb-2"></div>
                            ))}
                        </div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="border-2 p-8 text-center" style={{ borderColor: 'var(--primary-500)' }}>
                        <p className="text-gray-500 dark:text-gray-400">
                            Tidak ada permintaan tukar poin
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="overflow-hidden border-2" style={{ borderColor: 'var(--primary-500)' }}>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr style={{ backgroundColor: 'var(--primary-500)' }}>
                                        <th className="px-4 py-3 text-center text-sm font-bold text-white w-16 border-r-2 border-white/30">
                                            No
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-white border-r-2 border-white/30">
                                            Nama Siswa
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-white border-r-2 border-white/30">
                                            Hadiah yang Ditukar
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-bold text-white w-28 border-r-2 border-white/30">
                                            Poin Siswa
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-bold text-white w-28 border-r-2 border-white/30">
                                            Harga Poin
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-bold text-white w-32">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800">
                                    {paginatedOrders.map((order, index) => (
                                        <tr
                                            key={order.id}
                                            className="border-t-2 hover:bg-orange-50 dark:hover:bg-gray-700/50 transition-colors"
                                            style={{ borderColor: 'var(--primary-500)' }}
                                        >
                                            <td
                                                className="px-4 py-4 text-center text-gray-700 dark:text-gray-300 font-medium border-r-2"
                                                style={{ borderColor: 'var(--primary-500)' }}
                                            >
                                                {startIndex + index + 1}
                                            </td>
                                            <td
                                                className="px-4 py-4 font-medium text-gray-900 dark:text-white border-r-2"
                                                style={{ borderColor: 'var(--primary-500)' }}
                                            >
                                                {order.user?.full_name || '-'}
                                            </td>
                                            <td
                                                className="px-4 py-4 text-gray-700 dark:text-gray-300 border-r-2"
                                                style={{ borderColor: 'var(--primary-500)' }}
                                            >
                                                {order.product?.name || '-'}
                                            </td>
                                            <td
                                                className="px-4 py-4 text-center text-gray-700 dark:text-gray-300 font-medium border-r-2"
                                                style={{ borderColor: 'var(--primary-500)' }}
                                            >
                                                {order.total_points}
                                            </td>
                                            <td
                                                className="px-4 py-4 text-center font-semibold text-gray-900 dark:text-white border-r-2"
                                                style={{ borderColor: 'var(--primary-500)' }}
                                            >
                                                {order.product?.price || 0}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center gap-2">
                                                    {/* Approve Button */}
                                                    <button
                                                        onClick={() => handleApprove(order)}
                                                        disabled={processingId === order.id}
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:opacity-80 disabled:opacity-50"
                                                        style={{ backgroundColor: '#16a34a' }}
                                                        title="Setujui"
                                                    >
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </button>

                                                    {/* Reject Button */}
                                                    <button
                                                        onClick={() => handleReject(order)}
                                                        disabled={processingId === order.id}
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:opacity-80 disabled:opacity-50"
                                                        style={{ backgroundColor: '#dc2626' }}
                                                        title="Tolak"
                                                    >
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
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
                                                style={currentPage === page ? { backgroundColor: 'var(--primary-500)' } : {}}
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
                )}
            </div>
        </DashboardLayout>
    )
}
