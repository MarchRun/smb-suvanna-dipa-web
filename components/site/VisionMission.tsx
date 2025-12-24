/**
 * Vision & Mission Component
 * 2-column layout (Visi left, Misi right)
 * Stacks vertically on mobile
 */

import Card from '@/components/shared/Card'

export default function VisionMission() {
    return (
        <section className="bg-gray-600 py-12 sm:py-16">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {/* Visi */}
                    <Card className="bg-gray-500 border-gray-600">
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
                            VISI
                        </h3>
                        <p className="text-base sm:text-lg text-gray-100">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante.
                        </p>
                    </Card>

                    {/* Misi */}
                    <Card className="bg-gray-500 border-gray-600">
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
                            MISI
                        </h3>
                        <p className="text-base sm:text-lg text-gray-100">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante.
                        </p>
                    </Card>
                </div>
            </div>
        </section>
    )
}
