/**
 * Homepage (Visitor Landing Page)
 * Assembles all homepage sections
 */

import Hero from '@/components/site/Hero'
import AboutPreview from '@/components/site/AboutPreview'
import ProgramCards from '@/components/site/ProgramCards'
import CTASection from '@/components/site/CTASection'

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
