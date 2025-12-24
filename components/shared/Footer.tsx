/**
 * Shared Footer Component - Warm Sunny Theme
 * Using CSS variables for colors
 */

export default function Footer() {
    return (
        <footer
            className="border-t-2 border-orange-300 shadow-inner"
            style={{
                background: 'linear-gradient(to top, var(--primary-50), var(--accent-50))',
                color: 'var(--neutral-800)'
            }}
        >
            <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
                <div className="text-center">
                    <p
                        className="text-xl sm:text-2xl font-bold mb-2"
                        style={{ color: 'var(--primary-600)' }}
                    >
                        SMB Suvanna Dipa
                    </p>
                    <p className="text-sm sm:text-base opacity-80">
                        © {new Date().getFullYear()} Lorem ipsum dolor sit amet, consectetur adipiscing elit
                    </p>
                </div>
            </div>
        </footer>
    )
}
