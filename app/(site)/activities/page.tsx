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
            {/* Section 1: Page Header */}
            <PageHeader
                title="Aktivitas SMB Suvanna Dipa"
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
