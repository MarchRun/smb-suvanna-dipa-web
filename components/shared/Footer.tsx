/**
 * Enhanced Footer - Matching Navbar Theme
 * Simplified with animated gradient background
 */

'use client'

import { useDarkMode } from '@/hooks/useDarkMode'
import { getCurrentYear } from '@/lib/utils/formatters'

export default function Footer() {
    const isDarkMode = useDarkMode()
    return (
        <footer
            className="py-12"
            style={{
                backgroundColor: '#1A1A1A', // Dark Gray / Black
                boxShadow: 'none'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                {/* Left: Copyright */}
                <div className="text-center md:text-left">
                    <p
                        className="text-base font-bold"
                        style={{
                            color: '#ffffff', // White text
                        }}
                    >
                        © {getCurrentYear()} SMB Suvanna Dipa. All rights reserved.
                    </p>
                </div>

                {/* Right: Navigation Links */}
                <div className="flex flex-row flex-wrap sm:flex-nowrap w-full sm:w-auto justify-between sm:justify-start gap-8 sm:gap-16 text-left">
                    {/* Menu Utama */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-[#E57526]">Menu</h3>
                        <a href="/" className="text-gray-300 hover:text-white transition-colors">Beranda</a>
                        <a href="/about" className="text-gray-300 hover:text-white transition-colors">Tentang</a>
                        <a href="/activities" className="text-gray-300 hover:text-white transition-colors">Aktivitas</a>
                        <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Kontak</a>
                    </div>

                    {/* Jelajahi */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-[#E57526]">Jelajahi</h3>
                        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-12 text-left">
                            <div className="flex flex-col gap-4">
                                <a href="/home" className="text-gray-300 hover:text-white transition-colors">Login</a>
                                <a href="/forgot-password" className="text-gray-300 hover:text-white transition-colors">Lupa Password</a>
                                <a href="/about#profile" className="text-gray-300 hover:text-white transition-colors">Profil</a>
                                <a href="/about#vision" className="text-gray-300 hover:text-white transition-colors">Visi & Misi</a>
                            </div>
                            <div className="flex flex-col gap-4">
                                <a href="/activities#agenda" className="text-gray-300 hover:text-white transition-colors">Agenda Tahunan</a>
                                <a href="/activities#gallery" className="text-gray-300 hover:text-white transition-colors">Galeri</a>
                                <a href="/activities#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimoni</a>
                                <a href="/contact#location" className="text-gray-300 hover:text-white transition-colors">Informasi Lengkap</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
