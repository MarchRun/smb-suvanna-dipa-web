/**
 * Enhanced Footer - Matching Navbar Theme
 * Simplified with animated gradient background
 */

export default function Footer() {
    return (
        <footer
            className="py-8 border-t"
            style={{
                backgroundColor: 'var(--accent-200)', // Solid warm yellow/orange
                borderColor: 'var(--primary-600)',
                boxShadow: '0 -4px 12px rgba(217, 87, 20, 0.20), 0 -2px 4px rgba(217, 87, 20, 0.12)'
            }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center">
                    <p
                        className="text-base font-bold"
                        style={{
                            color: 'var(--primary-900)',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        © {new Date().getFullYear()} SMB Suvanna Dipa. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
