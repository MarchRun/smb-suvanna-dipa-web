/**
 * Student - Poin Page
 * Main page for students to view and redeem points
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/shared/DashboardLayout'
import Modal from '@/components/shared/Modal'
import StudentRewardCard from '@/components/rewards/StudentRewardCard'
import FilterForm from '@/components/rewards/FilterForm'
import {
    getAvailableProducts,
    getStudentPoints,
    createRedemption,
    type ProductFilters
} from '@/actions/student/products'
import type { Product } from '@/actions/admin/products'
import { useDarkMode } from '@/hooks/useDarkMode'

const siswaMenuItems = [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'Jadwal', href: '/student/jadwal' },
    { label: 'Poin', href: '/student/poin' },
    { label: 'Presensi', href: '/student/presensi' },
    { label: 'Profil', href: '/student/profil' },
]

export default function StudentPoinPage() {
    const router = useRouter()
    const isDarkMode = useDarkMode()
    const [products, setProducts] = useState<Product[]>([])
    const [studentPoints, setStudentPoints] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<ProductFilters>({})

    // Modals
    const [showFilter, setShowFilter] = useState(false)
    const [showConfirmRedeem, setShowConfirmRedeem] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [redeeming, setRedeeming] = useState(false)

    useEffect(() => {
        loadData()
    }, [filters])

    const loadData = async () => {
        setLoading(true)

        // Load products and points in parallel
        const [productsResult, pointsResult] = await Promise.all([
            getAvailableProducts(filters),
            getStudentPoints()
        ])

        if (productsResult.success && productsResult.data) {
            setProducts(productsResult.data)
        }
        if (pointsResult.success && pointsResult.data !== undefined) {
            setStudentPoints(pointsResult.data)
        }

        setLoading(false)
    }

    const handleSearch = () => {
        setFilters({ ...filters, search })
    }

    const handleApplyFilter = (filterData: {
        stockStatus: 'all' | 'in-stock' | 'out-of-stock'
        sortBy: string
    }) => {
        // Note: For student view, we only show in-stock items
        // sortBy could be used for price sorting
        setShowFilter(false)
    }

    const handleResetFilter = () => {
        setFilters({})
        setSearch('')
    }

    const handleRedeem = (product: Product) => {
        setSelectedProduct(product)
        setShowConfirmRedeem(true)
    }

    const confirmRedeem = async () => {
        if (!selectedProduct) return

        setRedeeming(true)
        const result = await createRedemption(selectedProduct.id)
        setRedeeming(false)

        if (result.success) {
            alert('Permintaan tukar poin berhasil! Silakan tunggu validasi dari admin.')
            setShowConfirmRedeem(false)
            setSelectedProduct(null)
            loadData() // Refresh data
        } else {
            alert(result.error || 'Gagal menukar poin')
        }
    }

    const textColor = isDarkMode ? '#ea580c' : '#E57526'

    return (
        <DashboardLayout role="Siswa" menuItems={siswaMenuItems}>
            <div className="p-6 md:p-8">
                {/* Header with Points Display and Status Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: textColor }}
                    >
                        Jumlah Poin Kamu: {loading ? '...' : studentPoints}
                    </h1>

                    <button
                        onClick={() => router.push('/student/poin/status')}
                        className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
                        style={{ backgroundColor: textColor }}
                    >
                        Cek Status Tukar Poin
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-4 mb-8">
                    {/* Rounded Search Input with icon inside */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Cari Hadiah..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-12 pr-4 py-3 rounded-full border-2
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-orange-500
                                 transition-all duration-200 font-semibold"
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

                    {/* Filter Button with icon */}
                    <button
                        onClick={() => setShowFilter(true)}
                        className="px-6 py-3 rounded-full font-bold text-white transition-all duration-200 hover:opacity-90 flex items-center gap-2"
                        style={{ backgroundColor: textColor }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filter
                    </button>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Tidak ada hadiah tersedia
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {products.map((product) => (
                            <StudentRewardCard
                                key={product.id}
                                reward={product}
                                studentPoints={studentPoints}
                                onRedeem={handleRedeem}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Filter Modal */}
            {showFilter && (
                <FilterForm
                    onApply={handleApplyFilter}
                    onReset={handleResetFilter}
                    onClose={() => setShowFilter(false)}
                />
            )}

            {/* Redeem Confirmation Modal */}
            <Modal
                isOpen={showConfirmRedeem && !!selectedProduct}
                onClose={() => {
                    setShowConfirmRedeem(false)
                    setSelectedProduct(null)
                }}
                size="sm"
                showCloseButton={false}
            >
                {selectedProduct && (
                    <div className="p-6 md:p-8">
                        <h2
                            className="text-2xl font-bold mb-4"
                            style={{ color: textColor }}
                        >
                            Konfirmasi Tukar Poin
                        </h2>
                        <p className="mb-4" style={{ color: textColor }}>
                            Apakah kamu yakin ingin menukar hadiah <strong>"{selectedProduct.name}"</strong>?
                        </p>
                        <div
                            className="p-4 rounded-lg mb-6"
                            style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}
                        >
                            <div className="flex justify-between mb-2">
                                <span style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}>Poin Kamu:</span>
                                <span className="font-bold" style={{ color: textColor }}>{studentPoints}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}>Harga Hadiah:</span>
                                <span className="font-bold" style={{ color: textColor }}>-{selectedProduct.price}</span>
                            </div>
                            <hr className="my-2 border-gray-300 dark:border-gray-600" />
                            <div className="flex justify-between">
                                <span style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}>Sisa Poin:</span>
                                <span className="font-bold" style={{ color: textColor }}>
                                    {studentPoints - selectedProduct.price}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowConfirmRedeem(false)
                                    setSelectedProduct(null)
                                }}
                                className="flex-1 px-6 py-3 rounded-xl font-bold border-2 hover:opacity-80"
                                style={{
                                    borderColor: textColor,
                                    color: textColor
                                }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmRedeem}
                                disabled={redeeming}
                                className="flex-1 px-6 py-3 rounded-xl font-bold text-white hover:opacity-80 disabled:opacity-50"
                                style={{ backgroundColor: textColor }}
                            >
                                {redeeming ? 'Memproses...' : 'Tukar'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    )
}
