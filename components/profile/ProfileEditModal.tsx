/**
 * Profile Edit Modal Component
 * Reusable modal for editing profile across all dashboard roles
 * Features: animations, consistent styling, file upload with validation
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { updateProfile, type ProfileUpdateData } from '@/actions/profile/update'
import { uploadProfilePicture, deleteOldProfilePicture } from '@/actions/profile/uploadPicture'

interface ProfileEditModalProps {
    isOpen: boolean
    onClose: () => void
    currentData: {
        full_name: string | null
        phone: string | null
        gender: string | null
        birth_date: string | null
        address: string | null
        profile_picture: string | null
    }
    onSuccess: () => void
}

export default function ProfileEditModal({ isOpen, onClose, currentData, onSuccess }: ProfileEditModalProps) {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [uploadingPicture, setUploadingPicture] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState<ProfileUpdateData>({
        full_name: currentData.full_name || '',
        phone: currentData.phone || '',
        gender: (currentData.gender as 'Laki-laki' | 'Perempuan') || undefined,
        birth_date: currentData.birth_date || '',
        address: currentData.address || '',
        profile_picture: currentData.profile_picture || ''
    })

    // Dark mode detection
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
        checkDarkMode()
        const observer = new MutationObserver(checkDarkMode)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })
        return () => observer.disconnect()
    }, [])

    // Handle open/close animations
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            // Small delay to trigger animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true)
                })
            })
        } else {
            setIsAnimating(false)
            // Wait for animation to complete before hiding
            const timer = setTimeout(() => {
                setIsVisible(false)
            }, 200)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    // Reset form when modal opens - pre-fill with current data
    useEffect(() => {
        if (isOpen) {
            setFormData({
                full_name: currentData.full_name || '',
                phone: currentData.phone || '',
                gender: (currentData.gender as 'Laki-laki' | 'Perempuan') || undefined,
                birth_date: currentData.birth_date || '',
                address: currentData.address || '',
                profile_picture: currentData.profile_picture || ''
            })
            setError('')
            setSelectedFile(null)
            setPreviewUrl(null)
        }
    }, [isOpen, currentData])

    // Handle file selection for profile picture
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type - only jpg, jpeg, png (no webp)
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
        if (!validTypes.includes(file.type)) {
            setError('Format file tidak valid. Gunakan JPEG atau PNG.')
            return
        }

        // Validate file size (max 1MB)
        if (file.size > 1 * 1024 * 1024) {
            setError('Ukuran file terlalu besar. Maksimal 1MB.')
            return
        }

        setSelectedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
        setError('')
    }

    // Handle picture upload
    const handleUploadPicture = async () => {
        if (!selectedFile) return

        setUploadingPicture(true)
        setError('')

        try {
            // Delete old picture if exists
            if (currentData.profile_picture) {
                await deleteOldProfilePicture(currentData.profile_picture)
            }

            // Upload new picture
            const formDataUpload = new FormData()
            formDataUpload.append('file', selectedFile)
            const result = await uploadProfilePicture(formDataUpload)

            if (!result.success) {
                setError(result.error || 'Gagal upload foto')
                setUploadingPicture(false)
                return
            }

            // Update form data with new picture URL
            setFormData(prev => ({ ...prev, profile_picture: result.data }))
            setSelectedFile(null)
            setPreviewUrl(null)
            setUploadingPicture(false)
        } catch (err) {
            setError('Gagal upload foto profil')
            setUploadingPicture(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await updateProfile(formData)

            if (!result.success) {
                setError(result.error || 'Gagal mengupdate profil')
                setLoading(false)
                return
            }

            // Success
            setLoading(false)
            onSuccess()
            onClose()
        } catch (err) {
            setError('Terjadi kesalahan yang tidak terduga')
            setLoading(false)
        }
    }

    const handleClose = () => {
        if (!loading && !uploadingPicture) {
            onClose()
        }
    }

    if (!isVisible) return null

    const textColor = isDarkMode ? '#ea580c' : '#7c2d12'

    // Common input styles matching wireframe
    const inputStyle = `w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-800
        focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200
        disabled:opacity-50 disabled:cursor-not-allowed 
        dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-orange-500`

    return (
        <>
            {/* Backdrop with animation */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-200 ${isAnimating ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={handleClose}
            />

            {/* Modal with animation */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transition-all duration-200 ${isAnimating
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-4'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Scrollable content inside */}
                    <div className="max-h-[90vh] overflow-y-auto p-6 md:p-8">
                        {/* Title */}
                        <h2
                            className="text-2xl md:text-3xl font-bold mb-6"
                            style={{ color: textColor }}
                        >
                            Edit Profil
                        </h2>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-4 bg-red-100 border-2 border-red-500 rounded-lg text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Row 1: Nama & Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: textColor }}>
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        className={inputStyle}
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        disabled={loading}
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: textColor }}>
                                        Nomor Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        className={inputStyle}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={loading}
                                        placeholder="Contoh: 081234567890"
                                    />
                                </div>
                            </div>

                            {/* Row 2: Gender & Birth Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: textColor }}>
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        className={inputStyle}
                                        value={formData.gender || ''}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Laki-laki' | 'Perempuan' })}
                                        disabled={loading}
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: textColor }}>
                                        Tanggal Lahir
                                    </label>
                                    <input
                                        type="date"
                                        className={inputStyle}
                                        value={formData.birth_date || ''}
                                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Row 3: Profile Picture Upload - Connected input + button */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: textColor }}>
                                    Foto Profil
                                </label>
                                <div className="flex">
                                    {/* File display area - connected to button */}
                                    <div
                                        className={`flex-1 px-4 py-3 rounded-l-lg border-2 border-r-0 border-gray-300 bg-white
                                            flex items-center cursor-pointer
                                            dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                                        onClick={() => !loading && !uploadingPicture && fileInputRef.current?.click()}
                                    >
                                        <span className="text-gray-500 dark:text-gray-400 truncate">
                                            {selectedFile
                                                ? selectedFile.name
                                                : formData.profile_picture
                                                    ? 'Foto sudah diupload'
                                                    : 'Pilih file...'}
                                        </span>
                                        {(previewUrl || formData.profile_picture) && (
                                            <img
                                                src={previewUrl || formData.profile_picture || ''}
                                                alt="Preview"
                                                className="w-8 h-8 rounded-full object-cover ml-auto"
                                            />
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        disabled={loading || uploadingPicture}
                                    />
                                    <button
                                        type="button"
                                        onClick={selectedFile ? handleUploadPicture : () => fileInputRef.current?.click()}
                                        className="px-6 py-3 rounded-r-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                                        style={{ backgroundColor: '#6b7280' }}
                                        disabled={loading || uploadingPicture}
                                    >
                                        {uploadingPicture ? 'Uploading...' : 'Upload'}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Format: JPEG, PNG. Maksimal 2MB.
                                </p>
                            </div>

                            {/* Row 4: Address */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: textColor }}>
                                    Alamat Rumah
                                </label>
                                <textarea
                                    className={`${inputStyle} resize-none`}
                                    rows={4}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    disabled={loading}
                                    placeholder="Masukkan alamat lengkap"
                                />
                            </div>

                            {/* Buttons - Wireframe style */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 py-3 rounded-lg font-bold text-gray-700 bg-yellow-400 hover:bg-yellow-500 transition-all disabled:opacity-50"
                                    disabled={loading || uploadingPicture}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                                    style={{ backgroundColor: '#6b7280' }}
                                    disabled={loading || uploadingPicture}
                                >
                                    {loading ? 'Menyimpan...' : 'Konfirmasi Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
