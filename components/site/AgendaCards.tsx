/**
 * Agenda Cards Component
 * Displays 4 agenda items in horizontal scrollable layout
 * Responsive: 4 columns desktop, 2 columns tablet, 1 column mobile
 */

import Card from '@/components/shared/Card'

export default function AgendaCards() {
    const agendas = [
        'Lorem Ipsum Dolor Sit Amet',
        'Lorem Ipsum Dolor Sit Amet',
        'Lorem Ipsum Dolor Sit Amet',
        'Lorem Ipsum Dolor Sit Amet'
    ]

    return (
        <section
            className="py-12 sm:py-16"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4"
                    style={{ color: 'var(--neutral-900)' }}
                >
                    Agenda Tahunan Kegiatan SMB
                </h2>
                <p
                    className="text-base sm:text-lg text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
                    style={{ color: 'var(--neutral-700)' }}
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer venenatis iaculis porttitor. In ut velit euismod, cursus lorem vel, aliquam erat. Donec ut pellentesque elit. Morbi ipsum nulla, porttitor lacinia feugiat vel, pharetra ac sem.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {agendas.map((agenda, index) => (
                        <Card key={index} className="text-center">
                            <p
                                className="text-sm sm:text-base font-medium"
                                style={{ color: 'var(--neutral-900)' }}
                            >
                                {agenda}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
