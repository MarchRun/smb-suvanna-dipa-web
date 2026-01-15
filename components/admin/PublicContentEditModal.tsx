/**
 * Public Content Edit Modal
 * Modal form for editing agenda, gallery, and testimonials
 */

'use client'

import { useState } from 'react'
import Textarea from '@/components/shared/Textarea'
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
    onImageUpload,
    uploadingIndex,
    isDarkMode
}: PublicContentEditModalProps) {
    const [agenda, setAgenda] = useState(initialAgenda)
    const [gallery, setGallery] = useState(initialGallery)
    const [testimonials, setTestimonials] = useState(initialTestimonials)
    const [saving, setSaving] = useState(false)

    const textColor = isDarkMode ? '#ea580c' : '#7c2d12'
    const bgColor = isDarkMode ? '#1e293b' : '#ffffff'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        await onSubmit({ agenda, gallery, testimonials })
        setSaving(false)
    }

    if (!isOpen) return null

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
                    className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                    style={{ backgroundColor: bgColor }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Scrollable content */}
                    <div className="overflow-y-auto max-h-[90vh] p-6 md:p-8">
                        {/* Title */}
                        <h2
                            className="text-2xl md:text-3xl font-bold mb-6"
                            style={{ color: textColor }}
                        >
                            Edit Konten Publik
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Agenda Tahunan Kegiatan */}
                            <div>
                                <h3
                                    className="text-xl font-bold mb-4"
                                    style={{ color: textColor }}
                                >
                                    Agenda Tahunan Kegiatan
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {agenda.map((item, index) => (
                                        <div key={index}>
                                            <label
                                                className="block text-sm font-semibold mb-2"
                                                style={{ color: textColor }}
                                            >
                                                Agenda {index + 1}:
                                            </label>
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => {
                                                    const newAgenda = [...agenda]
                                                    newAgenda[index] = e.target.value
                                                    setAgenda(newAgenda)
                                                }}
                                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-800
                                                    focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200
                                                    disabled:opacity-50 disabled:cursor-not-allowed
                                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                disabled={saving}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Galeri Kegiatan */}
                            <div>
                                <h3
                                    className="text-xl font-bold mb-4"
                                    style={{ color: textColor }}
                                >
                                    Galeri Kegiatan
                                </h3>
                                <div className="space-y-4">
                                    {gallery.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border-2"
                                            style={{ borderColor: textColor }}
                                        >
                                            {/* Image Upload */}
                                            <div>
                                                <label
                                                    className="block text-sm font-semibold mb-2"
                                                    style={{ color: textColor }}
                                                >
                                                    Gambar {index + 1}:
                                                </label>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg,image/jpg,image/png"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0]
                                                            if (file) onImageUpload(index, file)
                                                        }}
                                                        className="flex-1 text-sm"
                                                        disabled={saving || uploadingIndex === index}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                                                        style={{ backgroundColor: '#6b7280' }}
                                                        disabled={saving || uploadingIndex === index}
                                                    >
                                                        {uploadingIndex === index ? 'Uploading...' : 'Upload'}
                                                    </button>
                                                </div>
                                                {item.image_url && (
                                                    <img
                                                        src={item.image_url}
                                                        alt={`Preview ${index + 1}`}
                                                        className="mt-2 w-24 h-24 object-cover rounded-lg border-2"
                                                        style={{ borderColor: textColor }}
                                                    />
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Format: JPEG, PNG. Maksimal 2MB.
                                                </p>
                                            </div>

                                            {/* Caption */}
                                            <div>
                                                <label
                                                    className="block text-sm font-semibold mb-2"
                                                    style={{ color: textColor }}
                                                >
                                                    Caption Gambar {index + 1}:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.caption}
                                                    onChange={(e) => {
                                                        const newGallery = [...gallery]
                                                        newGallery[index].caption = e.target.value
                                                        setGallery(newGallery)
                                                    }}
                                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-800
                                                        focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200
                                                        disabled:opacity-50
                                                        dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    disabled={saving}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Testimoni */}
                            <div>
                                <h3
                                    className="text-xl font-bold mb-4"
                                    style={{ color: textColor }}
                                >
                                    Testimoni
                                </h3>
                                <div className="space-y-4">
                                    {testimonials.map((item, index) => (
                                        <div
                                            key={index}
                                            className="p-4 rounded-lg border-2 space-y-4"
                                            style={{ borderColor: textColor }}
                                        >
                                            {/* Name */}
                                            <div>
                                                <label
                                                    className="block text-sm font-semibold mb-2"
                                                    style={{ color: textColor }}
                                                >
                                                    Nama {index + 1}:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => {
                                                        const newTestimonials = [...testimonials]
                                                        newTestimonials[index].name = e.target.value
                                                        setTestimonials(newTestimonials)
                                                    }}
                                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-800
                                                        focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200
                                                        disabled:opacity-50
                                                        dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    disabled={saving}
                                                    required
                                                />
                                            </div>

                                            {/* Description */}
                                            <Textarea
                                                label={`Deskripsi ${index + 1}:`}
                                                value={item.description}
                                                onChange={(e) => {
                                                    const newTestimonials = [...testimonials]
                                                    newTestimonials[index].description = e.target.value
                                                    setTestimonials(newTestimonials)
                                                }}
                                                rows={4}
                                                disabled={saving}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form Actions - Wireframe style */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-lg font-bold text-gray-700 bg-yellow-400 hover:bg-yellow-500 transition-all disabled:opacity-50"
                                    disabled={saving}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                                    style={{ backgroundColor: '#6b7280' }}
                                    disabled={saving}
                                >
                                    {saving ? 'Menyimpan...' : 'Konfirmasi Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
