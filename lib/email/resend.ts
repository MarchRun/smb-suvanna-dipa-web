/**
 * Resend Email Service
 * Handles sending emails via Resend API
 * Used for password reset and other transactional emails
 */

import { Resend } from 'resend'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Email sender configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const FROM_NAME = 'SMB Suvanna Dipa'

interface SendEmailParams {
    to: string
    subject: string
    html: string
}

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html }: SendEmailParams) {
    try {
        const { data, error } = await resend.emails.send({
            from: `${FROM_NAME} <${FROM_EMAIL}>`,
            to: [to],
            subject,
            html,
        })

        if (error) {
            console.error('Resend error:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Email send error:', error)
        return { success: false, error: 'Failed to send email' }
    }
}

/**
 * Generate password reset email HTML
 * Styled with SMB Suvanna Dipa branding
 */
export function generatePasswordResetEmail(resetLink: string, userName?: string): string {
    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - SMB Suvanna Dipa</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFEFD5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(124, 45, 18, 0.15);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #7c2d12; border-radius: 16px 16px 0 0; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: 1px;">
                                SMB SUVANNA DIPA
                            </h1>
                            <p style="margin: 8px 0 0 0; color: #fcd34d; font-size: 14px;">
                                Saddha • Sila • Sippa
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px 0; color: #7c2d12; font-size: 24px; font-weight: 700;">
                                Reset Password
                            </h2>
                            
                            <p style="margin: 0 0 24px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                                ${userName ? `Halo <strong>${userName}</strong>,` : 'Halo,'}
                            </p>
                            
                            <p style="margin: 0 0 24px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                                Kami menerima permintaan untuk mereset password akun Anda di SMB Suvanna Dipa. 
                                Klik tombol di bawah ini untuk membuat password baru:
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td align="center" style="padding: 16px 0 32px 0;">
                                        <a href="${resetLink}" 
                                           style="display: inline-block; padding: 16px 40px; background-color: #ea580c; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 8px; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4);">
                                            Reset Password Saya
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                Link ini akan kadaluarsa dalam <strong>1 jam</strong>. Jika Anda tidak meminta reset password, 
                                abaikan email ini dan password Anda akan tetap aman.
                            </p>
                            
                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                Jika tombol di atas tidak berfungsi, salin dan tempel link berikut ke browser Anda:
                            </p>
                            <p style="margin: 8px 0 0 0; word-break: break-all; color: #ea580c; font-size: 14px;">
                                ${resetLink}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #fef3c7; border-radius: 0 0 16px 16px; text-align: center;">
                            <p style="margin: 0; color: #7c2d12; font-size: 14px; font-weight: 600;">
                                © ${new Date().getFullYear()} SMB Suvanna Dipa
                            </p>
                            <p style="margin: 8px 0 0 0; color: #92400e; font-size: 12px;">
                                Jl. Basuki Rahmat No.14, Gedong Pakuon, Teluk Betung Selatan, Bandar Lampung
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim()
}
