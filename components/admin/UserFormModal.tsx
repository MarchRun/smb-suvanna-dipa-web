/**
 * User Form Modal Component
 * Popup form for Create/Edit user
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { uploadProfilePicture } from '@/actions/profile/uploadPicture'
import FileUpload from '@/components/shared/FileUpload'
import Select from '@/components/shared/Select'
import Textarea from '@/components/shared/Textarea'
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
    profile_picture: string
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
        class_id: null,
        profile_picture: ''
    })

    const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({})
    const [showPassword, setShowPassword] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [uploadingPicture, setUploadingPicture] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

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
                class_id: initialData?.class_id || null,
                profile_picture: initialData?.profile_picture || ''
            })
            setErrors({})
            setSelectedFile(null)
            setPreviewUrl(initialData?.profile_picture || null)
            setUploadingPicture(false)
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

    const handleFileSelect = (file: File | null) => {
        setSelectedFile(file)

        if (file) {
            // Create preview URL
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        } else {
            setPreviewUrl(initialData?.profile_picture || null)
        }
    }

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
            // Upload file if selected
            if (selectedFile) {
                setUploadingPicture(true)

                // Create FormData for upload
                const fileFormData = new FormData()
                fileFormData.append('file', selectedFile)

                const uploadResult = await uploadProfilePicture(fileFormData)
                setUploadingPicture(false)

                if (uploadResult.success && uploadResult.data) {
                    // Update formData with uploaded URL (data is the publicUrl string)
                    formData.profile_picture = uploadResult.data
                } else {
                    alert(uploadResult.error || 'Gagal mengupload foto profil')
                    return
                }
            }

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
            <div className="relative bg-white dark:bg-gray-800 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden rounded-2xl">
                <div className="p-6 max-h-[90vh] overflow-y-auto">
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
                            <Select
                                label="Jenis Kelamin"
                                value={formData.gender}
                                onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                                options={[
                                    { value: '', label: 'Pilih jenis kelamin' },
                                    { value: 'Laki-laki', label: 'Laki-laki' },
                                    { value: 'Perempuan', label: 'Perempuan' }
                                ]}
                            />

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
                            <Select
                                label="Kelas"
                                value={formData.class_id ?? ''}
                                onChange={(value) => setFormData(prev => ({
                                    ...prev,
                                    class_id: value ? Number(value) : null
                                }))}
                                options={[
                                    { value: '', label: 'Pilih kelas' },
                                    ...classes.map(c => ({ value: c.id, label: c.name }))
                                ]}
                            />

                            {/* Peran */}
                            <Select
                                label="Peran"
                                value={formData.role}
                                onChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
                                options={[
                                    { value: 'siswa', label: 'Siswa' },
                                    { value: 'pembina', label: 'Pembina' }
                                ]}
                                required
                            />
                        </div>

                        {/* Foto Profil */}
                        <FileUpload
                            label="Foto Profil"
                            onFileSelect={handleFileSelect}
                            previewUrl={previewUrl}
                            accept="image/jpeg,image/png"
                            maxSize={1 * 1024 * 1024}
                            helperText="Format: JPEG, PNG. Maksimal 1MB."
                        />

                        {/* Alamat Rumah */}
                        <Textarea
                            label="Alamat Rumah"
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Masukkan alamat lengkap"
                            rows={3}
                        />

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
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        className={inputClass}
                                        placeholder={mode === 'create' ? 'Masukkan password' : 'Kosongkan jika tidak diubah'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
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
                                disabled={isLoading || uploadingPicture}
                                className="flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50"
                                style={{ backgroundColor: 'var(--primary-900)' }}
                            >
                                {uploadingPicture ? 'Mengupload Foto...' : isLoading ? 'Menyimpan...' : (mode === 'create' ? 'Tambah' : 'Konfirmasi Perubahan')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
