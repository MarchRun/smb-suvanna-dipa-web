/**
 * Quote Component
 * Displays a styled quote with attribution
 * Responsive text sizing
 */

export default function Quote() {
    return (
        <section className="bg-white py-12 sm:py-16">
            <div className="max-w-4xl mx-auto px-4">
                <blockquote className="text-center">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-4 italic">
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante."
                    </p>
                    <cite className="text-base sm:text-lg text-gray-700 not-italic font-medium">
                        -Lorem Ipsum Dolor Sit Amet-
                    </cite>
                </blockquote>
            </div>
        </section>
    )
}
