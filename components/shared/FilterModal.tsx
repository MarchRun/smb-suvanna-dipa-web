/**
 * Filter Modal - Using UniversalForm
 * Popup modal for filtering data
 */

'use client'

import { useState, useEffect } from 'react'
import UniversalForm, { FieldConfig } from '@/components/shared/UniversalForm'
import Modal from '@/components/shared/Modal'
import type { Class } from '@/types'

interface FilterModalProps {
    isOpen: boolean
    onClose: () => void
    onApply: (filters: FilterValues) => void
    classes: Class[]
    initialValues?: FilterValues
}

export interface FilterValues {
    role: string | null
    classId: number | null
    gender: string | null
}

export default function FilterModal({
    isOpen,
    onClose,
    onApply,
    classes,
    initialValues
}: FilterModalProps) {
    const [internalValues, setInternalValues] = useState<FilterValues>({
        role: initialValues?.role || null,
        classId: initialValues?.classId || null,
        gender: initialValues?.gender || null
    })

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setInternalValues({
                role: initialValues?.role || null,
                classId: initialValues?.classId || null,
                gender: initialValues?.gender || null
            })
        }
    }, [isOpen, initialValues])

    // Field configuration
    const filterFields: FieldConfig[] = [
        {
            name: 'role',
            type: 'select',
            label: 'Peran',
            required: false,
            options: [
                { value: '', label: 'Semua Peran' },
                { value: 'siswa', label: 'Siswa' },
                { value: 'pembina', label: 'Pembina' }
            ],
            columnSpan: 2
        },
        {
            name: 'classId',
            type: 'select',
            label: 'Kelas',
            required: false,
            options: [
                { value: '', label: 'Semua Kelas' },
                ...classes.map(c => ({ value: c.id, label: c.name }))
            ],
            columnSpan: 2
        },
        {
            name: 'gender',
            type: 'select',
            label: 'Gender',
            required: false,
            options: [
                { value: '', label: 'Semua Gender' },
                { value: 'Laki-laki', label: 'Laki-laki' },
                { value: 'Perempuan', label: 'Perempuan' }
            ],
            columnSpan: 2
        }
    ]

    const handleApply = async (data: Record<string, any>) => {
        onApply({
            role: data.role || null,
            classId: data.classId ? Number(data.classId) : null,
            gender: data.gender || null
        })
        onClose()
    }

    const handleReset = () => {
        onApply({ role: null, classId: null, gender: null })
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={false}
        >
            <div className="p-6">
                <UniversalForm
                    title="Filter Pengguna"
                    mode="create"
                    fields={filterFields}
                    initialData={{
                        role: internalValues.role || '',
                        classId: internalValues.classId || '',
                        gender: internalValues.gender || ''
                    }}
                    onSubmit={handleApply}
                    submitLabel="Terapkan"
                    cancelLabel="Reset"
                    onCancel={handleReset}
                />
            </div>
        </Modal>
    )
}
