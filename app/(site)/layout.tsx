/**
 * Site Layout for Visitor Pages
 * Wraps all public-facing pages
 */

import { Navbar, Footer } from '@/components/shared/layout/Navigation'

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
