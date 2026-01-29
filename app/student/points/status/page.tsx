/**
 * Student - Status Tukar Poin Page
 * Shows redemption history for the student
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/shared/layout/Dashboard'
import { Modal } from '@/components/shared/ui/Modals'
import {
    getStudentRedemptions,
    getStudentPoints,
    cancelRedemption,
    type StudentRedemption
} from '@/actions/student/products'
import type { OrderStatus } from '@/types'

const siswaMenuItems = [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'Jadwal', href: '/student/jadwal' },
    { label: 'Poin', href: '/student/poin' },
    { label: 'Presensi', href: '/student/presensi' },
    { label: 'Profil', href: '/student/profil' },
]

export default function StatusTukarPoinPage() {
    const router = useRouter()
    const [redemptions, setRedemptions] = useState<StudentRedemption[]>([])
    const [studentPoints, setStudentPoints] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

    // Modal for cancel confirmation
    const [showCancelConfirm, setShowCancelConfirm] = useState(false)
    const [selectedRedemption, setSelectedRedemption] = useState<StudentRedemption | null>(null)
    const [canceling, setCanceling] = useState(false)

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Calculate pagination
    const totalItems = redemptions.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const paginatedRedemptions = redemptions.slice(startIndex, endIndex)

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

    useEffect(() => {
        loadData()
    }, [statusFilter])

    const loadData = async () => {
        setLoading(true)

        const [redemptionsResult, pointsResult] = await Promise.all([
            getStudentRedemptions(statusFilter),
            getStudentPoints()
        ])

        if (redemptionsResult.success && redemptionsResult.data) {
            setRedemptions(redemptionsResult.data)
        }
        if (pointsResult.success && pointsResult.data !== undefined) {
            setStudentPoints(pointsResult.data)
        }

        setLoading(false)
    }

    const handleCancelClick = (redemption: StudentRedemption) => {
        setSelectedRedemption(redemption)
        setShowCancelConfirm(true)
    }

    const confirmCancel = async () => {
        if (!selectedRedemption) return

        setCanceling(true)
        const result = await cancelRedemption(selectedRedemption.id)
        setCanceling(false)

        if (result.success) {
            alert('Permintaan tukar poin berhasil dibatalkan.')
            setShowCancelConfirm(false)
            setSelectedRedemption(null)
            loadData()
        } else {
            alert(result.error || 'Gagal membatalkan permintaan')
        }
    }

    const getStatusBadge = (status: OrderStatus) => {
        const styles = {
            pending: {
                bg: '#fef3c7',
                text: '#92400e',
                label: 'Pending'
            },
            approved: {
                bg: '#dcfce7',
                text: '#166534',
                label: 'Disetujui'
            },
            rejected: {
                bg: '#fee2e2',
                text: '#991b1b',
                label: 'Ditolak'
            }
        }
        const style = styles[status]
        return (
            <span
                className="px-3 py-1 rounded-full text-sm font-semibold"
                style={{ backgroundColor: style.bg, color: style.text }}
            >
                {style.label}
            </span>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const textColor = '#E57526'
    const bgColor = '#ffffff'
    const borderColor = '#e2e8f0'
    const headerBg = '#f8fafc'

    return (
        <DashboardLayout role="Siswa" menuItems={siswaMenuItems}>
            <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: textColor }}
                    >
                        Status Tukar Poin
                    </h1>

                    <button
                        onClick={() => router.push('/student/poin')}
                        className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
                        style={{ backgroundColor: textColor }}
                    >
                        Kembali ke Hadiah
                    </button>
                </div>

                {/* Points Display */}
                <div
                    className="mb-6 p-4 rounded-xl"
                    style={{ backgroundColor: bgColor, border: `2px solid ${borderColor}` }}
                >
                    <p className="text-lg font-semibold" style={{ color: textColor }}>
                        Poin Kamu Saat Ini: <span className="text-2xl">{studentPoints}</span>
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {[
                        { value: 'all', label: 'Semua' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'approved', label: 'Disetujui' },
                        { value: 'rejected', label: 'Ditolak' }
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setStatusFilter(tab.value as OrderStatus | 'all')}
                            className="px-4 py-2 rounded-full font-semibold transition-all duration-200"
                            style={{
                                backgroundColor: statusFilter === tab.value ? textColor : 'transparent',
                                color: statusFilter === tab.value ? 'white' : textColor,
                                border: `2px solid ${textColor}`
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Table */}
                {loading ? (
                    <div className="overflow-hidden border-2" style={{ borderColor: 'var(--primary-900)' }}>
                        <div className="animate-pulse p-8">
                            <div className="h-10 rounded mb-4" style={{ backgroundColor: 'var(--primary-900)', opacity: 0.3 }}></div>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded mb-2"></div>
                            ))}
                        </div>
                    </div>
                ) : redemptions.length === 0 ? (
                    <div className="border-2 p-8 text-center" style={{ borderColor: 'var(--primary-900)' }}>
                        <p className="text-gray-500 dark:text-gray-400">
                            Tidak ada riwayat tukar poin
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="overflow-hidden border-2" style={{ borderColor: 'var(--primary-900)' }}>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr style={{ backgroundColor: 'var(--primary-900)' }}>
                                        <th className="px-4 py-3 text-center text-sm font-bold text-white w-16 border-r-2 border-white/30">
                                            No
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
                                        <th className="px-4 py-3 text-center text-sm font-bold text-white w-28 border-r-2 border-white/30">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-bold text-white w-32">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800">
                                    {paginatedRedemptions.map((redemption, index) => (
                                        <tr
                                            key={redemption.id}
                                            className="border-t-2 hover:bg-orange-50 dark:hover:bg-gray-700/50 transition-colors"
                                            style={{ borderColor: 'var(--primary-900)' }}
                                        >
                                            <td
                                                className="px-4 py-4 text-center text-gray-700 dark:text-gray-300 font-medium border-r-2"
                                                style={{ borderColor: 'var(--primary-900)' }}
                                            >
                                                {startIndex + index + 1}
                                            </td>
                                            <td
                                                className="px-4 py-4 border-r-2"
                                                style={{ borderColor: 'var(--primary-900)' }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {redemption.product?.image_url ? (
                                                        <img
                                                            src={redemption.product.image_url}
                                                            alt={redemption.product?.name || 'Hadiah'}
                                                            className="w-10 h-10 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                            style={{ backgroundColor: 'var(--primary-900)' }}
                                                        >
                                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{redemption.product?.name || 'Hadiah tidak ditemukan'}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatDate(redemption.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                className="px-4 py-4 text-center text-gray-700 dark:text-gray-300 font-medium border-r-2"
                                                style={{ borderColor: 'var(--primary-900)' }}
                                            >
                                                {studentPoints}
                                            </td>
                                            <td
                                                className="px-4 py-4 text-center font-semibold text-gray-900 dark:text-white border-r-2"
                                                style={{ borderColor: 'var(--primary-900)' }}
                                            >
                                                {redemption.total_points}
                                            </td>
                                            <td
                                                className="px-4 py-4 text-center border-r-2"
                                                style={{ borderColor: 'var(--primary-900)' }}
                                            >
                                                {getStatusBadge(redemption.status)}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {redemption.status === 'pending' ? (
                                                    <button
                                                        onClick={() => handleCancelClick(redemption)}
                                                        className="px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-80"
                                                        style={{ backgroundColor: '#dc2626' }}
                                                    >
                                                        Batalkan
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500">-</span>
                                                )}
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
                                                style={currentPage === page ? { backgroundColor: 'var(--primary-900)' } : {}}
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

            {/* Cancel Confirmation Modal */}
            <Modal
                isOpen={showCancelConfirm && !!selectedRedemption}
                onClose={() => {
                    setShowCancelConfirm(false)
                    setSelectedRedemption(null)
                }}
                size="sm"
                showCloseButton={false}
            >
                {selectedRedemption && (
                    <div className="p-6 md:p-8">
                        <h2
                            className="text-2xl font-bold mb-4"
                            style={{ color: textColor }}
                        >
                            Batalkan Permintaan?
                        </h2>
                        <p className="mb-6" style={{ color: textColor }}>
                            Apakah kamu yakin ingin membatalkan permintaan tukar hadiah
                            <strong> "{selectedRedemption.product?.name}"</strong>?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowCancelConfirm(false)
                                    setSelectedRedemption(null)
                                }}
                                className="flex-1 px-6 py-3 rounded-xl font-bold border-2 hover:opacity-80"
                                style={{
                                    borderColor: textColor,
                                    color: textColor
                                }}
                            >
                                Tidak
                            </button>
                            <button
                                onClick={confirmCancel}
                                disabled={canceling}
                                className="flex-1 px-6 py-3 rounded-xl font-bold text-white hover:opacity-80 disabled:opacity-50"
                                style={{ backgroundColor: '#dc2626' }}
                            >
                                {canceling ? 'Memproses...' : 'Ya, Batalkan'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    )
}
