/**
 * Admin - Konten Publik Page
 * Manage public website content: Activities, Gallery, Testimonials
 * Layout: Flat sections (no collapsible), clean grid for agenda, improved placeholders for gallery
 */

'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/shared/layout/Dashboard'
import PublicContentEditModal from '@/components/shared/specialized/PublicContentEditModal'
import {
    getPublicContentBySection,
    updateActivities,
    updateGallery,
    updateTestimonials
} from '@/actions/admin/publicContent'
import { uploadProfilePicture } from '@/actions/profile/uploadPicture'
import { useToast } from '@/components/providers/ToastContext'

// Type definitions
type GalleryItem = {
    image_url: string
    caption: string
}

type TestimonialItem = {
    name: string
    description: string
}

const adminMenuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pengguna', href: '/admin/users' },
    { label: 'Hadiah', href: '/admin/rewards' },
    { label: 'Konten Publik', href: '/admin/content' },
    { label: 'Profil', href: '/admin/profile' },
]

export default function KontenPublikPage() {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Data state
    const [agenda, setAgenda] = useState<string[]>(['', '', '', ''])
    const [gallery, setGallery] = useState<GalleryItem[]>([
        { image_url: '/images/smbsd-bg-hd.jpg', caption: 'Kegiatan 1' },
        { image_url: '/images/smbsd-bg-hd.jpg', caption: 'Kegiatan 2' },
        { image_url: '/images/smbsd-bg-hd.jpg', caption: 'Kegiatan 3' },
        { image_url: '/images/smbsd-bg-hd.jpg', caption: 'Kegiatan 4' },
        { image_url: '/images/smbsd-bg-hd.jpg', caption: 'Kegiatan 5' },
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
            const updatedGallery = [...gallery]
            updatedGallery[index] = { ...updatedGallery[index], image_url: result.data }
            setGallery(updatedGallery)
        } else {
            showToast(result.error || 'Gagal mengupload gambar', 'error')
        }

        setUploadingIndex(null)
    }

    const handleSave = async (data: { agenda: string[], gallery: GalleryItem[], testimonials: TestimonialItem[] }) => {
        // Update activities
        const activitiesResult = await updateActivities(data.agenda)
        if (!activitiesResult.success) {
            showToast(activitiesResult.error || 'Gagal mengupdate agenda', 'error')
            return
        }

        // Update gallery
        const mergedGallery = data.gallery.map((item, index) => ({
            ...item,
            image_url: gallery[index]?.image_url || item.image_url
        }))
        const galleryResult = await updateGallery(mergedGallery)
        if (!galleryResult.success) {
            showToast(galleryResult.error || 'Gagal mengupdate galeri', 'error')
            return
        }

        // Update testimonials
        const testimonialsResult = await updateTestimonials(data.testimonials)
        if (!testimonialsResult.success) {
            showToast(testimonialsResult.error || 'Gagal mengupdate testimoni', 'error')
            return
        }

        showToast('Konten berhasil diupdate!', 'success')
        setIsEditModalOpen(false)
        loadContent() // Reload data
    }

    const textColor = '#E57526'

    // Get display image
    const getGalleryImage = (item: GalleryItem, index: number) => {
        return item.image_url || ''
    }

    // Styles
    const sectionTitleStyle = "text-xl md:text-2xl font-bold mb-4 pb-2 border-b-2 inline-block"
    // Updated: border-2, rounded-2xl, and explicit borderColor will be applied inline
    const cardStyle = "bg-white p-6 rounded-2xl border-2 shadow-sm h-full hover:shadow-md transition-shadow"

    return (
        <DashboardLayout role="Admin" menuItems={adminMenuItems}>
            <div className="p-6 md:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: textColor }}
                    >
                        Konten Publik
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : (
                    <div className="space-y-8 max-w-7xl mx-auto pb-12">

                        {/* ===== SECTION 1: AGENDA ===== */}
                        <section>
                            <h2
                                className={sectionTitleStyle}
                                style={{ color: textColor, borderColor: textColor }}
                            >
                                Agenda Tahunan Kegiatan
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                                {agenda.map((item, index) => (
                                    <div key={index} className={cardStyle} style={{ borderColor: textColor }}>
                                        <div className="flex flex-col h-full justify-between">
                                            {/* Updated: Standard font, no uppercase, explicit color */}
                                            <label className="text-sm font-bold mb-2" style={{ color: textColor }}>
                                                Agenda {index + 1}
                                            </label>
                                            <div className="text-lg text-gray-800 break-words py-2 font-medium">
                                                {item || <span className="text-gray-400 italic">Belum diisi</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ===== SECTION 2: GALERI ===== */}
                        <section>
                            <h2
                                className={sectionTitleStyle}
                                style={{ color: textColor, borderColor: textColor }}
                            >
                                Galeri Kegiatan
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {gallery.map((item, index) => {
                                    const imgUrl = getGalleryImage(item, index)
                                    return (
                                        <div
                                            key={index}
                                            className="group bg-white rounded-2xl overflow-hidden shadow-sm border-2 hover:shadow-lg transition-all duration-300 flex flex-col"
                                            style={{ borderColor: textColor }}
                                        >
                                            {/* Image Area */}
                                            <div
                                                className="aspect-video w-full bg-gray-50 relative overflow-hidden cursor-pointer"
                                                onClick={() => imgUrl && setImageModal({
                                                    isOpen: true,
                                                    url: imgUrl,
                                                    caption: item.caption
                                                })}
                                            >
                                                {imgUrl ? (
                                                    <img
                                                        src={imgUrl}
                                                        alt={`Gambar ${index + 1}`}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-gray-300 bg-gray-100">
                                                        <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-sm font-medium">No Image</span>
                                                    </div>
                                                )}

                                                {imgUrl && (
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white font-bold px-4 py-2 rounded-full border border-white/50 backdrop-blur-sm shadow-sm scale-90 group-hover:scale-100 transition-transform">
                                                            Lihat Gambar
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Caption Area */}
                                            <div className="p-5 flex-1 flex flex-col justify-between">
                                                <div>
                                                    {/* Updated: Standard font, no uppercase, explicit color, bumped to text-sm */}
                                                    <div className="text-sm font-bold mb-2" style={{ color: textColor }}>
                                                        Caption {index + 1}
                                                    </div>
                                                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                                                        {item.caption || <span className="text-gray-400 italic">Belum ada caption</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        {/* ===== SECTION 3: TESTIMONI ===== */}
                        <section>
                            <h2
                                className={sectionTitleStyle}
                                style={{ color: textColor, borderColor: textColor }}
                            >
                                Testimoni
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {testimonials.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-8 rounded-2xl shadow-sm border-2 relative mt-2 hover:shadow-md transition-all duration-300"
                                        style={{ borderColor: textColor }}
                                    >

                                        <div className="flex flex-col h-full justify-between">
                                            <p className="text-gray-600 italic leading-relaxed mb-6">
                                                {item.description ? `"${item.description}"` : <span className="text-gray-400 not-italic">Belum ada deskripsi testimoni</span>}
                                            </p>

                                            {/* Removed profile icon, updated Text styling */}
                                            <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
                                                <div>
                                                    <div className="font-bold text-gray-900 line-clamp-1">
                                                        {item.name || <span className="text-gray-400 font-normal italic">Nama kosong</span>}
                                                    </div>
                                                    {/* Updated: Font matched to Caption (text-sm font-bold) and explicit color */}
                                                    <div className="text-sm font-bold" style={{ color: textColor }}>
                                                        Testimoni {index + 1}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Action Button - Full Width matched to Profile Page */}
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
                />

                {/* Lightbox Modal for Gallery */}
                {imageModal.isOpen && (
                    <div
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                        onClick={() => setImageModal({ isOpen: false, url: '' })}
                    >
                        <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
                            <button
                                onClick={() => setImageModal({ isOpen: false, url: '' })}
                                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <img
                                src={imageModal.url}
                                alt={imageModal.caption || 'Gallery Image'}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />

                            {imageModal.caption && (
                                <p className="mt-4 text-white/90 text-center text-lg font-medium px-4 py-2 rounded-full bg-black/50 backdrop-blur-md">
                                    {imageModal.caption}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
