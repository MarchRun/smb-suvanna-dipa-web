/**
 * User Form Modal Component
 * Popup form for Create/Edit user
 */

'use client'

import { useState, useEffect } from 'react'
import type { Profile, Class, UserRole } from '@/types'

export interface UserFormData {
    full_name: string
    email: string
    password: string
    phone: string
    gender: string
    birth_date: string
    address: string
    role: UserRole
    class_id: number | null
}

interface UserFormModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: Partial<UserFormData>
    classes: Class[]
    mode: 'create' | 'edit'
    onSubmit: (data: UserFormData) => Promise<void>
    isLoading?: boolean
}

export default function UserFormModal({
    isOpen,
    onClose,
    initialData,
    classes,
    mode,
    onSubmit,
    isLoading = false
}: UserFormModalProps) {
    const [formData, setFormData] = useState<UserFormData>({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        gender: '',
        birth_date: '',
        address: '',
        role: 'siswa',
        class_id: null
    })

    const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({})

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                full_name: initialData?.full_name || '',
                email: initialData?.email || '',
                password: '',
                phone: initialData?.phone || '',
                gender: initialData?.gender || '',
                birth_date: initialData?.birth_date || '',
                address: initialData?.address || '',
                role: initialData?.role || 'siswa',
                class_id: initialData?.class_id || null
            })
            setErrors({})
        }
    }, [isOpen, initialData])

    // Prevent body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof UserFormData, string>> = {}

        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Nama lengkap wajib diisi'
        }

        if (mode === 'create') {
            if (!formData.email.trim()) {
                newErrors.email = 'Email wajib diisi'
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Format email tidak valid'
            }

            if (!formData.password) {
                newErrors.password = 'Password wajib diisi'
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password minimal 6 karakter'
            }
        }

        if (mode === 'edit' && formData.password && formData.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validate()) {
            await onSubmit(formData)
        }
    }

    if (!isOpen) return null

    const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
    const labelClass = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
    const errorClass = "text-red-500 text-xs mt-1"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {mode === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Nama Lengkap */}
                            <div>
                                <label className={labelClass}>Nama Lengkap *</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                    className={inputClass}
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.full_name && <p className={errorClass}>{errors.full_name}</p>}
                            </div>

                            {/* Nomor Telepon */}
                            <div>
                                <label className={labelClass}>Nomor Telepon</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className={inputClass}
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>

                            {/* Jenis Kelamin */}
                            <div>
                                <label className={labelClass}>Jenis Kelamin</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                                    className={inputClass}
                                >
                                    <option value="">Pilih jenis kelamin</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>

                            {/* Tanggal Lahir */}
                            <div>
                                <label className={labelClass}>Tanggal Lahir</label>
                                <input
                                    type="date"
                                    value={formData.birth_date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                                    className={inputClass}
                                />
                            </div>

                            {/* Kelas */}
                            <div>
                                <label className={labelClass}>Kelas</label>
                                <select
                                    value={formData.class_id ?? ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        class_id: e.target.value ? Number(e.target.value) : null
                                    }))}
                                    className={inputClass}
                                >
                                    <option value="">Pilih kelas</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Peran */}
                            <div>
                                <label className={labelClass}>Peran *</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                                    className={inputClass}
                                >
                                    <option value="siswa">Siswa</option>
                                    <option value="pembina">Pembina</option>
                                </select>
                            </div>
                        </div>

                        {/* Alamat Rumah */}
                        <div>
                            <label className={labelClass}>Alamat Rumah</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                className={`${inputClass} min-h-[80px] resize-none`}
                                placeholder="Masukkan alamat lengkap"
                            />
                        </div>

                        {/* Email & Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>
                                    Email {mode === 'create' && '*'}
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className={inputClass}
                                    placeholder="email@example.com"
                                    disabled={mode === 'edit'}
                                />
                                {errors.email && <p className={errorClass}>{errors.email}</p>}
                                {mode === 'edit' && (
                                    <p className="text-gray-500 text-xs mt-1">Email tidak dapat diubah</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Password {mode === 'create' ? '*' : ''}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className={inputClass}
                                    placeholder={mode === 'create' ? 'Masukkan password' : 'Kosongkan jika tidak diubah'}
                                />
                                {errors.password && <p className={errorClass}>{errors.password}</p>}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600
                                         text-gray-600 dark:text-gray-300 font-bold
                                         hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200
                                         disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50"
                                style={{ backgroundColor: 'var(--primary-900)' }}
                            >
                                {isLoading ? 'Menyimpan...' : (mode === 'create' ? 'Tambah' : 'Konfirmasi Perubahan')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
