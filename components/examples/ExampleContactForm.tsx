/**
 * Example: Simple Contact Form using DynamicForm
 * Demonstrates how to use DynamicForm for a basic form
 */

'use client'

import { useState } from 'react'
import DynamicForm, { FieldConfig } from '@/components/shared/DynamicForm'

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
        helperText: 'Format: 08xxxxxxxxxx'
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
            // Simulate API call
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
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Contoh: Contact Form
            </h1>

            {successMessage && (
                <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 rounded-xl text-green-700">
                    {successMessage}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <DynamicForm
                    fields={contactFormFields}
                    onSubmit={handleSubmit}
                    submitLabel="Kirim Pesan"
                    isLoading={isSubmitting}
                    columns={2}
                />
            </div>

            {/* Show how simple it is */}
            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">
                    💡 Kode Super Simple!
                </h2>
                <pre className="text-sm bg-white dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                    {`<DynamicForm
  fields={contactFormFields}  // Cuma array config!
  onSubmit={handleSubmit}
  submitLabel="Kirim Pesan"
  isLoading={isSubmitting}
  columns={2}
/>`}
                </pre>
                <p className="mt-4 text-blue-800 dark:text-blue-200">
                    ✨ Form complete dengan validation, error handling, layout - semua otomatis!
                </p>
            </div>
        </div>
    )
}
