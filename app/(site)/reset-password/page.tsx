/**
 * Reset Password Page
 * User sets new password after clicking email link
 * Styled to match login form design with cream background
 */

import ResetPasswordForm from '@/components/site/ResetPasswordForm'

export const metadata = {
    title: 'Reset Password - SMB Suvanna Dipa',
    description: 'Buat password baru untuk akun Anda'
}

export default function ResetPasswordPage() {
    return (
        <div
            className="flex items-center justify-center p-4"
            style={{
                backgroundColor: '#FFEFD5', // Papaya Whip (same as Program Unggulan)
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
