/**
 * Quote Component
 * Displays a styled quote with attribution
 * Responsive text sizing
 */

export default function Quote() {
    return (
        <section
            className="py-12 sm:py-16"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
            <div className="max-w-4xl mx-auto px-4">
                <blockquote className="text-center">
                    <p
                        className="text-lg sm:text-xl md:text-2xl font-bold mb-4 italic"
                        style={{ color: 'var(--neutral-900)' }}
                    >
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante."
                    </p>
                    <cite
                        className="text-base sm:text-lg not-italic font-medium"
                        style={{ color: 'var(--neutral-700)' }}
                    >
                        -Lorem Ipsum Dolor Sit Amet-
                    </cite>
                </blockquote>
            </div>
        </section>
    )
}
