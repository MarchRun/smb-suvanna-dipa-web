/**
 * Teacher Dashboard Stats Server Actions
 * Fetch real-time statistics from Supabase for teacher dashboard
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResponse } from '@/types'

export interface TeacherDashboardStats {
    className: string | null
    studentCount: number
}

/**
 * Get dashboard statistics for teacher
 * Shows the class they're teaching and student count
 */
export async function getTeacherDashboardStats(): Promise<ActionResponse<TeacherDashboardStats>> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        // Get current user from auth
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            throw new Error('User not authenticated')
        }

        // Get teacher's profile using their auth user id
        // Note: profiles.id is the same as auth.users.id (foreign key)
        // Use admin client to bypass RLS
        console.log('🔍 Teacher fetching stats for user ID:', user.id)

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single()

        if (profileError || !profile) {
            console.error('Profile error:', profileError)
            throw new Error('Profile not found')
        }

        console.log('✅ Profile found:', profile.id)

        // Get class where this teacher is the wali kelas (teacher_id references profiles.id)
        const { data: classData, error: classError } = await supabaseAdmin
            .from('classes')
            .select('id, name, teacher_id')
            .eq('teacher_id', profile.id)
            .single()

        if (classError) {
            // Teacher might not have a class assigned yet
            console.log('No class found for teacher:', classError)
            return {
                success: true,
                data: {
                    className: null,
                    studentCount: 0
                }
            }
        }

        // Count students in this class
        const { count: studentCount, error: countError } = await supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', classData.id)
            .eq('role', 'siswa')

        if (countError) {
            console.error('Student count error:', countError)
            throw countError
        }

        return {
            success: true,
            data: {
                className: classData.name || null,
                studentCount: studentCount || 0
            }
        }
    } catch (error) {
        console.error('Error fetching teacher dashboard stats:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data statistik',
            data: {
                className: null,
                studentCount: 0
            }
        }
    }
}
