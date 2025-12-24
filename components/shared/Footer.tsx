/**
 * Shared Footer Component
 * Used across all portals (visitor, student, teacher, admin)
 * Wireframe style: grayscale, minimal animation
 */

export default function Footer() {
    return (
        <footer className="bg-gray-200 border-t-2 border-black mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <p className="text-center text-gray-700 text-sm">
                    © Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </p>
            </div>
        </footer>
    )
}
