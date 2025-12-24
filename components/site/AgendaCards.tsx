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
        <section className="bg-white py-12 sm:py-16">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-4">
                    Agenda Tahunan Kegiatan SMB
                </h2>
                <p className="text-base sm:text-lg text-gray-700 text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer venenatis iaculis porttitor. In ut velit euismod, cursus lorem vel, aliquam erat. Donec ut pellentesque elit. Morbi ipsum nulla, porttitor lacinia feugiat vel, pharetra ac sem.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {agendas.map((agenda, index) => (
                        <Card key={index} className="text-center">
                            <p className="text-sm sm:text-base font-medium text-black">
                                {agenda}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
