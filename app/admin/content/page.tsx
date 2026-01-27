/**
 * Admin - Konten Publik Page
 * Manage public website content: Activities, Gallery, Testimonials
 * View mode with edit modal - Collapsible sections with smooth animation
 */

'use client'

import { useState, useEffect, useRef } from 'react'
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
    { label: 'Pengguna', href: '/admin/users' },
    { label: 'Hadiah', href: '/admin/rewards' },
    { label: 'Konten Publik', href: '/admin/content' },
    { label: 'Profil', href: '/admin/profile' },
]

// Default images for gallery preview
const defaultGalleryImages = [
    '/images/slider-image1.png',
    '/images/slider-image2.png',
    '/images/slider-image3.png',
    '/images/slider-image4.png',
    '/images/slider-image5.png'
]

// Collapsible Section Component with smooth animation
function CollapsibleSection({
    title,
    children,
    defaultOpen = true,
    textColor,
    borderColor
}: {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    textColor: string
    borderColor: string
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen)
    const contentRef = useRef<HTMLDivElement>(null)
    const [contentHeight, setContentHeight] = useState<number | undefined>(undefined)

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight)
        }
    }, [children])

    return (
        <div
            className="rounded-xl border-2 overflow-hidden"
            style={{ borderColor: textColor }}
        >
            {/* Header - Clickable */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-white/50 hover:bg-white/70 transition-colors"
            >
                <h2
                    className="text-lg md:text-xl font-bold"
                    style={{ color: textColor }}
                >
                    {title}
                </h2>
                <svg
                    className={`w-5 h-5 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke={textColor}
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Content with smooth animation */}
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: isOpen ? contentHeight : 0,
                    opacity: isOpen ? 1 : 0
                }}
            >
                <div
                    ref={contentRef}
                    className="px-6 py-5 border-t-2"
                    style={{ borderColor: textColor }}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

export default function KontenPublikPage() {
    const isDarkMode = useDarkMode()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)

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
            alert(result.error || 'Gagal mengupload gambar')
        }

        setUploadingIndex(null)
    }

    const handleSave = async (data: { agenda: string[], gallery: GalleryItem[], testimonials: TestimonialItem[] }) => {
        // Update activities
        const activitiesResult = await updateActivities(data.agenda)
        if (!activitiesResult.success) {
            alert(activitiesResult.error || 'Gagal mengupdate agenda')
            return
        }

        // Update gallery (merge with current images)
        const mergedGallery = data.gallery.map((item, index) => ({
            ...item,
            image_url: gallery[index]?.image_url || item.image_url
        }))
        const galleryResult = await updateGallery(mergedGallery)
        if (!galleryResult.success) {
            alert(galleryResult.error || 'Gagal mengupdate galeri')
            return
        }

        // Update testimonials
        const testimonialsResult = await updateTestimonials(data.testimonials)
        if (!testimonialsResult.success) {
            alert(testimonialsResult.error || 'Gagal mengupdate testimoni')
            return
        }

        alert('Konten berhasil diupdate!')
        setIsEditModalOpen(false)
        loadContent() // Reload data
    }

    // Colors - consistent across all sections
    const textColor = isDarkMode ? '#ea580c' : '#E57526'
    const inputBgColor = isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)' // gray-600 / gray-200
    const dataTextColor = isDarkMode ? '#e5e7eb' : '#374151'

    // Get display image
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
                    <div className="space-y-6 max-w-4xl mx-auto">

                        {/* ===== SECTION 1: AGENDA ===== */}
                        <CollapsibleSection
                            title="Agenda Tahunan Kegiatan"
                            textColor={textColor}
                            borderColor={textColor}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {agenda.map((item, index) => (
                                    <div key={index}>
                                        <label
                                            className="block text-sm font-bold mb-2"
                                            style={{ color: textColor }}
                                        >
                                            Agenda {index + 1}
                                        </label>
                                        <div
                                            className="px-4 py-3 rounded-full border-2 min-h-[48px] flex items-center"
                                            style={{
                                                borderColor: textColor,
                                                backgroundColor: inputBgColor,
                                                color: dataTextColor
                                            }}
                                        >
                                            {item || <span className="text-gray-400 italic">Belum diisi</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleSection>

                        {/* ===== SECTION 2: GALERI ===== */}
                        <CollapsibleSection
                            title="Galeri Kegiatan"
                            textColor={textColor}
                            borderColor={textColor}
                        >
                            <div className="space-y-4">
                                {gallery.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border-2"
                                        style={{
                                            borderColor: textColor,
                                            backgroundColor: inputBgColor
                                        }}
                                    >
                                        {/* Image Preview - Left side */}
                                        <div
                                            className="relative w-full md:w-48 h-32 flex-shrink-0 cursor-pointer group rounded-lg overflow-hidden"
                                            onClick={() => setImageModal({
                                                isOpen: true,
                                                url: getGalleryImage(item, index),
                                                caption: item.caption
                                            })}
                                        >
                                            <img
                                                src={getGalleryImage(item, index)}
                                                alt={`Gambar ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">Lihat</span>
                                            </div>
                                        </div>

                                        {/* Caption - Right side */}
                                        <div className="flex-1">
                                            <label
                                                className="block text-sm font-bold mb-2"
                                                style={{ color: textColor }}
                                            >
                                                Caption Gambar {index + 1}
                                            </label>
                                            <p
                                                style={{ color: dataTextColor }}
                                            >
                                                {item.caption || <span className="text-gray-400 italic">Belum ada caption</span>}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleSection>

                        {/* ===== SECTION 3: TESTIMONI ===== */}
                        <CollapsibleSection
                            title="Testimoni"
                            textColor={textColor}
                            borderColor={textColor}
                        >
                            <div className="space-y-4">
                                {testimonials.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-xl border-2"
                                        style={{
                                            borderColor: textColor,
                                            backgroundColor: inputBgColor
                                        }}
                                    >
                                        {/* Testimoni Label */}
                                        <label
                                            className="block text-sm font-bold mb-2"
                                            style={{ color: textColor }}
                                        >
                                            Testimoni {index + 1}
                                        </label>

                                        {/* Name - Same style as label */}
                                        <p
                                            className="font-bold mb-3"
                                            style={{ color: textColor }}
                                        >
                                            {item.name || <span className="text-gray-400 italic font-normal">Nama kosong</span>}
                                        </p>

                                        {/* Description */}
                                        <p
                                            className="leading-relaxed"
                                            style={{ color: dataTextColor }}
                                        >
                                            {item.description || <span className="text-gray-400 italic">Belum ada deskripsi testimoni</span>}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleSection>

                        {/* Action Button */}
                        <div className="pt-4">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:opacity-90 hover:shadow-lg"
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
