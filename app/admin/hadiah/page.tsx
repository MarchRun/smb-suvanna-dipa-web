/**
 * Admin - Hadiah Page
 * Main rewards management page with grid display
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/shared/DashboardLayout'
import Modal from '@/components/shared/Modal'
import RewardCard from '@/components/rewards/RewardCard'
import RewardForm from '@/components/rewards/RewardForm'
import FilterForm from '@/components/rewards/FilterForm'
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    type Product,
    type ProductFilters,
    type ProductSort
} from '@/actions/admin/products'
import { uploadProfilePicture } from '@/actions/profile/uploadPicture'
import { useDarkMode } from '@/hooks/useDarkMode'

const adminMenuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pengguna', href: '/admin/pengguna' },
    { label: 'Hadiah', href: '/admin/hadiah' },
    { label: 'Konten Publik', href: '/admin/konten' },
    { label: 'Profil', href: '/admin/profil' },
]

export default function HadiahPage() {
    const router = useRouter()
    const isDarkMode = useDarkMode()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<ProductFilters>({})
    const [sort, setSort] = useState<ProductSort>({ field: 'name', direction: 'asc' })

    // Modals
    const [showAddForm, setShowAddForm] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    useEffect(() => {
        loadProducts()
    }, [filters, sort])

    const loadProducts = async () => {
        setLoading(true)
        const result = await getProducts(filters, sort)
        if (result.success && result.data) {
            setProducts(result.data)
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
        setFilters({ ...filters, stockStatus: filterData.stockStatus })

        // Parse sort
        const [field, direction] = filterData.sortBy.split('-') as [ProductSort['field'], ProductSort['direction']]
        setSort({ field, direction })
    }

    const handleResetFilter = () => {
        setFilters({})
        setSort({ field: 'name', direction: 'asc' })
    }

    const handleAdd = async (data: { name: string; price: number; stock: number; image?: File }) => {
        let imageUrl: string | undefined = undefined

        // Upload image if provided
        if (data.image) {
            const formData = new FormData()
            formData.append('file', data.image)
            const uploadResult = await uploadProfilePicture(formData)

            if (uploadResult.success && uploadResult.data) {
                imageUrl = uploadResult.data
            } else {
                alert(uploadResult.error || 'Gagal upload gambar')
                return
            }
        }

        const result = await createProduct({
            name: data.name,
            price: data.price,
            stock: data.stock,
            image_url: imageUrl
        })

        if (result.success) {
            alert('Hadiah berhasil ditambahkan!')
            setShowAddForm(false)
            loadProducts()
        } else {
            alert(result.error || 'Gagal menambah hadiah')
        }
    }

    const handleEdit = async (data: { name: string; price: number; stock: number; image?: File }) => {
        if (!selectedProduct) return

        let imageUrl: string | undefined = undefined

        // Upload new image if provided
        if (data.image) {
            const formData = new FormData()
            formData.append('file', data.image)
            const uploadResult = await uploadProfilePicture(formData)

            if (uploadResult.success && uploadResult.data) {
                imageUrl = uploadResult.data
            } else {
                alert(uploadResult.error || 'Gagal upload gambar')
                return
            }
        }

        const result = await updateProduct(selectedProduct.id, {
            name: data.name,
            price: data.price,
            stock: data.stock,
            ...(imageUrl && { image_url: imageUrl })
        })

        if (result.success) {
            alert('Hadiah berhasil diubah!')
            setShowEditForm(false)
            setSelectedProduct(null)
            loadProducts()
        } else {
            alert(result.error || 'Gagal mengubah hadiah')
        }
    }

    const handleDelete = async () => {
        if (!selectedProduct) return

        const result = await deleteProduct(selectedProduct.id)
        if (result.success) {
            alert('Hadiah berhasil dihapus!')
            setShowDeleteConfirm(false)
            setSelectedProduct(null)
            loadProducts()
        } else {
            alert(result.error || 'Gagal menghapus hadiah')
        }
    }

    const textColor = isDarkMode ? '#ea580c' : '#E57526'

    return (
        <DashboardLayout role="Admin" menuItems={adminMenuItems}>
            <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: textColor }}
                    >
                        Hadiah
                    </h1>

                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push('/admin/hadiah/validasi')}
                            className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
                            style={{ backgroundColor: textColor }}
                        >
                            Validasi Tukar Poin
                        </button>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
                            style={{ backgroundColor: textColor }}
                        >
                            Tambah Hadiah
                        </button>
                    </div>
                </div>

                {/* Search & Filter - Styled like Pengguna page */}
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

                {/* Grid Display */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Tidak ada hadiah ditemukan
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {products.map((product) => (
                            <RewardCard
                                key={product.id}
                                reward={product}
                                onEdit={(p) => {
                                    setSelectedProduct(p)
                                    setShowEditForm(true)
                                }}
                                onDelete={(p) => {
                                    setSelectedProduct(p)
                                    setShowDeleteConfirm(true)
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Add Form Modal */}
            <Modal
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}
                size="md"
                showCloseButton={false}
            >
                <div className="p-6 md:p-8">
                    <RewardForm
                        mode="add"
                        onSubmit={handleAdd}
                        onCancel={() => setShowAddForm(false)}
                    />
                </div>
            </Modal>

            {/* Edit Form Modal */}
            <Modal
                isOpen={showEditForm && !!selectedProduct}
                onClose={() => {
                    setShowEditForm(false)
                    setSelectedProduct(null)
                }}
                size="md"
                showCloseButton={false}
            >
                {selectedProduct && (
                    <div className="p-6 md:p-8">
                        <RewardForm
                            mode="edit"
                            initialData={selectedProduct}
                            onSubmit={handleEdit}
                            onCancel={() => {
                                setShowEditForm(false)
                                setSelectedProduct(null)
                            }}
                        />
                    </div>
                )}
            </Modal>

            {/* Filter Modal */}
            {showFilter && (
                <FilterForm
                    onApply={handleApplyFilter}
                    onReset={handleResetFilter}
                    onClose={() => setShowFilter(false)}
                />
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteConfirm && !!selectedProduct}
                onClose={() => {
                    setShowDeleteConfirm(false)
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
                            Hapus Hadiah?
                        </h2>
                        <p className="mb-6" style={{ color: textColor }}>
                            Apakah Anda yakin ingin menghapus hadiah "<strong>{selectedProduct.name}</strong>"?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false)
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
                                onClick={handleDelete}
                                className="flex-1 px-6 py-3 rounded-xl font-bold text-white hover:opacity-80"
                                style={{ backgroundColor: '#dc2626' }}
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    )
}
