/**
 * Admin - Konten Publik Page
 * Manage public website content: Activities, Gallery, Testimonials
 * View mode with edit modal
 */

'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/shared/DashboardLayout'
import ImageModal from '@/components/shared/ImageModal'
import PublicContentEditModal from '@/components/shared/PublicContentEditModal'
import {
    getPublicContentBySection,
    updateActivities,
    updateGallery,
    updateTestimonials,
    type GalleryItem,
    type TestimonialItem
} from '@/actions/admin/publicContent'
import { uploadProfilePicture } from '@/actions/profile/uploadPicture'
import { useDarkMode } from '@/hooks/useDarkMode'

const adminMenuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pengguna', href: '/admin/pengguna' },
    { label: 'Hadiah', href: '/admin/hadiah' },
    { label: 'Konten Publik', href: '/admin/konten' },
    { label: 'Profil', href: '/admin/profil' },
]

// Default images for gallery preview
const defaultGalleryImages = [
    '/images/slider-image1.png',
    '/images/slider-image2.png',
    '/images/slider-image3.png',
    '/images/slider-image4.png',
    '/images/slider-image5.png'
]

export default function KontenPublikPage() {
    const isDarkMode = useDarkMode()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    // Data state
    const [agenda, setAgenda] = useState<string[]>(['', '', '', ''])
    const [gallery, setGallery] = useState<GalleryItem[]>([
        { image_url: '', caption: '' },
        { image_url: '', caption: '' },
        { image_url: '', caption: '' },
        { image_url: '', caption: '' },
        { image_url: '', caption: '' }
    ])
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
        { name: '', description: '' },
        { name: '', description: '' },
        { name: '', description: '' }
    ])

    // Image modal
    const [imageModal, setImageModal] = useState<{ isOpen: boolean; url: string; caption?: string }>({
        isOpen: false,
        url: ''
    })

    // Uploading state
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

    useEffect(() => {
        loadContent()
    }, [])

    const loadContent = async () => {
        setLoading(true)

        // Load activities
        const activitiesResult = await getPublicContentBySection('activities')
        if (activitiesResult.success && activitiesResult.data?.content?.agenda) {
            setAgenda(activitiesResult.data.content.agenda)
        }

        // Load gallery
        const galleryResult = await getPublicContentBySection('gallery')
        if (galleryResult.success && galleryResult.data?.content?.items) {
            setGallery(galleryResult.data.content.items)
        }

        // Load testimonials
        const testimonialsResult = await getPublicContentBySection('testimonials')
        if (testimonialsResult.success && testimonialsResult.data?.content?.items) {
            setTestimonials(testimonialsResult.data.content.items)
        }

        setLoading(false)
    }

    const handleImageUpload = async (index: number, file: File) => {
        setUploadingIndex(index)

        const formData = new FormData()
        formData.append('file', file)
        const result = await uploadProfilePicture(formData)

        if (result.success && result.data) {
            const newGallery = [...gallery]
            newGallery[index].image_url = result.data
            setGallery(newGallery)
        } else {
            alert(result.error || 'Gagal upload gambar')
        }

        setUploadingIndex(null)
    }

    const handleSave = async (data: {
        agenda: string[]
        gallery: GalleryItem[]
        testimonials: TestimonialItem[]
    }) => {
        // Update activities
        const activitiesResult = await updateActivities(data.agenda)
        if (!activitiesResult.success) {
            alert(activitiesResult.error || 'Gagal update agenda')
            return
        }

        // Update gallery
        const galleryResult = await updateGallery(data.gallery)
        if (!galleryResult.success) {
            alert(galleryResult.error || 'Gagal update galeri')
            return
        }

        // Update testimonials
        const testimonialsResult = await updateTestimonials(data.testimonials)
        if (!testimonialsResult.success) {
            alert(testimonialsResult.error || 'Gagal update testimoni')
            return
        }

        alert('Konten berhasil diupdate!')
        setIsEditModalOpen(false)
        loadContent() // Reload data
    }

    const textColor = isDarkMode ? '#ea580c' : '#7c2d12'
    const bgColor = isDarkMode ? '#0f172a' : 'var(--accent-200)'

    // Get display image - use uploaded or fallback to default
    const getGalleryImage = (item: GalleryItem, index: number) => {
        return item.image_url || defaultGalleryImages[index] || '/images/slider-image1.png'
    }

    return (
        <DashboardLayout role="Admin" menuItems={adminMenuItems}>
            <div className="p-6 md:p-8">
                {/* Header */}
                <h1
                    className="text-2xl md:text-3xl font-bold mb-8"
                    style={{ color: textColor }}
                >
                    Konten Publik
                </h1>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : (
                    <div className="space-y-8 max-w-4xl mx-auto">
                        {/* Section 1: Agenda Tahunan Kegiatan */}
                        <div>
                            <h2
                                className="text-xl md:text-2xl font-bold mb-6 text-center"
                                style={{ color: textColor }}
                            >
                                Agenda Tahunan Kegiatan
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {agenda.map((item, index) => (
                                    <div key={index}>
                                        <label
                                            className="block text-sm font-bold mb-2"
                                            style={{ color: textColor }}
                                        >
                                            Agenda {index + 1}:
                                        </label>
                                        <div
                                            className="px-4 py-3 rounded-xl border-2 min-h-[48px] flex items-center"
                                            style={{
                                                borderColor: textColor,
                                                backgroundColor: bgColor,
                                                color: textColor
                                            }}
                                        >
                                            {item || '-'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 2: Galeri Kegiatan */}
                        <div>
                            <h2
                                className="text-xl md:text-2xl font-bold mb-6 text-center"
                                style={{ color: textColor }}
                            >
                                Galeri Kegiatan
                            </h2>
                            <div className="space-y-4">
                                {gallery.map((item, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        {/* Image */}
                                        <div>
                                            <label
                                                className="block text-sm font-bold mb-2"
                                                style={{ color: textColor }}
                                            >
                                                Gambar {index + 1}:
                                            </label>
                                            <div
                                                className="px-4 py-3 rounded-xl border-2 min-h-[48px] flex items-center gap-4"
                                                style={{
                                                    borderColor: textColor,
                                                    backgroundColor: bgColor
                                                }}
                                            >
                                                <img
                                                    src={getGalleryImage(item, index)}
                                                    alt={`Gambar ${index + 1}`}
                                                    className="w-16 h-12 object-cover rounded-lg"
                                                />
                                                <button
                                                    onClick={() => setImageModal({
                                                        isOpen: true,
                                                        url: getGalleryImage(item, index),
                                                        caption: item.caption
                                                    })}
                                                    className="px-4 py-2 rounded-xl font-bold text-white hover:opacity-90 transition-opacity text-sm"
                                                    style={{ backgroundColor: textColor }}
                                                >
                                                    Lihat
                                                </button>
                                            </div>
                                        </div>

                                        {/* Caption */}
                                        <div>
                                            <label
                                                className="block text-sm font-bold mb-2"
                                                style={{ color: textColor }}
                                            >
                                                Caption Gambar {index + 1}:
                                            </label>
                                            <div
                                                className="px-4 py-3 rounded-xl border-2 min-h-[48px] flex items-center"
                                                style={{
                                                    borderColor: textColor,
                                                    backgroundColor: bgColor,
                                                    color: textColor
                                                }}
                                            >
                                                {item.caption || '-'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 3: Testimoni */}
                        <div>
                            <h2
                                className="text-xl md:text-2xl font-bold mb-6 text-center"
                                style={{ color: textColor }}
                            >
                                Testimoni
                            </h2>
                            <div className="space-y-4">
                                {testimonials.map((item, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        {/* Name */}
                                        <div>
                                            <label
                                                className="block text-sm font-bold mb-2"
                                                style={{ color: textColor }}
                                            >
                                                Nama {index + 1}:
                                            </label>
                                            <div
                                                className="px-4 py-3 rounded-xl border-2 min-h-[48px] flex items-center"
                                                style={{
                                                    borderColor: textColor,
                                                    backgroundColor: bgColor,
                                                    color: textColor
                                                }}
                                            >
                                                {item.name || '-'}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label
                                                className="block text-sm font-bold mb-2"
                                                style={{ color: textColor }}
                                            >
                                                Deskripsi {index + 1}:
                                            </label>
                                            <div
                                                className="px-4 py-3 rounded-xl border-2 min-h-[48px] flex items-center"
                                                style={{
                                                    borderColor: textColor,
                                                    backgroundColor: bgColor,
                                                    color: textColor
                                                }}
                                            >
                                                {item.description || '-'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Button - Not sticky, at bottom */}
                        <div className="pt-6">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:opacity-90"
                                style={{ backgroundColor: textColor }}
                            >
                                Ubah Konten
                            </button>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                <PublicContentEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialAgenda={agenda}
                    initialGallery={gallery}
                    initialTestimonials={testimonials}
                    onSubmit={handleSave}
                    onImageUpload={handleImageUpload}
                    uploadingIndex={uploadingIndex}
                    isDarkMode={isDarkMode}
                />

                {/* Image Modal */}
                <ImageModal
                    isOpen={imageModal.isOpen}
                    imageUrl={imageModal.url}
                    caption={imageModal.caption}
                    onClose={() => setImageModal({ isOpen: false, url: '' })}
                />
            </div>
        </DashboardLayout>
    )
}

