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
        <section
            className="py-12 sm:py-16"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {contacts.map((contact, index) => (
                        <Card key={index} className="text-center">
                            {/* Icon with Gradient Background */}
                            <div
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg text-3xl sm:text-4xl"
                                style={{
                                    backgroundColor: 'var(--primary-500)', // Solid orange
                                    color: 'white'
                                }}
                            >
                                {contact.icon}
                            </div>

                            <h3
                                className="text-base sm:text-lg font-bold mb-2"
                                style={{ color: 'var(--neutral-900)' }}
                            >
                                {contact.title}
                            </h3>
                            <p
                                className="text-sm"
                                style={{ color: 'var(--neutral-700)' }}
                            >
                                {contact.info}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
