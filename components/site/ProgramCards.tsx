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
        <section className="bg-white py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-8 sm:mb-12">
                    Program Unggulan Kami
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {programs.map((program, index) => (
                        <Card key={index} className="text-center">
                            {/* Icon Placeholder */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-500 rounded-full"></div>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-black mb-2">
                                {program.title}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-700">
                                {program.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
