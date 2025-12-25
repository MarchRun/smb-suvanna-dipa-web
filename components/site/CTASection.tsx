/**
 * CTA Section Component
 * Call-to-action for community joining
 * Gray background with button
 */

'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/shared/Button'

export default function CTASection() {
    const router = useRouter()

    return (
        <section
            className="py-12 sm:py-16 md:py-20"
            style={{
                backgroundColor: 'var(--bg-primary)' // Orange in light, dark blue in dark
            }}
        >
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
                    style={{ color: '#ffffff' }}
                >
                    Bergabunglah Dengan Komunitas Kami
                </h2>
                <p
                    className="text-base sm:text-lg mb-6 sm:mb-8 mx-auto font-semibold px-4 sm:px-8 md:px-12"
                    style={{ color: '#ffffff' }}
                >
                    Kami mengadakan berbagai kegiatan menarik dan bermakna untuk mengembangkan pemahaman Dharma dan mempererat tali persaudaraan. Dari kegiatan pembelajaran, meditasi, hingga bakti sosial, setiap aktivitas dirancang untuk menumbuhkan kebajikan dan kebahagiaan. Jelajahi aktivitas kami dan temukan cara untuk berkontribusi dalam membangun komunitas yang penuh kasih dan kebijaksanaan. Mari bersama-sama berproses menuju pencerahan.
                </p>
                <Button variant="primary" onClick={() => router.push('/activities')} customStyle={{ backgroundColor: '#c2410c' }}>
                    Lihat Aktivitas Kami
                </Button>
            </div>
        </section>
    )
}
