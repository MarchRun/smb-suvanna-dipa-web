/**
 * Admin - Validasi Tukar Poin Page
 * Table view for approving/rejecting point exchange requests
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import {
    getPendingOrders,
    approveOrder,
    rejectOrder,
    type ProductOrder
} from '@/actions/admin/productOrders'
import { useDarkMode } from '@/hooks/useDarkMode'

const adminMenuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pengguna', href: '/admin/pengguna' },
    { label: 'Hadiah', href: '/admin/hadiah' },
    { label: 'Konten Publik', href: '/admin/konten' },
    { label: 'Profil', href: '/admin/profil' },
]

export default function ValidasiPage() {
    const router = useRouter()
    const isDarkMode = useDarkMode()
    const [orders, setOrders] = useState<ProductOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<number | null>(null)

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        setLoading(true)
        const result = await getPendingOrders()
        if (result.success && result.data) {
            setOrders(result.data)
        }
        setLoading(false)
    }

    const handleApprove = async (order: ProductOrder) => {
        if (!confirm(`Setujui tukar poin untuk ${order.student_name}?`)) return

        setProcessingId(order.id)
        const result = await approveOrder(order.id)

        if (result.success) {
            alert('Tukar poin berhasil disetujui!')
            loadOrders()
        } else {
            alert(result.error || 'Gagal menyetujui')
        }
        setProcessingId(null)
    }

    const handleReject = async (order: ProductOrder) => {
        if (!confirm(`Tolak tukar poin untuk ${order.student_name}?`)) return

        setProcessingId(order.id)
        const result = await rejectOrder(order.id)

        if (result.success) {
            alert('Tukar poin ditolak')
            loadOrders()
        } else {
            alert(result.error || 'Gagal menolak')
        }
        setProcessingId(null)
    }

    const textColor = isDarkMode ? '#ea580c' : '#7c2d12'
    const bgColor = isDarkMode ? '#0f172a' : '#f5f5f5'

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
                        onClick={() => router.push('/admin/hadiah')}
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
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Tidak ada permintaan tukar poin
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border-2" style={{ borderColor: textColor }}>
                        <table className="w-full">
                            <thead>
                                <tr style={{ backgroundColor: textColor }}>
                                    <th className="px-4 py-3 text-left text-white font-bold">No</th>
                                    <th className="px-4 py-3 text-left text-white font-bold">Nama Siswa</th>
                                    <th className="px-4 py-3 text-left text-white font-bold">Hadiah yang Ditukar</th>
                                    <th className="px-4 py-3 text-left text-white font-bold">Poin Siswa</th>
                                    <th className="px-4 py-3 text-left text-white font-bold">Harga Poin</th>
                                    <th className="px-4 py-3 text-center text-white font-bold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr
                                        key={order.id}
                                        className="border-t"
                                        style={{
                                            backgroundColor: index % 2 === 0 ? 'white' : bgColor,
                                            borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                                        }}
                                    >
                                        <td className="px-4 py-3" style={{ color: textColor }}>
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3" style={{ color: textColor }}>
                                            {order.student_name}
                                        </td>
                                        <td className="px-4 py-3" style={{ color: textColor }}>
                                            {order.product_name}
                                        </td>
                                        <td className="px-4 py-3" style={{ color: textColor }}>
                                            {order.student_points}
                                        </td>
                                        <td className="px-4 py-3" style={{ color: textColor }}>
                                            {order.product_price}
                                        </td>
                                        <td className="px-4 py-3">
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
                )}
            </div>
        </DashboardLayout>
    )
}
