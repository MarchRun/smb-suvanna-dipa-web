/**
 * Get Current User Profile Server Action
 * Fetches the profile data for the currently authenticated user
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResponse } from '@/types'

export interface ProfileData {
    id: string
    full_name: string | null
    phone: string | null
    gender: 'Laki-laki' | 'Perempuan' | null
    birth_date: string | null
    address: string | null
    profile_picture: string | null
    role: 'admin' | 'pembina' | 'siswa'
}

/**
 * Get current user's profile data
 * Uses admin client to bypass RLS
 */
export async function getCurrentUserProfile(): Promise<ActionResponse<ProfileData>> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            throw new Error('User not authenticated')
        }

        // Fetch profile using admin client
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name, phone, gender, birth_date, address, profile_picture, role')
            .eq('id', user.id)
            .single()

        if (profileError || !profile) {
            console.error('Profile fetch error:', profileError)
            throw new Error('Profile not found')
        }

        return {
            success: true,
            data: profile as ProfileData
        }
    } catch (error) {
        console.error('Error fetching profile:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data profil'
        }
    }
}
