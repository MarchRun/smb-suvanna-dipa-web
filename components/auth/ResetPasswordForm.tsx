/**
 * Reset Password Form Component
 * Allows users to set new password after clicking email link
 * Styled to match LoginForm and ForgotPasswordForm with dark mode support
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import { resetPassword } from '@/actions/auth/password'

// Password strength calculator
function calculatePasswordStrength(password: string): { score: number; label: string; color: string } {
    let score = 0

    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 2) return { score, label: 'Lemah', color: 'bg-red-500' }
    if (score <= 4) return { score, label: 'Sedang', color: 'bg-yellow-500' }
    return { score, label: 'Kuat', color: 'bg-green-500' }
}

interface ResetPasswordFormProps {
    token: string
    email?: string
}

export default function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Dark mode detection
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
        checkDarkMode()
        const observer = new MutationObserver(checkDarkMode)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })
        return () => observer.disconnect()
    }, [])

    const passwordStrength = password ? calculatePasswordStrength(password) : null
    const passwordsMatch = password === confirmPassword && confirmPassword !== ''

    // Dynamic colors based on dark mode
    const primaryColor = isDarkMode ? 'var(--primary-600)' : 'var(--primary-900)'
    const borderGlow = isDarkMode
        ? '0 0 20px rgba(252, 211, 77, 0.8), 0 4px 15px rgba(249, 115, 22, 0.4)'
        : '0 0 30px rgba(124, 45, 18, 0.6)'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (password.length < 8) {
            setError('Password harus minimal 8 karakter')
            return
        }

        if (password !== confirmPassword) {
            setError('Password tidak cocok')
            return
        }

        setLoading(true)

        try {
            const result = await resetPassword(token, password)

            if (result.success) {
                setSuccess(true)
                // Redirect to homepage after 3 seconds
                setTimeout(() => {
                    router.push('/')
                }, 3000)
            } else {
                setError(result.error || 'Gagal mereset password')
            }
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setLoading(false)
        }
    }

    // Success state
    if (success) {
        return (
            <div
                className="p-6 sm:p-8 rounded-xl shadow-2xl border-4 transition-all duration-300"
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
                            Password Berhasil Direset!
                        </h3>
                        <p
                            className="text-sm sm:text-base leading-relaxed font-medium"
                            style={{ color: primaryColor }}
                        >
                            Password Anda telah berhasil diubah. Anda akan dialihkan ke halaman utama dalam beberapa detik...
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
            className="p-6 sm:p-8 rounded-xl shadow-2xl border-4 transition-all duration-300 hover:scale-105"
            style={{
                backgroundColor: 'white',
                borderColor: primaryColor,
                boxShadow: borderGlow
            }}
        >
            <h2
                className="text-2xl sm:text-3xl font-bold text-center mb-4"
                style={{ color: primaryColor }}
            >
                Reset Password
            </h2>

            {/* Show email if available */}
            {email && (
                <p className="text-center text-sm mb-4" style={{ color: primaryColor }}>
                    Reset password untuk: <strong>{email}</strong>
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Helper Text */}
                <p
                    className="text-sm sm:text-base leading-relaxed font-medium"
                    style={{ color: primaryColor }}
                >
                    Masukkan password baru Anda. Pastikan password minimal 8 karakter.
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

                {/* Password Input */}
                <div className="space-y-2">
                    <div className="relative">
                        <Input
                            label="Password Baru"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimal 8 karakter"
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 transition-colors"
                            style={{ color: primaryColor }}
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {passwordStrength && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${passwordStrength.color} transition-all`}
                                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs sm:text-sm font-medium">{passwordStrength.label}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                    <Input
                        label="Konfirmasi Password Baru"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ketik ulang password"
                        required
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-9 transition-colors"
                        style={{ color: primaryColor }}
                    >
                        {showConfirmPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>

                    {/* Password Match Indicator */}
                    {confirmPassword && (
                        <div className="mt-1 text-xs sm:text-sm">
                            {passwordsMatch ? (
                                <span className="text-green-600 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Password cocok
                                </span>
                            ) : (
                                <span className="text-red-600 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    Password tidak cocok
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    fullWidth
                    disabled={loading || !passwordsMatch}
                    noShadow
                >
                    {loading ? 'Mereset Password...' : 'Reset Password'}
                </Button>
            </form>
        </div>
    )
}
