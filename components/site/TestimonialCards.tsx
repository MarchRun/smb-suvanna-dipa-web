/**
 * Testimonial Cards Component
 * 3 testimonial cards in responsive grid
 */

import Card from '@/components/shared/Card'

export default function TestimonialCards() {
    const testimonials = [
        {
            name: 'Lorem Ipsum Dolor Sit Amet',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante.'
        },
        {
            name: 'Lorem Ipsum Dolor Sit Amet',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante.'
        },
        {
            name: 'Lorem Ipsum Dolor Sit Amet',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante.'
        }
    ]

    return (
        <section className="bg-white py-12 sm:py-16">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-4">
                    Testimoni
                </h2>
                <p className="text-base sm:text-lg text-gray-700 text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer venenatis iaculis porttitor. In ut velit euismod, cursus lorem vel, aliquam erat. Donec ut pellentesque elit. Morbi ipsum nulla, porttitor lacinia feugiat vel, pharetra ac sem.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index}>
                            <h3 className="text-lg sm:text-xl font-bold text-black mb-3">
                                {testimonial.name}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                {testimonial.text}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
