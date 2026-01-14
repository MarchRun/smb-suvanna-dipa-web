/**
 * Admin - Konten Publik Page
 * Manage public website content: Activities, Gallery, Testimonials
 * View mode with edit modal
 */

'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ImageModal from '@/components/shared/ImageModal'
import PublicContentEditModal from '@/components/admin/PublicContentEditModal'
import {
    getPublicContentBySection,
    updateActivities,
    updateGallery,
    updateTestimonials,
    type GalleryItem,
    type TestimonialItem
} from '@/actions/admin/publicContent'
import { uploadProfilePicture } from '@/actions/profile/uploadPicture'

const adminMenuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pengguna', href: '/admin/pengguna' },
    { label: 'Hadiah', href: '/admin/hadiah' },
    { label: 'Konten Publik', href: '/admin/konten' },
    { label: 'Profil', href: '/admin/profil' },
]

export default function KontenPublikPage() {
    const [isDarkMode, setIsDarkMode] = useState(false)
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
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
        checkDarkMode()
        const observer = new MutationObserver(checkDarkMode)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })
        return () => observer.disconnect()
    }, [])

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
                    <div className="space-y-8">
                        {/* Agenda Tahunan Kegiatan */}
                        <div>
                            <h2
                                className="text-xl font-bold mb-4"
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
                                        <p
                                            className="p-4 rounded-xl border-2"
                                            style={{
                                                borderColor: textColor,
                                                color: textColor
                                            }}
                                        >
                                            {item || '-'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Galeri Kegiatan */}
                        <div>
                            <h2
                                className="text-xl font-bold mb-4"
                                style={{ color: textColor }}
                            >
                                Galeri Kegiatan
                            </h2>
                            <div className="space-y-4">
                                {gallery.map((item, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border-2"
                                        style={{ borderColor: textColor }}
                                    >
                                        {/* Image */}
                                        <div>
                                            <label
                                                className="block text-sm font-bold mb-2"
                                                style={{ color: textColor }}
                                            >
                                                Gambar {index + 1}:
                                            </label>
                                            <div className="flex items-center gap-4">
                                                {item.image_url ? (
                                                    <>
                                                        <img
                                                            src={item.image_url}
                                                            alt={`Gambar ${index + 1}`}
                                                            className="w-24 h-24 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            onClick={() => setImageModal({ isOpen: true, url: item.image_url, caption: item.caption })}
                                                            className="px-4 py-2 rounded-lg font-bold text-white hover:opacity-90"
                                                            style={{ backgroundColor: textColor }}
                                                        >
                                                            Lihat
                                                        </button>
                                                    </>
                                                ) : (
                                                    <p className="text-gray-500">Tidak ada gambar</p>
                                                )}
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
                                            <p
                                                className="p-4 rounded-xl border-2"
                                                style={{
                                                    borderColor: textColor,
                                                    color: textColor
                                                }}
                                            >
                                                {item.caption || '-'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-8 py-3 rounded-xl font-bold text-white hover:opacity-90"
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
