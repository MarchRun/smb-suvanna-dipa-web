/**
 * Program Cards Section
 * 3 cards showcasing programs
 * Responsive: 1 column mobile, 3 columns desktop
 */

import Card from '@/components/shared/Card'

export default function ProgramCards() {
    const programs = [
        {
            title: 'Lorem ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        {
            title: 'Lorem ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        {
            title: 'Lorem ipsum',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        }
    ]

    return (
        <section
            className="py-12 sm:py-16 md:py-20"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12"
                    style={{ color: 'var(--neutral-900)' }}
                >
                    Program Unggulan Kami
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {programs.map((program, index) => (
                        <Card key={index} className="text-center">
                            {/* Icon with Gradient Background */}
                            <div
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                                style={{
                                    backgroundColor: 'var(--primary-500)', // Solid orange
                                    color: 'white'
                                }}
                            >
                                <div
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                                    style={{ backgroundColor: 'var(--bg-primary)' }}
                                ></div>
                            </div>

                            <h3
                                className="text-lg sm:text-xl font-bold mb-2"
                                style={{ color: 'var(--neutral-900)' }}
                            >
                                {program.title}
                            </h3>
                            <p
                                className="text-sm sm:text-base"
                                style={{ color: 'var(--neutral-700)' }}
                            >
                                {program.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
