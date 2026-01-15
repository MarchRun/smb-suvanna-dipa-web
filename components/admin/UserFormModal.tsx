/**
 * User Form Modal - Using UniversalForm + Animated Modal
 * Clean, simple wrapper with smooth animations
 */

'use client'

import { useState, useEffect } from 'react'
import { uploadProfilePicture } from '@/actions/profile/uploadPicture'
import UniversalForm from '@/components/shared/UniversalForm'
import Modal from '@/components/shared/Modal'
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

    useEffect(() => {
        if (isOpen) {
            setProfilePictureUrl(initialData?.profile_picture || '')
        }
    }, [isOpen, initialData])

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
        role: initialData?.role || 'siswa',
        class_id: initialData?.class_id || ''
    }

    let formFields = getUserFormFields(classes)

    // Adjust for edit mode
    if (mode === 'edit') {
        formFields = formFields.map(field => {
            if (field.name === 'password') {
                return { ...field, required: false, helperText: '(kosongkan jika tidak diubah)' }
            }
            if (field.name === 'email') {
                return { ...field, disabled: true, helperText: 'Email tidak dapat diubah' }
            }
            return field
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            showCloseButton={false}
        >
            <UniversalForm
                title={mode === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}
                mode={mode}
                fields={formFields}
                initialData={formInitialData}
                onSubmit={handleSubmit}
                onCancel={onClose}
                isLoading={isLoading}
            />
        </Modal>
    )
}
