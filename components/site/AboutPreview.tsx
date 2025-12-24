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
        <section className="bg-gray-600 py-12 sm:py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                    Mengenal SMB Suvanna Dipa
                </h2>
                <p className="text-base sm:text-lg text-gray-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer venenatis iaculis porttitor. In ut velit euismod, cursus lorem vel, aliquam erat. Donec ut pellentesque elit. Morbi ipsum nulla, porttitor lacinia feugiat vel, pharetra ac sem.
                </p>
                <Button variant="secondary" onClick={() => router.push('/about')}>
                    Selengkapnya Tentang Kami
                </Button>
            </div>
        </section>
    )
}
