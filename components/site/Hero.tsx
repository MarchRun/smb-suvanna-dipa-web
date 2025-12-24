/**
 * Hero Section Component
 * Left: Large heading and subtitle
 * Right: Login form
 * Responsive: Stacks vertically on mobile
 */

import LoginForm from './LoginForm'

export default function Hero() {
    return (
        <section className="bg-white py-12 sm:py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left: Heading */}
                    <div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-4">
                            Lorem ipsum dolor sit amet, consectetur
                        </h1>
                        <p className="text-base sm:text-lg text-gray-700">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer venenatis iaculis porttitor.
                        </p>
                    </div>

                    {/* Right: Login Form */}
                    <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </section>
    )
}
