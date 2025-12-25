/**
 * Vision & Mission Component
 * 2-column layout (Visi left, Misi right)
 * Stacks vertically on mobile
 */

import Card from '@/components/shared/Card'

export default function VisionMission() {
    return (
        <section
            className="py-12 sm:py-16 md:py-20"
            style={{
                backgroundColor: 'var(--bg-primary)' // Orange in light, dark blue in dark
            }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {/* Visi */}
                    <Card>
                        <h3
                            className="text-2xl sm:text-3xl font-bold mb-4 text-center"
                            style={{ color: 'var(--primary-600)' }}
                        >
                            VISI
                        </h3>
                        <p
                            className="text-base sm:text-lg"
                            style={{ color: 'var(--neutral-800)' }}
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante.
                        </p>
                    </Card>

                    {/* Misi */}
                    <Card>
                        <h3
                            className="text-2xl sm:text-3xl font-bold mb-4 text-center"
                            style={{ color: 'var(--primary-600)' }}
                        >
                            MISI
                        </h3>
                        <p
                            className="text-base sm:text-lg"
                            style={{ color: 'var(--neutral-800)' }}
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante.
                        </p>
                    </Card>
                </div>
            </div>
        </section>
    )
}
