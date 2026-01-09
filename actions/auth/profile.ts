/**
 * Get current user profile
 * Uses admin client to bypass RLS issues
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResponse, Profile } from '@/types'

/**
 * Get the currently logged in user's profile
 * Uses admin client to bypass RLS
 */
export async function getCurrentUserProfile(): Promise<ActionResponse<Profile | null>> {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    try {
        // Get authenticated user (this doesn't need admin)
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return {
                success: false,
                error: 'User not authenticated',
                data: null
            }
        }

        // Fetch user profile using admin client to bypass RLS
        const { data: profile, error: profileError } = await adminSupabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileError) {
            console.error('Error fetching profile:', profileError)
            return {
                success: false,
                error: profileError.message,
                data: null
            }
        }

        return {
            success: true,
            data: profile
        }
    } catch (error) {
        console.error('Error in getCurrentUserProfile:', error)
        return {
            success: false,
            error: 'Gagal mengambil profil pengguna',
            data: null
        }
    }
}
