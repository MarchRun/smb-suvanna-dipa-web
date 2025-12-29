/**
 * Password Management Server Actions
 * Handle forgot password and reset password flows
 * Uses Resend for custom email delivery
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, generatePasswordResetEmail } from '@/lib/email/resend'
import { randomUUID } from 'crypto'
import type { ActionResponse } from '@/types'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const TOKEN_EXPIRY_HOURS = 1 // Token expires in 1 hour

/**
 * Request password reset - generates token and sends email via Resend
 * Always returns success (security best practice - prevents email enumeration)
 */
export async function requestPasswordReset(email: string): Promise<ActionResponse> {
    const supabase = await createClient()
    const adminClient = createAdminClient()
    const normalizedEmail = email.toLowerCase().trim()

    try {
        // 1. Check if user exists in auth.users via admin API
        const { data: authData, error: authError } = await adminClient.auth.admin.listUsers()

        if (authError) {
            console.error('Failed to list users:', authError)
            return { success: true } // Still return success for security
        }

        // Find user by email
        const user = authData.users.find(u => u.email?.toLowerCase() === normalizedEmail)

        // If user doesn't exist, still return success (security)
        if (!user) {
            console.log('Password reset requested for non-existent email:', normalizedEmail)
            return { success: true }
        }

        console.log('Found user for password reset:', user.id, user.email)

        // 2. Generate secure token
        const token = randomUUID()
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS)

        // 3. Invalidate any existing tokens for this user
        await adminClient
            .from('password_reset_tokens')
            .update({ used: true })
            .eq('user_id', user.id)
            .eq('used', false)

        // 4. Store new token in database
        const { error: tokenError } = await adminClient
            .from('password_reset_tokens')
            .insert({
                user_id: user.id,
                email: user.email,
                token: token,
                expires_at: expiresAt.toISOString()
            })

        if (tokenError) {
            console.error('Failed to create reset token:', tokenError)
            return { success: true } // Still return success for security
        }

        console.log('Created reset token for user:', user.id)

        // 5. Generate reset link
        const resetLink = `${APP_URL}/reset-password?token=${token}`

        // 6. Send email via Resend
        const userName = user.user_metadata?.name || user.user_metadata?.full_name || undefined
        const emailHtml = generatePasswordResetEmail(resetLink, userName)
        const emailResult = await sendEmail({
            to: user.email!,
            subject: 'Reset Password - SMB Suvanna Dipa',
            html: emailHtml
        })

        if (!emailResult.success) {
            console.error('Failed to send reset email:', emailResult.error)
        } else {
            console.log('Reset email sent successfully to:', user.email)
        }

        return { success: true }

    } catch (error) {
        console.error('Password reset error:', error)
        return { success: true } // Always return success for security
    }
}

/**
 * Reset password using token from email link
 * Validates token and updates user password
 */
export async function resetPassword(token: string, newPassword: string): Promise<ActionResponse> {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    try {
        // 1. Find and validate token
        const { data: tokenData, error: tokenError } = await adminClient
            .from('password_reset_tokens')
            .select('*')
            .eq('token', token)
            .eq('used', false)
            .single()

        if (tokenError || !tokenData) {
            return {
                success: false,
                error: 'Link reset password tidak valid atau sudah kadaluarsa'
            }
        }

        // 2. Check if token is expired
        const now = new Date()
        const expiresAt = new Date(tokenData.expires_at)

        if (now > expiresAt) {
            // Mark token as used
            await adminClient
                .from('password_reset_tokens')
                .update({ used: true })
                .eq('id', tokenData.id)

            return {
                success: false,
                error: 'Link reset password sudah kadaluarsa. Silakan minta link baru.'
            }
        }

        // 3. Update password via Supabase Auth Admin API
        const { error: updateError } = await adminClient.auth.admin.updateUserById(
            tokenData.user_id,
            { password: newPassword }
        )

        if (updateError) {
            console.error('Failed to update password:', updateError)
            return {
                success: false,
                error: 'Gagal mengubah password. Silakan coba lagi.'
            }
        }

        // 4. Mark token as used
        await adminClient
            .from('password_reset_tokens')
            .update({ used: true })
            .eq('id', tokenData.id)

        console.log('Password reset successful for user:', tokenData.user_id)

        return { success: true }

    } catch (error) {
        console.error('Reset password error:', error)
        return {
            success: false,
            error: 'Terjadi kesalahan. Silakan coba lagi.'
        }
    }
}

/**
 * Validate reset token (check if valid and not expired)
 * Used by frontend to show appropriate UI
 */
export async function validateResetToken(token: string): Promise<ActionResponse<{ valid: boolean; email?: string }>> {
    const adminClient = createAdminClient()

    try {
        const { data: tokenData, error } = await adminClient
            .from('password_reset_tokens')
            .select('email, expires_at, used')
            .eq('token', token)
            .single()

        if (error || !tokenData) {
            return {
                success: true,
                data: { valid: false }
            }
        }

        const now = new Date()
        const expiresAt = new Date(tokenData.expires_at)
        const isValid = !tokenData.used && now < expiresAt

        return {
            success: true,
            data: {
                valid: isValid,
                email: isValid ? tokenData.email : undefined
            }
        }

    } catch (error) {
        console.error('Token validation error:', error)
        return {
            success: true,
            data: { valid: false }
        }
    }
}
