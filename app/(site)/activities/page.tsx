/**
 * Activities Page
 * Displays yearly agenda, gallery, and testimonials
 */

import PageHeader from '@/components/shared/PageHeader'
import AgendaCards from '@/components/site/AgendaCards'
import GalleryCarousel from '@/components/site/GalleryCarousel'
import TestimonialCards from '@/components/site/TestimonialCards'

export default function ActivitiesPage() {
    return (
        <>
            {/* Page Header */}
            <section className="bg-white py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <PageHeader
                        title="Aktivitas SMB Suvanna Dipa"
                        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante. Aliquam in mauris feugiat, viverra enim quis, lobortis nunc. Maecenas ut tristique lacus, eu elementum ante."
                    />
                </div>
            </section>

            {/* Agenda Section */}
            <AgendaCards />

            {/* Gallery Section */}
            <GalleryCarousel />

            {/* Testimonials Section */}
            <TestimonialCards />
        </>
    )
}
