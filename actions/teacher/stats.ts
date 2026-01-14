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

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single()

        if (profileError || !profile) {
            throw new Error('Profile not found')
        }


        // Try to get class data - check both methods:
        // 1. Teacher is wali kelas (classes.teacher_id)
        // 2. Teacher has class_id in their profile

        let classData: { id: number; name: string } | null = null

        // Method 1: Check if teacher is wali kelas
        const { data: waliklasData, error: waliklasError } = await supabaseAdmin
            .from('classes')
            .select('id, name')
            .eq('teacher_id', profile.id)
            .maybeSingle()

        if (waliklasData) {
            classData = waliklasData
        } else {
            // Method 2: Check if teacher has class_id in profile
            const { data: teacherProfile, error: teacherProfileError } = await supabaseAdmin
                .from('profiles')
                .select('class_id')
                .eq('id', profile.id)
                .single()

            if (teacherProfileError || !teacherProfile?.class_id) {
                return {
                    success: true,
                    data: {
                        className: null,
                        studentCount: 0
                    }
                }
            }

            // Get class data by class_id
            const { data: assignedClass, error: assignedClassError } = await supabaseAdmin
                .from('classes')
                .select('id, name')
                .eq('id', teacherProfile.class_id)
                .single()

            if (assignedClassError || !assignedClass) {
                return {
                    success: true,
                    data: {
                        className: null,
                        studentCount: 0
                    }
                }
            }

            classData = assignedClass
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
