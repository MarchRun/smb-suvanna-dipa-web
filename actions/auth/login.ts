/**
 * Login Server Action
 * Handles user authentication with Supabase
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isValidEmail, sanitizeHtml } from '@/lib/security/sanitize'
import { normalizeEmail } from '@/lib/utils'
import type { ActionResponse } from '@/types'

interface LoginData {
    email: string
    password: string
}

export async function login(data: LoginData): Promise<ActionResponse<{ role: string }>> {
    const supabase = await createClient()

    // Sanitize and validate input
    const email = normalizeEmail(data.email)

    if (!isValidEmail(email)) {
        return {
            success: false,
            error: 'Format email tidak valid'
        }
    }

    if (!data.password || data.password.length < 6) {
        return {
            success: false,
            error: 'Password minimal 6 karakter'
        }
    }

    // Attempt to sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: data.password,
    })

    if (authError) {
        return {
            success: false,
            error: authError.message
        }
    }

    if (!authData.user) {
        return {
            success: false,
            error: 'Login failed. Please try again.'
        }
    }

    // Use service role client to fetch profile (bypass RLS)
    const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile, error: profileError } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()

    if (profileError || !profile) {
        // If profile doesn't exist, sign out and return error
        await supabase.auth.signOut()
        return {
            success: false,
            error: 'User profile not found. Please contact administrator.'
        }
    }

    // Revalidate layout to update auth state
    revalidatePath('/', 'layout')

    return {
        success: true,
        data: {
            role: profile.role
        }
    }
}

export async function logout(): Promise<ActionResponse> {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return {
            success: false,
            error: error.message
        }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
