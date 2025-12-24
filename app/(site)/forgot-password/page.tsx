/**
 * Forgot Password Page
 * User can request password reset email
 */

import Card from '@/components/shared/Card'
import ForgotPasswordForm from '@/components/site/ForgotPasswordForm'

export const metadata = {
    title: 'Lupa Password - SMB Suvanna Dipa',
    description: 'Reset password akun Anda'
}

export default function ForgotPasswordPage() {
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
                        Lupa Password?
                    </h2>

                    <ForgotPasswordForm />
                </div>
            </Card>
        </div>
    )
}
