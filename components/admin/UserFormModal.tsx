/**
 * User Form Modal - Using UniversalForm + Animated Modal
 * Clean, simple wrapper with smooth animations
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { uploadProfilePicture, deleteOldProfilePicture } from '@/actions/profile/uploadPicture'
import UniversalForm from '@/components/shared/forms/UniversalForm'
import { Modal } from '@/components/shared/ui/Modals'
import { getUserFormFields } from '@/lib/forms/fieldConfigs'
import type { Class, UserRole } from '@/types'

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
    const [profilePictureUrl, setProfilePictureUrl] = useState(initialData?.profile_picture || '')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [uploadingPicture, setUploadingPicture] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen) {
            setProfilePictureUrl(initialData?.profile_picture || '')
            setSelectedFile(null)
            setPreviewUrl(null)
            setUploadError('')
        }
    }, [isOpen, initialData])

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
        if (!validTypes.includes(file.type)) {
            setUploadError('Format tidak valid. Gunakan JPEG atau PNG.')
            return
        }

        // Validate file size (max 1MB)
        if (file.size > 1 * 1024 * 1024) {
            setUploadError('Ukuran file terlalu besar. Maksimal 1MB.')
            return
        }

        setSelectedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
        setUploadError('')
    }

    // Handle picture upload
    const handleUploadPicture = async () => {
        if (!selectedFile) return

        setUploadingPicture(true)
        setUploadError('')

        try {
            // Delete old picture if exists
            if (initialData?.profile_picture) {
                await deleteOldProfilePicture(initialData.profile_picture)
            }

            // Upload new picture
            const formDataUpload = new FormData()
            formDataUpload.append('file', selectedFile)
            const result = await uploadProfilePicture(formDataUpload)

            if (!result.success) {
                setUploadError(result.error || 'Gagal upload foto')
                setUploadingPicture(false)
                return
            }

            setProfilePictureUrl(result.data || '')
            setSelectedFile(null)
            setPreviewUrl(null)
        } catch (err) {
            setUploadError('Gagal upload foto profil')
        } finally {
            setUploadingPicture(false)
        }
    }

    const handleSubmit = async (data: Record<string, any>) => {
        const userData: UserFormData = {
            full_name: data.full_name,
            email: data.email,
            password: data.password || '',
            phone: data.phone,
            gender: data.gender,
            birth_date: data.birth_date,
            address: data.address,
            role: data.role as UserRole,
            class_id: data.class_id ? Number(data.class_id) : null,
            profile_picture: profilePictureUrl
        }

        await onSubmit(userData)
    }

    const formInitialData = {
        full_name: initialData?.full_name || '',
        email: initialData?.email || '',
        password: '',
        phone: initialData?.phone || '',
        gender: initialData?.gender || '',
        birth_date: initialData?.birth_date || '',
        address: initialData?.address || '',
        role: initialData?.role || '',
        class_id: initialData?.class_id || ''
    }

    let formFields = getUserFormFields(classes)

    // Remove file field from form fields (we handle it separately)
    formFields = formFields.filter(field => field.name !== 'profile_picture')

    // Adjust for edit mode
    if (mode === 'edit') {
        formFields = formFields.map(field => {
            if (field.name === 'password') {
                return { ...field, required: false, helperText: '(kosongkan jika tidak diubah)' }
            }
            return field
        })
    }

    const textColor = '#E57526'

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            showCloseButton={false}
        >
            <div className="p-6 md:p-8">
                {/* Title */}
                <h2
                    className="text-2xl md:text-3xl font-bold mb-6"
                    style={{ color: textColor }}
                >
                    {mode === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}
                </h2>

                {/* Profile Picture Upload Section */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2" style={{ color: textColor }}>
                        Foto Profil
                    </label>
                    <div className="flex">
                        <div
                            className="flex-1 px-4 py-3 rounded-l-full border-2 border-r-0 bg-white dark:bg-gray-700 flex items-center cursor-pointer"
                            style={{ borderColor: '#E57526' }}
                            onClick={() => !isLoading && !uploadingPicture && fileInputRef.current?.click()}
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
                            disabled={isLoading || uploadingPicture}
                        />
                        <button
                            type="button"
                            onClick={selectedFile ? handleUploadPicture : () => fileInputRef.current?.click()}
                            className="px-6 py-3 rounded-r-full font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: '#E57526' }}
                            disabled={isLoading || uploadingPicture}
                        >
                            {uploadingPicture ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    {uploadError && (
                        <p className="text-xs text-red-500 mt-2">{uploadError}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Format: JPEG, PNG. Maksimal 1MB.
                    </p>
                </div>

                {/* Universal Form for other fields */}
                <UniversalForm
                    title=""
                    mode={mode}
                    fields={formFields}
                    initialData={formInitialData}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                    isLoading={isLoading || uploadingPicture}
                />
            </div>
        </Modal>
    )
}

