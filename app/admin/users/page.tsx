/**
 * Admin - Daftar Pengguna Page
 * Lists all users (siswa & pembina) with search, filter popup, modal forms
 * Styled to match wireframe
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/shared/layout/Dashboard'
import UsersTable from '@/components/shared/specialized/UsersTable'
import { FilterModal, type FilterValues, ConfirmDialog } from '@/components/shared/ui/Modals'
import ExportFilterModal from '@/components/shared/specialized/ExportFilterModal'
import UserFormModal, { type UserFormData } from '@/components/admin/UserFormModal'
import { getUsers, getUserById, createUser, updateUser, deleteUser, type UserFilters, type UserSort } from '@/actions/admin/users'
import type { Profile, Class } from '@/types'

// Menu items for Admin
const adminMenuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pengguna', href: '/admin/users' },
    { label: 'Hadiah', href: '/admin/rewards' },
    { label: 'Konten Publik', href: '/admin/content' },
    { label: 'Profil', href: '/admin/profile' },
]

export default function PenggunaPage() {
    const router = useRouter()
    const [users, setUsers] = useState<Profile[]>([])
    const [classes, setClasses] = useState<Class[]>([])
    const [loading, setLoading] = useState(true)

    // Search and filter states
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<FilterValues>({ role: null, classId: null, gender: null })
    const [sort, setSort] = useState<UserSort>({ column: 'full_name', direction: 'asc' })

    // Modal states
    const [filterModalOpen, setFilterModalOpen] = useState(false)
    const [exportModalOpen, setExportModalOpen] = useState(false)
    const [formModalOpen, setFormModalOpen] = useState(false)
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
    const [editingUser, setEditingUser] = useState<Profile | null>(null)
    const [formLoading, setFormLoading] = useState(false)

    // Delete dialog state
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean
        user: Profile | null
        isLoading: boolean
    }>({
        isOpen: false,
        user: null,
        isLoading: false
    })

    // Fetch classes for filter
    useEffect(() => {
        async function fetchClasses() {
            try {
                const response = await fetch('/api/classes')
                if (response.ok) {
                    const data = await response.json()
                    setClasses(data)
                }
            } catch (error) {
                console.error('Error fetching classes:', error)
            }
        }
        fetchClasses()
    }, [])

    // Fetch users
    const fetchUsers = useCallback(async () => {
        setLoading(true)
        const userFilters: UserFilters = {
            search: search || undefined,
            role: (filters.role as UserFilters['role']) || 'all',
            classId: filters.classId,
            gender: filters.gender
        }

        const result = await getUsers(userFilters, sort)
        if (result.success && result.data) {
            setUsers(result.data)
        }
        setLoading(false)
    }, [search, filters, sort])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    // Handlers
    const handleView = (user: Profile) => {
        router.push(`/admin/users/${user.id}`)
    }

    const handleEditClick = async (user: Profile) => {
        // Fetch full user data
        const result = await getUserById(user.id)
        if (result.success && result.data) {
            setEditingUser(result.data)
            setFormMode('edit')
            setFormModalOpen(true)
        }
    }

    const handleAddClick = () => {
        setEditingUser(null)
        setFormMode('create')
        setFormModalOpen(true)
    }

    const handleFormSubmit = async (data: UserFormData) => {
        setFormLoading(true)

        if (formMode === 'create') {
            const result = await createUser({
                email: data.email,
                password: data.password,
                full_name: data.full_name,
                phone: data.phone || undefined,
                gender: data.gender || undefined,
                birth_date: data.birth_date || undefined,
                address: data.address || undefined,
                role: data.role,
                class_id: data.class_id,
                profile_picture: data.profile_picture || undefined
            })

            if (result.success) {
                setFormModalOpen(false)
                fetchUsers()
            } else {
                alert(result.error || 'Gagal menambah pengguna')
            }
        } else if (editingUser) {
            const result = await updateUser(editingUser.id, {
                full_name: data.full_name,
                phone: data.phone || undefined,
                gender: data.gender || undefined,
                birth_date: data.birth_date || undefined,
                address: data.address || undefined,
                role: data.role,
                class_id: data.class_id,
                password: data.password || undefined,
                profile_picture: data.profile_picture || undefined
            })

            if (result.success) {
                setFormModalOpen(false)
                fetchUsers()
            } else {
                alert(result.error || 'Gagal mengubah pengguna')
            }
        }

        setFormLoading(false)
    }

    const handleDeleteClick = (user: Profile) => {
        setDeleteDialog({ isOpen: true, user, isLoading: false })
    }

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.user) return

        setDeleteDialog(prev => ({ ...prev, isLoading: true }))
        const result = await deleteUser(deleteDialog.user.id)

        if (result.success) {
            fetchUsers()
        } else {
            alert(result.error || 'Gagal menghapus pengguna')
        }

        setDeleteDialog({ isOpen: false, user: null, isLoading: false })
    }

    const handleFilterApply = (newFilters: FilterValues) => {
        setFilters(newFilters)
    }

    const textColor = 'var(--primary-900)'

    return (
        <DashboardLayout role="Admin" menuItems={adminMenuItems}>
            <div className="p-6 md:p-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: textColor }}
                    >
                        Pengguna
                    </h1>

                    <div className="flex gap-3">
                        {/* Export Excel Button - Same style as Tambah */}
                        <button
                            onClick={() => setExportModalOpen(true)}
                            className="px-5 py-2.5 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
                            style={{ backgroundColor: textColor }}
                        >
                            Unduh Excel
                        </button>

                        {/* Add User Button */}
                        <button
                            onClick={handleAddClick}
                            className="px-5 py-2.5 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
                            style={{ backgroundColor: textColor }}
                        >
                            Tambah Pengguna
                        </button>
                    </div>
                </div>

                {/* Search Bar and Filter Button */}
                <div className="flex gap-4 mb-6">
                    {/* Rounded Search Input */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari Pengguna..."
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

                    {/* Filter Button */}
                    <button
                        onClick={() => setFilterModalOpen(true)}
                        className="px-6 py-3 rounded-full font-bold text-white transition-all duration-200 hover:opacity-90 flex items-center gap-2"
                        style={{ backgroundColor: textColor }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filter
                    </button>
                </div>

                {/* Users Table */}
                <UsersTable
                    data={users}
                    variant="admin"
                    onSort={setSort}
                    currentSort={sort}
                    onView={handleView}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    isLoading={loading}
                />

                {/* Filter Modal */}
                <FilterModal
                    isOpen={filterModalOpen}
                    onClose={() => setFilterModalOpen(false)}
                    onApply={handleFilterApply}
                    classes={classes}
                    initialValues={filters}
                />

                {/* User Form Modal (Add/Edit) */}
                <UserFormModal
                    isOpen={formModalOpen}
                    onClose={() => setFormModalOpen(false)}
                    mode={formMode}
                    initialData={editingUser ? {
                        full_name: editingUser.full_name || '',
                        email: editingUser.email || '',
                        phone: editingUser.phone || '',
                        gender: editingUser.gender || '',
                        birth_date: editingUser.birth_date || '',
                        address: editingUser.address || '',
                        role: editingUser.role || 'siswa',
                        class_id: editingUser.class_id || null,
                        profile_picture: editingUser.profile_picture || ''
                    } : undefined}
                    classes={classes}
                    onSubmit={handleFormSubmit}
                    isLoading={formLoading}
                />

                {/* Delete Confirmation Dialog */}
                <ConfirmDialog
                    isOpen={deleteDialog.isOpen}
                    title="Hapus Pengguna"
                    message={`Apakah Anda yakin ingin menghapus ${deleteDialog.user?.full_name || 'pengguna ini'}? Tindakan ini tidak dapat dibatalkan.`}
                    confirmLabel="Hapus"
                    cancelLabel="Batal"
                    variant="danger"
                    isLoading={deleteDialog.isLoading}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteDialog({ isOpen: false, user: null, isLoading: false })}
                />

                {/* Export Filter Modal */}
                <ExportFilterModal
                    isOpen={exportModalOpen}
                    onClose={() => setExportModalOpen(false)}
                    classes={classes}
                />
            </div>
        </DashboardLayout>
    )
}
