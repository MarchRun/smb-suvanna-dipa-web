/**
 * Activities Page
 * Displays yearly agenda, gallery, and testimonials
 */

import PageHeader from '@/components/shared/PageHeader'
import AgendaCards from '@/components/activities/AgendaCards'
import GalleryCarousel from '@/components/activities/GalleryCarousel'
import TestimonialCards from '@/components/activities/TestimonialCards'

export default function ActivitiesPage() {
    return (
        <>
            {/* Section 1: Page Header */}
            <PageHeader
                title="Aktivitas"
            />

            {/* Section 2: Agenda Tahunan */}
            <AgendaCards />

            {/* Section 3: Gallery */}
            <GalleryCarousel />

            {/* Section 4: Testimonials */}
            <TestimonialCards />
        </>
    )
}
