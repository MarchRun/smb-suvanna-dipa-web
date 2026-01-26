/**
 * Forgot Password Form Component
 * Allows users to request password reset email
 * Styled to match LoginForm design with dark mode support
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import { requestPasswordReset } from '@/actions/auth/password'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const isDarkMode = useDarkMode()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await requestPasswordReset(email)

            if (result.success) {
                setSuccess(true)
            } else {
                setError(result.error || 'Failed to send reset email')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Dynamic colors based on dark mode
    const primaryColor = isDarkMode ? 'var(--primary-600)' : '#E57526'
    const borderGlow = 'none'

    if (success) {
        return (
            <div
                className="p-6 sm:p-8 rounded-xl border-4 transition-all duration-300"
                style={{
                    backgroundColor: 'white',
                    borderColor: primaryColor,
                    boxShadow: borderGlow
                }}
            >
                <div className="space-y-4 sm:space-y-6 text-center">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                            style={{
                                backgroundColor: '#d1fae5',
                                border: '3px solid #10b981'
                            }}
                        >
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="space-y-2">
                        <h3
                            className="text-lg sm:text-xl font-bold"
                            style={{ color: primaryColor }}
                        >
                            Email Terkirim!
                        </h3>
                        <p
                            className="text-sm sm:text-base leading-relaxed font-medium"
                            style={{ color: primaryColor }}
                        >
                            Jika akun dengan email tersebut terdaftar, Anda akan menerima link reset password.
                            Silakan cek inbox atau folder spam Anda.
                        </p>
                    </div>

                    {/* Back to Login */}
                    <Link
                        href="/"
                        className="inline-block text-sm sm:text-base font-bold hover:underline transition-all"
                        style={{ color: primaryColor }}
                    >
                        ← Kembali ke Halaman Beranda
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div
            className="p-6 sm:p-8 rounded-xl border-4 transition-all duration-300 hover:scale-105"
            style={{
                backgroundColor: 'white',
                borderColor: primaryColor,
                boxShadow: borderGlow
            }}
        >
            <h2
                className="text-2xl sm:text-3xl font-bold text-center mb-6"
                style={{ color: primaryColor }}
            >
                Lupa Password?
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Helper Text */}
                <p
                    className="text-sm sm:text-base leading-relaxed font-medium"
                    style={{ color: primaryColor }}
                >
                    Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
                </p>

                {/* Error Message */}
                {error && (
                    <div
                        className="border-2 px-4 py-3 rounded-lg"
                        style={{
                            backgroundColor: '#fee2e2',
                            borderColor: '#dc2626',
                            color: '#991b1b'
                        }}
                    >
                        <p className="text-sm font-semibold">{error}</p>
                    </div>
                )}

                {/* Email Input */}
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    disabled={loading}
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    noShadow
                >
                    {loading ? 'Mengirim...' : 'Kirim Link ke Email'}
                </Button>

                {/* Back to Login Link */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="text-sm sm:text-base font-semibold hover:underline transition-colors"
                        style={{ color: primaryColor }}
                    >
                        ← Kembali ke Halaman Beranda
                    </Link>
                </div>
            </form>
        </div>
    )
}
