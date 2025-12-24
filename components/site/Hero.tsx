/**
 * Hero Section Component - VIBRANT Warm Sunny Theme
 * Strong orange gradient background
 */

import LoginForm from './LoginForm'

export default function Hero() {
    return (
        <section
            className="py-16 sm:py-20 md:py-24"
            style={{
                background: 'linear-gradient(135deg, var(--primary-300) 0%, var(--accent-200) 50%, var(--primary-400) 100%)'
            }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left: Heading */}
                    <div>
                        <h1
                            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 drop-shadow-sm"
                            style={{ color: 'var(--primary-900)' }}
                        >
                            Lorem ipsum dolor sit amet, consectetur
                        </h1>
                        <p
                            className="text-lg sm:text-xl font-medium"
                            style={{ color: 'var(--neutral-900)' }}
                        >
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
