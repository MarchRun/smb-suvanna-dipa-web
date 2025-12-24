/**
 * About Page
 * Displays SMB Suvanna Dipa profile, vision, mission, and inspirational quote
 */

import PageHeader from '@/components/shared/PageHeader'
import Placeholder from '@/components/shared/Placeholder'
import VisionMission from '@/components/site/VisionMission'
import Quote from '@/components/site/Quote'

export default function AboutPage() {
    return (
        <>
            {/* Page Header */}
            <section className="bg-white py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <PageHeader
                        title="Tentang SMB Suvanna Dipa"
                        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante. Aliquam in mauris feugiat, viverra enim quis, lobortis nunc. Maecenas ut tristique lacus, eu elementum ante."
                    />

                    {/* Image Placeholder */}
                    <div className="mb-8 sm:mb-12">
                        <Placeholder text="GAMBAR" aspectRatio="16:9" />
                    </div>

                    {/* Content Paragraph */}
                    <div className="prose max-w-none">
                        <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at tellus eget eros hendrerit mattis. Pellentesque orci magna, dignissim ut fringilla non, imperdiet et arcu. Fusce cursus, orci eu mollis posuere, augue ipsum dignissim enim, sit amet mollis ipsum nisl eu ante. Aliquam in mauris feugiat, viverra enim quis, lobortis nunc. Maecenas ut tristique lacus, eu elementum ante. Integer sodio felis elit, vulgutate isneret nulla euismod, consectetur et massa sed. Integer euismod vulputate lacerat, placerat at sollicitudin in, igestas at odio. Quisque scelerisque elit amet risus porttitor. In imperdiet et fringilla. Donec condimentum pretium vitae augue laoreet lacus eu condimentum. Non risus vinia, mauris eros in sollicitudin sem. Nunc duis quam. Donec cursus lobortis tincus. Phasellus ac molestie nisl, a sollicitudin dolor.
                        </p>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <VisionMission />

            {/* Quote */}
            <Quote />
        </>
    )
}
