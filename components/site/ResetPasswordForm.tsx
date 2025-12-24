/**
 * Reset Password Form Component
 * Allows users to set new password after clicking email link
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function ResetPasswordForm() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const passwordStrength = password ? calculatePasswordStrength(password) : null
    const passwordsMatch = password === confirmPassword && confirmPassword !== ''

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
            const result = await resetPassword(password)

            if (result.success) {
                // Redirect to homepage with success message
                router.push('/?reset=success')
            } else {
                setError(result.error || 'Gagal mereset password')
            }
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Helper Text */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Masukkan password baru Anda. Pastikan password minimal 8 karakter.
            </p>

            {/* Error Message */}
            {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded text-sm sm:text-base text-red-700">
                    {error}
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
                        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
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
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
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
                variant="primary"
                className="w-full"
                disabled={loading || !passwordsMatch}
            >
                {loading ? 'Mereset Password...' : 'Reset Password'}
            </Button>
        </form>
    )
}
