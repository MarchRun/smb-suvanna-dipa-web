/**
 * Activities Page
 * Displays yearly agenda, gallery, and testimonials
 */

import PageHeader from '@/components/shared/layout/PageHeader'
import ActivitiesAgendaSection from '@/components/activities/ActivitiesAgendaSection'
import ActivitiesGallerySection from '@/components/activities/ActivitiesGallerySection'
import ActivitiesTestimonialSection from '@/components/activities/ActivitiesTestimonialSection'

export default function ActivitiesPage() {
    return (
        <>
            {/* Section 1: Page Header */}
            <PageHeader
                title="Aktivitas"
                backgroundImage="/images/smbsd-bg-hd.jpg"
            />

            {/* Section 2: Agenda Tahunan */}
            <ActivitiesAgendaSection />

            {/* Section 3: Gallery */}
            <ActivitiesGallerySection />

            {/* Section 4: Testimonials */}
            <ActivitiesTestimonialSection />
        </>
    )
}
