/**
 * Forgot Password Form Component
 * Allows users to request password reset email
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import { requestPasswordReset } from '@/actions/auth/password'

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

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

    if (success) {
        return (
            <div className="space-y-4 sm:space-y-6 text-center">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Success Message */}
                <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-semibold">Email Terkirim!</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        Jika akun dengan email tersebut terdaftar, Anda akan menerima link reset password.
                        Silakan cek inbox atau folder spam Anda.
                    </p>
                </div>

                {/* Back to Login */}
                <Link
                    href="/"
                    className="inline-block text-sm sm:text-base text-gray-700 hover:text-black font-medium transition-colors"
                >
                    ← Kembali ke Halaman Beranda
                </Link>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Helper Text */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
            </p>

            {/* Error Message */}
            {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded text-sm sm:text-base text-red-700">
                    {error}
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
                variant="primary"
                className="w-full"
                disabled={loading}
            >
                {loading ? 'Mengirim...' : 'Kirim Link ke Email'}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center">
                <Link
                    href="/"
                    className="text-sm sm:text-base text-gray-700 hover:text-black transition-colors"
                >
                    ← Kembali ke Halaman Beranda
                </Link>
            </div>
        </form>
    )
}
