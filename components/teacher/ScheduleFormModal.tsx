/**
 * Schedule Form Modal Component
 * Modal form for creating and editing schedules
 * Uses UniversalForm for consistent styling
 */

'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/shared/ui/Modals'
import UniversalForm from '@/components/shared/forms/UniversalForm'
import type { FieldConfig } from '@/components/shared/forms/UniversalForm'
import type { Schedule } from '@/types'

export interface ScheduleFormData {
    name: string
    event_date: string
    description: string
}

interface ScheduleFormModalProps {
    isOpen: boolean
    onClose: () => void
    mode: 'create' | 'edit'
    schedule?: Schedule | null
    onSubmit: (data: ScheduleFormData) => Promise<void>
    isLoading?: boolean
}

export default function ScheduleFormModal({
    isOpen,
    onClose,
    mode,
    schedule,
    onSubmit,
    isLoading = false
}: ScheduleFormModalProps) {
    // Form fields configuration
    const formFields: FieldConfig[] = [
        {
            name: 'name',
            type: 'text',
            label: 'Nama Kegiatan',
            placeholder: 'Masukkan nama kegiatan',
            required: true,
            columnSpan: 2
        },
        {
            name: 'event_date',
            type: 'date',
            label: 'Waktu Pelaksanaan',
            required: true,
            columnSpan: 2
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Deskripsi Kegiatan',
            placeholder: 'Masukkan deskripsi kegiatan (opsional)',
            rows: 4,
            columnSpan: 2
        }
    ]

    // Format date for input (YYYY-MM-DD)
    const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
    }

    // Initial data for form
    const initialData = schedule ? {
        name: schedule.name,
        event_date: formatDateForInput(schedule.event_date),
        description: schedule.description || ''
    } : {
        name: '',
        event_date: '',
        description: ''
    }

    const handleSubmit = async (data: Record<string, any>) => {
        await onSubmit({
            name: data.name,
            event_date: data.event_date,
            description: data.description || ''
        })
    }


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            showCloseButton={false}
        >
            <div className="p-6 md:p-8">
                <UniversalForm
                    title={mode === 'create' ? 'Tambah Kegiatan' : 'Edit Kegiatan'}
                    mode={mode}
                    fields={formFields}
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                    isLoading={isLoading}
                />
            </div>
        </Modal>
    )
}
