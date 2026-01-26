/**
 * Reset Password Page
 * Handles password reset from email link
 * Extracts token from URL and passes to form
 */

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import Link from 'next/link'
import { validateResetToken } from '@/actions/auth/password'

function ResetPasswordContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [isValidating, setIsValidating] = useState(true)
    const [isValid, setIsValid] = useState(false)
    const [userEmail, setUserEmail] = useState<string | undefined>()
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

    // Validate token on mount
    useEffect(() => {
        async function checkToken() {
            if (!token) {
                setIsValidating(false)
                setIsValid(false)
                return
            }

            try {
                const result = await validateResetToken(token)
                if (result.success && result.data) {
                    setIsValid(result.data.valid)
                    setUserEmail(result.data.email)
                }
            } catch (error) {
                console.error('Token validation error:', error)
                setIsValid(false)
            } finally {
                setIsValidating(false)
            }
        }

        checkToken()
    }, [token])

    // Dynamic colors
    const bgColor = isDarkMode ? '#BAE6FD' : '#FFEFD5'
    const primaryColor = isDarkMode ? 'var(--primary-600)' : 'var(--primary-900)'
    const borderGlow = isDarkMode
        ? '0 0 20px rgba(252, 211, 77, 0.8), 0 4px 15px rgba(249, 115, 22, 0.4)'
        : '0 0 30px rgba(124, 45, 18, 0.6)'

    // Loading state
    if (isValidating) {
        return (
            <div
                className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4"
                style={{
                    backgroundImage: 'url(/images/smbsd-bg-hd.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div
                    className="p-8 rounded-xl shadow-2xl border-4 text-center"
                    style={{
                        backgroundColor: 'white',
                        borderColor: primaryColor,
                        boxShadow: borderGlow
                    }}
                >
                    <div className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full mx-auto mb-4"
                        style={{ borderColor: primaryColor, borderTopColor: 'transparent' }}
                    />
                    <p style={{ color: primaryColor }} className="font-bold">
                        Memvalidasi link...
                    </p>
                </div>
            </div>
        )
    }

    // Invalid or missing token
    if (!token || !isValid) {
        return (
            <div
                className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4"
                style={{
                    backgroundImage: 'url(/images/smbsd-bg-hd.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div
                    className="p-8 rounded-xl shadow-2xl border-4 text-center max-w-md"
                    style={{
                        backgroundColor: 'white',
                        borderColor: primaryColor,
                        boxShadow: borderGlow
                    }}
                >
                    {/* Error Icon */}
                    <div className="flex justify-center mb-4">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#fee2e2', border: '3px solid #dc2626' }}
                        >
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
                        Link Tidak Valid
                    </h2>
                    <p className="text-sm mb-6" style={{ color: primaryColor }}>
                        Link reset password tidak valid atau sudah kadaluarsa. Silakan minta link baru.
                    </p>

                    <Link
                        href="/forgot-password"
                        className="inline-block px-6 py-3 rounded-lg font-bold text-white transition-all hover:scale-105"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Minta Link Baru
                    </Link>
                </div>
            </div>
        )
    }

    // Valid token - show reset form
    return (
        <div
            className="flex items-center justify-center px-4 py-8"
            style={{
                backgroundImage: 'url(/images/smbsd-bg-hd.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                paddingTop: '80px'
            }}
        >
            <div className="w-full max-w-md">
                <ResetPasswordForm token={token} email={userEmail} />
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[calc(100vh-88px)] flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
