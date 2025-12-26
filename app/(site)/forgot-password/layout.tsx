import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Lupa Password - SMB Suvanna Dipa',
    description: 'Reset password akun Anda'
}

export default function ForgotPasswordLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
