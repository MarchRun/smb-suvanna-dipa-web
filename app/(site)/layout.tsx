/**
 * Site Layout for Visitor Pages
 * Wraps all public-facing pages (/, /about, /activities, /contact)
 * Includes Navbar, Footer, and Page Tracker
 */

import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import PageTracker from '@/components/tracking/PageTracker'

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <PageTracker />
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}

