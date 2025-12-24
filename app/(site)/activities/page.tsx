/**
 * Activities Page
 * Displays yearly agenda, gallery, and testimonials
 */

import PageHeader from '@/components/shared/PageHeader'
import Card from '@/components/shared/Card'
import GalleryCarousel from '@/components/site/GalleryCarousel'
import { getAllPublicContent } from '@/actions/content/public'

// Placeholder testimonials (not in database)
const testimonials = [
    {
        name: 'Andi Wijaya',
        text: 'Bergabung dengan SMB Suvanna Dipa telah membuka mata saya terhadap nilai-nilai kebaikan dan kebijaksanaan. Saya merasa lebih tenang dan fokus dalam menjalani kehidupan sehari-hari.'
    },
    {
        name: 'Siti Rahayu',
        text: 'Program meditasi di sini sangat membantu saya mengelola stres dan meningkatkan konsentrasi belajar. Pembinanya sangat sabar dan penuh kasih.'
    },
    {
        name: 'Budi Santoso',
        text: 'Kelas Dhamma yang interaktif membuat saya semakin memahami ajaran Buddha. Komunitas di sini seperti keluarga kedua bagi saya.'
    }
]

export default async function ActivitiesPage() {
    // Fetch content from database
    const { data: content, success, error } = await getAllPublicContent()

    console.log('Content fetch result:', { success, error, contentCount: content?.length })

    // Parse content by section
    const heroSection = content?.find(item => item.section === 'hero')
    const aboutSection = content?.find(item => item.section === 'about')
    const activitiesSection = content?.find(item => item.section === 'activities')

    console.log('Parsed sections:', {
        hero: heroSection?.content,
        about: aboutSection?.content,
        activities: activitiesSection?.content
    })

    const hero = heroSection?.content as { title?: string; subtitle?: string } | undefined
    const about = aboutSection?.content as { text?: string } | undefined
    const activities = activitiesSection?.content as { items?: Array<{ title: string; description: string; image?: string }> } | undefined

    return (
        <>
            {/* Page Header */}
            <section className="bg-white py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <PageHeader
                        title={hero?.title || 'Aktivitas SMB Suvanna Dipa'}
                        subtitle={hero?.subtitle || 'Berbagai kegiatan untuk memperkaya pemahaman spiritual'}
                    />
                </div>
            </section>

            {/* About Activities */}
            {about?.text && (
                <section className="bg-gray-50 py-8 sm:py-12">
                    <div className="max-w-6xl mx-auto px-4">
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                            {about.text}
                        </p>
                    </div>
                </section>
            )}

            {/* Activities Grid */}
            <section className="bg-white py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">
                        Agenda Kegiatan
                    </h2>
                    {activities?.items && activities.items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {activities.items.map((activity, index) => (
                                <Card key={index} hoverable>
                                    <div className="space-y-2 sm:space-y-3">
                                        <h3 className="text-base sm:text-lg font-semibold">
                                            {activity.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                            {activity.description}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No activities found</p>
                    )}
                </div>
            </section>

            {/* Gallery Section */}
            <GalleryCarousel />

            {/* Testimonials Section */}
            <section className="bg-white py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">
                        Testimoni Siswa
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index}>
                                <div className="space-y-2 sm:space-y-3">
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic">
                                        &quot;{testimonial.text}&quot;
                                    </p>
                                    <p className="text-xs sm:text-sm font-semibold text-gray-800">
                                        - {testimonial.name}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
