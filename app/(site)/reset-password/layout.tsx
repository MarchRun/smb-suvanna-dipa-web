import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Reset Password - SMB Suvanna Dipa',
    description: 'Buat password baru untuk akun Anda'
}

export default function ResetPasswordLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
