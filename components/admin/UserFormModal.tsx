/**
 * User Form Modal Component - REFACTORED with DynamicForm
 * Popup form for Create/Edit user
 * Now uses universal DynamicForm component
 */

'use client'

import { useState, useEffect } from 'react'
import { uploadProfilePicture } from '@/actions/profile/uploadPicture'
import DynamicForm from '@/components/shared/DynamicForm'
import FileUpload from '@/components/shared/FileUpload'
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [uploadingPicture, setUploadingPicture] = useState(false)
    const [profilePictureUrl, setProfilePictureUrl] = useState(initialData?.profile_picture || '')

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedFile(null)
            setPreviewUrl(null)
            setProfilePictureUrl(initialData?.profile_picture || '')
        }
    }, [isOpen, initialData])

    // Handle file selection
    const handleFileSelect = (file: File | null) => {
        if (!file) return
        setSelectedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
    }

    // Handle picture upload
    const handleUploadPicture = async () => {
        if (!selectedFile) return

        setUploadingPicture(true)
        try {
            const formDataUpload = new FormData()
            formDataUpload.append('file', selectedFile)
            const result = await uploadProfilePicture(formDataUpload)

            if (result.success && result.data) {
                setProfilePictureUrl(result.data)
                setSelectedFile(null)
                setPreviewUrl(null)
            }
        } catch (err) {
            console.error('Error uploading picture:', err)
        } finally {
            setUploadingPicture(false)
        }
    }

    // Handle form submit
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

    if (!isOpen) return null

    // Prepare initial data for form
    const formInitialData = {
        full_name: initialData?.full_name || '',
        email: initialData?.email || '',
        password: '',
        phone: initialData?.phone || '',
        gender: initialData?.gender || '',
        birth_date: initialData?.birth_date || '',
        address: initialData?.address || '',
        role: initialData?.role || 'siswa',
        class_id: initialData?.class_id || ''
    }

    // Get form fields config
    const formFields = getUserFormFields(classes)

    // If edit mode, make password optional and email disabled
    const adjustedFields = formFields.map(field => {
        if (mode === 'edit') {
            if (field.name === 'password') {
                return { ...field, required: false, helperText: 'Kosongkan jika tidak ingin mengubah password' }
            }
            if (field.name === 'email') {
                return { ...field, disabled: true, helperText: 'Email tidak dapat diubah' }
            }
        }
        return field
    })

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="overflow-y-auto max-h-[90vh] p-6 md:p-8">
                        {/* Title */}
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-orange-600 dark:text-orange-500">
                            {mode === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}
                        </h2>

                        {/* File Upload */}
                        <div className="mb-6">
                            <FileUpload
                                label="Foto Profil"
                                onFileSelect={handleFileSelect}
                                previewUrl={previewUrl || profilePictureUrl}
                                accept="image/jpeg,image/png"
                                maxSize={1 * 1024 * 1024}
                                helperText="Format: JPEG, PNG. Maksimal 1MB."
                            />
                            {selectedFile && (
                                <button
                                    type="button"
                                    onClick={handleUploadPicture}
                                    disabled={uploadingPicture}
                                    className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                                >
                                    {uploadingPicture ? 'Uploading...' : 'Upload Foto'}
                                </button>
                            )}
                        </div>

                        {/* Dynamic Form */}
                        <DynamicForm
                            fields={adjustedFields}
                            initialData={formInitialData}
                            onSubmit={handleSubmit}
                            submitLabel={mode === 'create' ? 'Tambah' : 'Konfirmasi Perubahan'}
                            cancelLabel="Batal"
                            onCancel={onClose}
                            isLoading={isLoading || uploadingPicture}
                            columns={2}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
