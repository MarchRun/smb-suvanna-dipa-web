/**
 * Profile Edit Modal - Using UniversalForm
 * Migrated to use universal form component with consistent styling
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { updateProfile, type ProfileUpdateData } from '@/actions/profile/update'
import { uploadProfilePicture, deleteOldProfilePicture } from '@/actions/profile/uploadPicture'
import UniversalForm, { FieldConfig } from '@/components/shared/forms/UniversalForm'
import { Modal } from '@/components/shared/ui/Modals'

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
    const [loading, setLoading] = useState(false)
    const [uploadingPicture, setUploadingPicture] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [profilePictureUrl, setProfilePictureUrl] = useState(currentData.profile_picture || '')
    const [error, setError] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setProfilePictureUrl(currentData.profile_picture || '')
            setSelectedFile(null)
            setPreviewUrl(null)
            setError('')
        }
    }, [isOpen, currentData])

    // Profile form fields
    const profileFields: FieldConfig[] = [
        {
            name: 'full_name',
            type: 'text',
            label: 'Nama Lengkap',
            placeholder: 'Masukkan nama lengkap',
            required: true
        },
        {
            name: 'phone',
            type: 'tel',
            label: 'Nomor Telepon',
            placeholder: 'Contoh: 081234567890',
            required: true
        },
        {
            name: 'gender',
            type: 'select',
            label: 'Jenis Kelamin',
            required: true,
            options: [
                { value: '', label: 'Pilih...' },
                { value: 'Laki-laki', label: 'Laki-laki' },
                { value: 'Perempuan', label: 'Perempuan' }
            ]
        },
        {
            name: 'birth_date',
            type: 'date',
            label: 'Tanggal Lahir',
            required: true
        },
        {
            name: 'address',
            type: 'textarea',
            label: 'Alamat Rumah',
            placeholder: 'Masukkan alamat lengkap',
            required: true,
            rows: 4,
            columnSpan: 2
        }
    ]

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
        if (!validTypes.includes(file.type)) {
            setError('Format tidak valid. Gunakan JPEG atau PNG.')
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

            setProfilePictureUrl(result.data || '')
            setSelectedFile(null)
            setPreviewUrl(null)
        } catch (err) {
            setError('Gagal upload foto profil')
        } finally {
            setUploadingPicture(false)
        }
    }

    // Handle form submit
    const handleSubmit = async (data: Record<string, any>) => {
        setLoading(true)
        setError('')

        try {
            const profileData: ProfileUpdateData = {
                full_name: data.full_name,
                phone: data.phone,
                gender: data.gender as 'Laki-laki' | 'Perempuan',
                birth_date: data.birth_date,
                address: data.address,
                profile_picture: profilePictureUrl
            }

            const result = await updateProfile(profileData)

            if (!result.success) {
                setError(result.error || 'Gagal mengupdate profil')
                setLoading(false)
                return
            }

            setLoading(false)
            onSuccess()
            onClose()
        } catch (err) {
            setError('Terjadi kesalahan')
            setLoading(false)
        }
    }

    const handleClose = () => {
        if (!loading && !uploadingPicture) {
            onClose()
        }
    }

    const initialData = {
        full_name: currentData.full_name || '',
        phone: currentData.phone || '',
        gender: currentData.gender || '',
        birth_date: currentData.birth_date || '',
        address: currentData.address || ''
    }

    const textColor = '#E57526'

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="md"
            showCloseButton={false}
        >
            <div className="p-6 md:p-8">
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

                {/* Profile Picture Upload Section */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2" style={{ color: textColor }}>
                        Foto Profil
                    </label>
                    <div className="flex">
                        <div
                            className="flex-1 px-4 py-3 rounded-l-full border-2 border-r-0 border-orange-800 dark:border-orange-600 bg-white dark:bg-gray-700 flex items-center cursor-pointer"
                            onClick={() => !loading && !uploadingPicture && fileInputRef.current?.click()}
                        >
                            <span className="text-gray-500 dark:text-gray-400 truncate">
                                {selectedFile
                                    ? selectedFile.name
                                    : profilePictureUrl
                                        ? 'Foto sudah diupload'
                                        : 'Pilih file...'}
                            </span>
                            {(previewUrl || profilePictureUrl) && (
                                <img
                                    src={previewUrl || profilePictureUrl}
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
                            className="px-6 py-3 rounded-r-full font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: '#E57526' }}
                            disabled={loading || uploadingPicture}
                        >
                            {uploadingPicture ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Format: JPEG, PNG. Maksimal 1MB.
                    </p>
                </div>

                {/* Universal Form for other fields */}
                <UniversalForm
                    title=""
                    mode="edit"
                    fields={profileFields}
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                    submitLabel="Konfirmasi Perubahan"
                    cancelLabel="Batal"
                    isLoading={loading || uploadingPicture}
                />
            </div>
        </Modal>
    )
}
