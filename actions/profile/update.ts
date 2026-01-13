/**
 * Profile Update Server Action
 * Updates user profile information (non-sensitive fields only)
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResponse } from '@/types'

export interface ProfileUpdateData {
    full_name?: string
    phone?: string
    gender?: 'Laki-laki' | 'Perempuan'
    birth_date?: string // ISO date string
    address?: string
    profile_picture?: string
}

/**
 * Update current user's profile
 * Uses admin client to bypass RLS for update operation
 */
export async function updateProfile(data: ProfileUpdateData): Promise<ActionResponse<void>> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            throw new Error('User not authenticated')
        }

        // Validate input
        if (data.gender && !['Laki-laki', 'Perempuan'].includes(data.gender)) {
            throw new Error('Invalid gender value')
        }

        // Update profile using admin client
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                full_name: data.full_name,
                phone: data.phone,
                gender: data.gender,
                birth_date: data.birth_date,
                address: data.address,
                profile_picture: data.profile_picture,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (updateError) {
            console.error('Profile update error:', updateError)
            throw updateError
        }

        return {
            success: true,
            data: undefined
        }
    } catch (error) {
        console.error('Error updating profile:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengupdate profil'
        }
    }
}
