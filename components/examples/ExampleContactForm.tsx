/**
 * Example: Simple Contact Form using UniversalForm
 * Demonstrates how to use UniversalForm for a basic form
 */

'use client'

import { useState } from 'react'
import UniversalForm, { FieldConfig } from '@/components/shared/UniversalForm'

// Define form fields configuration
const contactFormFields: FieldConfig[] = [
    {
        name: 'full_name',
        type: 'text',
        label: 'Nama Lengkap',
        placeholder: 'Masukkan nama lengkap',
        required: true,
        columnSpan: 2
    },
    {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'email@example.com',
        required: true
    },
    {
        name: 'phone',
        type: 'tel',
        label: 'Nomor Telepon',
        placeholder: '081234567890',
        helperText: 'Format: 08xxxxxxxxxx',
        required: true
    },
    {
        name: 'subject',
        type: 'select',
        label: 'Subjek',
        required: true,
        options: [
            { value: '', label: 'Pilih subjek...' },
            { value: 'pertanyaan', label: 'Pertanyaan' },
            { value: 'saran', label: 'Saran' },
            { value: 'keluhan', label: 'Keluhan' }
        ]
    },
    {
        name: 'message',
        type: 'textarea',
        label: 'Pesan',
        placeholder: 'Tulis pesan Anda...',
        required: true,
        rows: 6,
        maxLength: 500,
        showCharCount: true,
        columnSpan: 2
    }
]

export default function ExampleContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const handleSubmit = async (data: Record<string, any>) => {
        setIsSubmitting(true)

        try {
            console.log('Form data:', data)
            await new Promise(resolve => setTimeout(resolve, 1000))

            setSuccessMessage('Pesan berhasil dikirim!')

        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {successMessage && (
                <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 rounded-xl text-green-700">
                    {successMessage}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <UniversalForm
                    title="Contoh: Contact Form"
                    mode="create"
                    fields={contactFormFields}
                    onSubmit={handleSubmit}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    )
}
