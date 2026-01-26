/**
 * Forgot Password Page
 * User can request password reset email
 * Styled to match login form design with cream background (light) / sky blue (dark)
 */

'use client'

import { useState, useEffect } from 'react'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
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
                backgroundImage: 'url(/images/smbsd-bg-hd.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                paddingTop: '80px' // Match Hero section
            }}
        >
            {/* Form Card - Already has its own styling */}
            <div className="w-full max-w-md animate-slideUpFade">
                <ForgotPasswordForm />
            </div>
        </div>
    )
}
