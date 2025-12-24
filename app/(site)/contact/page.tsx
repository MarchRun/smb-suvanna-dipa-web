/**
 * Contact Page
 * Displays contact information with map and contact details
 */

import PageHeader from '@/components/shared/PageHeader'
import Placeholder from '@/components/shared/Placeholder'
import ContactCards from '@/components/site/ContactCards'

export default function ContactPage() {
    return (
        <>
            {/* Page Header */}
            <section className="bg-white py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <PageHeader
                        title="Kontak SMB Suvanna Dipa"
                    />

                    {/* Map Placeholder */}
                    <div className="mb-8 sm:mb-12">
                        <Placeholder text="MAPS" aspectRatio="2:1" />
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <ContactCards />
        </>
    )
}
