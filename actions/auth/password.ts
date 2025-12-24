/**
 * Password Management Server Actions
 * Handle forgot password and reset password flows
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import type { ActionResponse } from '@/types'

/**
 * Send password reset email
 * Always returns success (security best practice)
 */
export async function requestPasswordReset(email: string): Promise<ActionResponse> {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`
    })

    // Security: Always return success, don't reveal if email exists
    // This prevents email enumeration attacks
    return {
        success: true
    }
}

/**
 * Update user password
 * Called after user clicks reset link from email
 */
export async function resetPassword(newPassword: string): Promise<ActionResponse> {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) {
        return {
            success: false,
            error: error.message
        }
    }

    return {
        success: true
    }
}
