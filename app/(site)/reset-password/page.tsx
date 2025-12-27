/**
 * Reset Password Page
 * User sets new password after clicking email link
 * Styled to match forgot password page with dark mode support
 */

'use client'

import { useState, useEffect } from 'react'
import ResetPasswordForm from '@/components/site/ResetPasswordForm'

export default function ResetPasswordPage() {
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

    return (
        <div
            className="flex items-center justify-center p-4"
            style={{
                backgroundColor: isDarkMode ? '#BAE6FD' : '#FFEFD5', // Sky Blue in dark, Cream in light
                minHeight: 'calc(100vh - 100px)' // Account for navbar
            }}
        >
            {/* Form Card - Already has its own styling */}
            <div className="w-full max-w-md animate-slideUpFade">
                <ResetPasswordForm />
            </div>
        </div>
    )
}
