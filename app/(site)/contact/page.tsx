/**
 * Contact Page
 * Displays contact information with map and contact details
 */

import PageHeader from '@/components/shared/PageHeader'
import ContactCards from '@/components/site/ContactCards'

export default function ContactPage() {
    return (
        <>
            {/* Page Header with Cream Background */}
            <PageHeader
                title="Kontak SMB Suvanna Dipa"
            />

            {/* Map Section */}
            <section className="py-12 sm:py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="max-w-7xl mx-auto px-4">
                    {/* Google Maps Embed */}
                    <div
                        className="mb-0 rounded-lg overflow-hidden shadow-lg"
                        style={{ border: '4px solid var(--primary-600)' }}
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.3218746678835!2d105.25202117498429!3d-5.440422194538974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40da25416a8f2f%3A0x3d9b5682cf9f358!2sSuvanna%20Dipa%20Arama%20Temple!5e1!3m2!1sid!2sid!4v1766727010093!5m2!1sid!2sid"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lokasi Suvanna Dipa Arama Temple"
                        />
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <ContactCards />
        </>
    )
}
