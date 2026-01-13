/**
 * Student Dashboard Stats Server Actions
 * Fetch real-time statistics from Supabase for student dashboard
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResponse } from '@/types'

export interface StudentDashboardStats {
    className: string | null
    teacherName: string | null
}

/**
 * Get dashboard statistics for student
 * Shows the class they're in and their wali kelas
 */
export async function getStudentDashboardStats(): Promise<ActionResponse<StudentDashboardStats>> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        // Get current user from auth
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            throw new Error('User not authenticated')
        }

        // Get student's profile using their auth user id
        // Note: profiles.id is the same as auth.users.id (foreign key)
        // Use admin client to bypass RLS
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id, class_id')
            .eq('id', user.id)
            .single()

        if (profileError || !profile) {
            console.error('Profile error:', profileError)
            throw new Error('Profile not found')
        }

        // If student doesn't have a class assigned
        if (!profile.class_id) {
            return {
                success: true,
                data: {
                    className: null,
                    teacherName: null
                }
            }
        }

        // Get class data with teacher info
        // teacher_id in classes references profiles(id)
        // Use actual constraint name: fk_classes_teacher
        const { data: classData, error: classError } = await supabaseAdmin
            .from('classes')
            .select(`
                id,
                name,
                teacher:profiles!fk_classes_teacher(full_name)
            `)
            .eq('id', profile.class_id)
            .single()

        if (classError) {
            console.error('Class fetch error:', classError)
            throw classError
        }

        // Extract teacher data - Supabase returns it as an object when using single()
        const teacherData = Array.isArray(classData.teacher)
            ? classData.teacher[0] || null
            : classData.teacher || null

        return {
            success: true,
            data: {
                className: classData.name || null,
                teacherName: teacherData?.full_name || null
            }
        }
    } catch (error) {
        console.error('Error fetching student dashboard stats:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data statistik',
            data: {
                className: null,
                teacherName: null
            }
        }
    }
}
