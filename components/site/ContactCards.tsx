/**
 * Contact Cards Component
 * 4 contact information cards with icon placeholders
 * Responsive: 4 columns desktop, 2 columns tablet, 1 column mobile
 */

import Card from '@/components/shared/Card'

export default function ContactCards() {
    const contacts = [
        {
            icon: '📍',
            title: 'Alamat',
            info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        {
            icon: '📞',
            title: 'Telepon',
            info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        {
            icon: '✉️',
            title: 'Email',
            info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        {
            icon: '📱',
            title: 'Instagram',
            info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        }
    ]

    return (
        <section className="bg-white py-12 sm:py-16">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {contacts.map((contact, index) => (
                        <Card key={index} className="text-center">
                            {/* Icon Placeholder - Circle */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-500 rounded-full"></div>
                            </div>

                            <h3 className="text-base sm:text-lg font-bold text-black mb-2">
                                {contact.title}
                            </h3>
                            <p className="text-sm text-gray-700">
                                {contact.info}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
