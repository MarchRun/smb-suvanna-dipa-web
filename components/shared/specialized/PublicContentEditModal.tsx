/**
 * Public Content Edit Modal - Using UniversalForm + Animated Modal
 * Modal form for editing agenda, gallery, and testimonials
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { Modal } from '@/components/shared/ui/Modals'
import { Input, Textarea } from '@/components/shared/ui/FormElements'
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
}

// Compact file upload component for gallery
function CompactFileUpload({
    index,
    onFileSelect,
    existingUrl,
    isUploading
}: {
    index: number
    onFileSelect: (file: File) => void
    existingUrl?: string
    isUploading: boolean
}) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = useState('')
    const [error, setError] = useState('')
    const textColor = '#E57526'

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setError('')

        if (!file) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
        if (!validTypes.includes(file.type)) {
            setError('Format: JPEG, PNG saja')
            return
        }

        // Validate file size (1MB)
        if (file.size > 1 * 1024 * 1024) {
            setError('Maksimal 1MB')
            return
        }

        setFileName(file.name)
        onFileSelect(file)
    }

    return (
        <div>
            <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                Gambar {index + 1}
            </label>
            <div className="flex">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <input
                    type="text"
                    value={fileName || (existingUrl ? 'Gambar ada' : '')}
                    placeholder="Pilih file..."
                    readOnly
                    className="flex-1 px-3 py-2 text-sm rounded-l-full border-2 border-r-0 cursor-pointer
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white truncate"
                    style={{ borderColor: textColor }}
                    onClick={() => fileInputRef.current?.click()}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-2 text-sm rounded-r-full font-bold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: textColor }}
                >
                    {isUploading ? '...' : 'Upload'}
                </button>
            </div>
            <p className="text-gray-500 text-xs mt-1">
                {error || 'Format: JPEG, PNG. Maksimal 1MB.'}
            </p>
        </div>
    )
}

export default function PublicContentEditModal({
    isOpen,
    onClose,
    initialAgenda,
    initialGallery,
    initialTestimonials,
    onSubmit,
    onImageUpload,
    uploadingIndex
}: PublicContentEditModalProps) {
    const textColor = '#E57526'
    const buttonBgColor = '#E57526'

    // Form state
    const [agenda, setAgenda] = useState<string[]>(initialAgenda)
    const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery)
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setAgenda(initialAgenda)
            setGallery(initialGallery)
            setTestimonials(initialTestimonials)
        }
    }, [isOpen, initialAgenda, initialGallery, initialTestimonials])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await onSubmit({ agenda, gallery, testimonials })
        } finally {
            setIsSubmitting(false)
        }
    }

    const updateAgenda = (index: number, value: string) => {
        const newAgenda = [...agenda]
        newAgenda[index] = value
        setAgenda(newAgenda)
    }

    const updateGalleryCaption = (index: number, caption: string) => {
        const newGallery = [...gallery]
        newGallery[index] = { ...newGallery[index], caption }
        setGallery(newGallery)
    }

    const updateTestimonialName = (index: number, name: string) => {
        const newTestimonials = [...testimonials]
        newTestimonials[index] = { ...newTestimonials[index], name }
        setTestimonials(newTestimonials)
    }

    const updateTestimonialText = (index: number, description: string) => {
        const newTestimonials = [...testimonials]
        newTestimonials[index] = { ...newTestimonials[index], description }
        setTestimonials(newTestimonials)
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            showCloseButton={false}
        >
            <div className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form Title */}
                    <h2
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: textColor }}
                    >
                        Edit Konten Publik
                    </h2>

                    {/* Section 1: Agenda */}
                    <div className="space-y-4">
                        <h3
                            className="text-xl font-bold border-b-2 pb-2"
                            style={{ color: textColor, borderColor: textColor }}
                        >
                            Agenda Tahunan Kegiatan
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[0, 1, 2, 3].map((i) => (
                                <Input
                                    key={i}
                                    label={`Agenda ${i + 1}`}
                                    value={agenda[i] || ''}
                                    onChange={(e) => updateAgenda(i, e.target.value)}
                                    required
                                />
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Gallery with Upload + Caption side by side */}
                    <div className="space-y-4">
                        <h3
                            className="text-xl font-bold border-b-2 pb-2"
                            style={{ color: textColor, borderColor: textColor }}
                        >
                            Galeri Kegiatan
                        </h3>
                        <div className="space-y-4">
                            {gallery.map((item, i) => (
                                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Left: File Upload */}
                                    <CompactFileUpload
                                        index={i}
                                        onFileSelect={(file) => onImageUpload(i, file)}
                                        existingUrl={item.image_url}
                                        isUploading={uploadingIndex === i}
                                    />
                                    {/* Right: Caption */}
                                    <Input
                                        label={`Caption Gambar ${i + 1}`}
                                        value={item.caption}
                                        onChange={(e) => updateGalleryCaption(i, e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Testimonials with full-width name */}
                    <div className="space-y-4">
                        <h3
                            className="text-xl font-bold border-b-2 pb-2"
                            style={{ color: textColor, borderColor: textColor }}
                        >
                            Testimoni
                        </h3>
                        <div className="space-y-6">
                            {testimonials.map((item, i) => (
                                <div key={i} className="space-y-4">
                                    {/* Name - Full Width */}
                                    <Input
                                        label={`Nama ${i + 1}`}
                                        value={item.name}
                                        onChange={(e) => updateTestimonialName(i, e.target.value)}
                                        required
                                    />
                                    {/* Description - Full Width */}
                                    <Textarea
                                        label={`Deskripsi ${i + 1}`}
                                        value={item.description}
                                        onChange={(e) => updateTestimonialText(i, e.target.value)}
                                        required
                                        rows={4}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-6 rounded-xl border-2 font-bold
                                     border-orange-600 text-orange-600 
                                     hover:bg-orange-50 dark:hover:bg-orange-900/20
                                     transition-all disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || uploadingIndex !== null}
                            className="flex-1 py-3 px-6 rounded-xl font-bold text-white 
                                     transition-all disabled:opacity-50 hover:opacity-90"
                            style={{ backgroundColor: buttonBgColor }}
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Konfirmasi Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}
