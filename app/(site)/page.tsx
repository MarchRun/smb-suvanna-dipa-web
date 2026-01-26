/**
 * Homepage (Visitor Landing Page)
 * Assembles all homepage sections
 */

import HomeHeroSection from '@/components/home/HomeHeroSection'
import HomeProgramsSection from '@/components/home/HomeProgramsSection'
import HomeAboutSection from '@/components/home/HomeAboutSection'
import HomeCTASection from '@/components/home/HomeCTASection'

export default function HomePage() {
    return (
        <>
            <HomeHeroSection />
            <HomeAboutSection />
            <HomeProgramsSection />
            <HomeCTASection />
        </>
    )
}
