/**
 * Homepage (Visitor Landing Page)
 * Assembles all homepage sections
 */

import Hero from '@/components/home/Hero'
import AboutPreview from '@/components/home/AboutPreview'
import ProgramCards from '@/components/home/ProgramCards'
import CTASection from '@/components/home/CTASection'

export default function HomePage() {
    return (
        <>
            <Hero />
            <AboutPreview />
            <ProgramCards />
            <CTASection />
        </>
    )
}
