/**
 * Reset Password Page
 * User sets new password after clicking email link
 */

import Card from '@/components/shared/Card'
import ResetPasswordForm from '@/components/site/ResetPasswordForm'

export const metadata = {
    title: 'Reset Password - SMB Suvanna Dipa',
    description: 'Buat password baru untuk akun Anda'
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            {/* Logo/Title */}
            <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                    SMB Suvanna Dipa
                </h1>
            </div>

            {/* Form Card */}
            <Card className="w-full max-w-md">
                <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-center">
                        Reset Password
                    </h2>

                    <ResetPasswordForm />
                </div>
            </Card>
        </div>
    )
}
