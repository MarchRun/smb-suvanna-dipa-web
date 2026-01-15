/**
 * Public Content Edit Modal - Using UniversalForm with Sections
 * Modal form for editing agenda, gallery, and testimonials
 */

'use client'

import { useState } from 'react'
import UniversalForm, { FormSection } from '@/components/shared/UniversalForm'
import type { GalleryItem, TestimonialItem } from '@/actions/admin/publicContent'

interface PublicContentEditModalProps {
    isOpen: boolean
    onClose: () => void
    initialAgenda: string[]
    initialGallery: GalleryItem[]
    initialTestimonials: TestimonialItem[]
    onSubmit: (data: {
        agenda: string[]
        gallery: GalleryItem[]
        testimonials: TestimonialItem[]
    }) => Promise<void>
    onImageUpload: (index: number, file: File) => Promise<void>
    uploadingIndex: number | null
    isDarkMode: boolean
}

export default function PublicContentEditModal({
    isOpen,
    onClose,
    initialAgenda,
    initialGallery,
    initialTestimonials,
    onSubmit,
    isDarkMode
}: PublicContentEditModalProps) {
    // Prepare initial data
    const initialData: Record<string, any> = {
        agenda_1: initialAgenda[0] || '',
        agenda_2: initialAgenda[1] || '',
        agenda_3: initialAgenda[2] || '',
        agenda_4: initialAgenda[3] || '',

        // Gallery items
        ...initialGallery.reduce((acc, item, index) => {
            acc[`gallery_${index + 1}_caption`] = item.caption
            return acc
        }, {} as Record<string, string>),

        // Testimonials
        ...initialTestimonials.reduce((acc, item, index) => {
            acc[`testimonial_${index + 1}_name`] = item.name
            acc[`testimonial_${index + 1}_text`] = item.description  // Use description
            return acc
        }, {} as Record<string, string>)
    }

    // Define sections
    const sections: FormSection[] = [
        {
            sectionTitle: 'Agenda Tahunan Kegiatan',
            fields: [
                { name: 'agenda_1', type: 'text', label: 'Agenda 1', required: true },
                { name: 'agenda_2', type: 'text', label: 'Agenda 2', required: true },
                { name: 'agenda_3', type: 'text', label: 'Agenda 3', required: true },
                { name: 'agenda_4', type: 'text', label: 'Agenda 4', required: true }
            ]
        },
        {
            sectionTitle: 'Galeri Kegiatan',
            fields: initialGallery.map((_, index) => ({
                name: `gallery_${index + 1}_caption`,
                type: 'text' as const,
                label: `Caption Gambar ${index + 1}`,
                required: true
            }))
        },
        {
            sectionTitle: 'Testimoni',
            fields: initialTestimonials.flatMap((_, index) => [
                {
                    name: `testimonial_${index + 1}_name`,
                    type: 'text' as const,
                    label: `Nama ${index + 1}`,
                    required: true
                },
                {
                    name: `testimonial_${index + 1}_text`,
                    type: 'textarea' as const,
                    label: `Deskripsi ${index + 1}`,
                    required: true,
                    rows: 4,
                    columnSpan: 2 as const
                }
            ])
        }
    ]

    // Handle submit - transform data back
    const handleSubmit = async (data: Record<string, any>) => {
        const agenda = [
            data.agenda_1,
            data.agenda_2,
            data.agenda_3,
            data.agenda_4
        ]

        const gallery = initialGallery.map((item, index) => ({
            ...item,
            caption: data[`gallery_${index + 1}_caption`]
        }))

        const testimonials = initialTestimonials.map((item, index) => ({
            ...item,
            name: data[`testimonial_${index + 1}_name`],
            description: data[`testimonial_${index + 1}_text`]  // Map to description
        }))

        await onSubmit({ agenda, gallery, testimonials })
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="overflow-y-auto max-h-[90vh] p-6 md:p-8">
                        <UniversalForm
                            title="Edit Konten Publik"
                            mode="edit"
                            sections={sections}
                            initialData={initialData}
                            onSubmit={handleSubmit}
                            onCancel={onClose}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
