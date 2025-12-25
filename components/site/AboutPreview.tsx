/**
 * About Preview Section
 * Gray background with heading, description, and CTA button
 * Responsive layout
 */

'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/shared/Button'

export default function AboutPreview() {
    const router = useRouter()

    return (
        <section
            className="py-12 sm:py-16 md:py-20"
            style={{
                backgroundColor: 'var(--bg-primary)' // Orange in light, dark blue in dark mode
            }}
        >
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
                    style={{ color: '#ffffff' }}
                >
                    Mengenal SMB Suvanna Dipa
                </h2>
                <p
                    className="text-base sm:text-lg mb-6 sm:mb-8 mx-auto font-semibold px-4 sm:px-8 md:px-12"
                    style={{ color: '#ffffff' }}
                >
                    Sekolah Minggu Buddha Suvanna Dipa merupakan wadah pembelajaran dan pengembangan spiritual bagi anak-anak dan remaja Buddhist. Kami berkomitmen untuk memberikan pendidikan Dharma yang berkualitas dalam suasana yang menyenangkan dan penuh kasih sayang. Melalui berbagai kegiatan, kami membantu siswa memahami ajaran Buddha dan menerapkannya dalam kehidupan sehari-hari. Bergabunglah dengan kami untuk menumbuhkan benih kebajikan dan kebijaksanaan sejak dini.
                </p>
                <Button variant="primary" onClick={() => router.push('/about')} customStyle={{ backgroundColor: '#c2410c' }}>
                    Selengkapnya Tentang Kami
                </Button>
            </div>
        </section>
    )
}
