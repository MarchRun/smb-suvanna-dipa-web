/**
 * Teacher Students Server Actions
 * Manage students in teacher's class
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResponse, Profile } from '@/types'

export interface StudentWithPoints extends Profile {
    points: number
}

/**
 * Get teacher's class ID
 */
async function getTeacherClassId(): Promise<{ classId: number | null; teacherId: string | null; error?: string }> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        return { classId: null, teacherId: null, error: 'User not authenticated' }
    }

    // Method 1: Check if teacher is wali kelas
    const { data: waliklasData } = await supabaseAdmin
        .from('classes')
        .select('id')
        .eq('teacher_id', user.id)
        .maybeSingle()

    if (waliklasData) {
        return { classId: waliklasData.id, teacherId: user.id }
    }

    // Method 2: Check teacher's class_id in profile
    const { data: teacherProfile } = await supabaseAdmin
        .from('profiles')
        .select('class_id')
        .eq('id', user.id)
        .single()

    if (teacherProfile?.class_id) {
        return { classId: teacherProfile.class_id, teacherId: user.id }
    }

    return { classId: null, teacherId: user.id, error: 'Teacher has no assigned class' }
}

/**
 * Get all students in teacher's class
 */
export async function getTeacherStudents(search?: string): Promise<ActionResponse<StudentWithPoints[]>> {
    const supabaseAdmin = createAdminClient()

    try {
        const { classId, error } = await getTeacherClassId()

        if (error || !classId) {
            return {
                success: true,
                data: [],
                error: error || 'No class assigned'
            }
        }

        let query = supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('class_id', classId)
            .eq('role', 'siswa')
            .order('full_name', { ascending: true })

        if (search) {
            query = query.ilike('full_name', `%${search}%`)
        }

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError

        return {
            success: true,
            data: (data || []).map(student => ({
                ...student,
                points: student.points || 0
            }))
        }
    } catch (error) {
        console.error('Error fetching students:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data siswa',
            data: []
        }
    }
}

/**
 * Get student by ID (only if in teacher's class)
 */
export async function getStudentById(studentId: string): Promise<ActionResponse<Profile>> {
    const supabaseAdmin = createAdminClient()

    try {
        const { classId, error } = await getTeacherClassId()

        if (error || !classId) {
            return { success: false, error: 'No class assigned' }
        }

        const { data, error: fetchError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', studentId)
            .eq('class_id', classId)
            .eq('role', 'siswa')
            .single()

        if (fetchError) {
            return { success: false, error: 'Siswa tidak ditemukan' }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Error fetching student:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data siswa'
        }
    }
}

/**
 * Give points to a student
 */
export async function givePoints(
    studentId: string,
    amount: number,
    reason: string
): Promise<ActionResponse<{ newPoints: number }>> {
    const supabaseAdmin = createAdminClient()

    try {
        const { classId, teacherId, error } = await getTeacherClassId()

        if (error || !classId || !teacherId) {
            return { success: false, error: 'No class assigned' }
        }

        // Verify student is in teacher's class
        const { data: student, error: studentError } = await supabaseAdmin
            .from('profiles')
            .select('id, points, class_id')
            .eq('id', studentId)
            .eq('class_id', classId)
            .eq('role', 'siswa')
            .single()

        if (studentError || !student) {
            return { success: false, error: 'Siswa tidak ditemukan di kelas Anda' }
        }

        const currentPoints = student.points || 0
        const newPoints = currentPoints + amount

        // Update student's points
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                points: newPoints,
                updated_at: new Date().toISOString()
            })
            .eq('id', studentId)

        if (updateError) throw updateError

        // Record in point_history
        const { error: historyError } = await supabaseAdmin
            .from('point_history')
            .insert({
                user_id: studentId,
                amount: amount,
                reason: reason,
                given_by: teacherId
            })

        if (historyError) {
            console.error('Error recording point history:', historyError)
            // Don't fail the whole operation if history fails
        }

        return {
            success: true,
            data: { newPoints }
        }
    } catch (error) {
        console.error('Error giving points:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal memberikan poin'
        }
    }
}

/**
 * Get teacher's class info
 */
export async function getTeacherClassInfo(): Promise<ActionResponse<{ className: string; classId: number }>> {
    const supabaseAdmin = createAdminClient()

    try {
        const { classId, error } = await getTeacherClassId()

        if (error || !classId) {
            return { success: false, error: error || 'No class assigned' }
        }

        const { data: classData, error: classError } = await supabaseAdmin
            .from('classes')
            .select('name')
            .eq('id', classId)
            .single()

        if (classError || !classData) {
            return { success: false, error: 'Class not found' }
        }

        return {
            success: true,
            data: {
                className: classData.name,
                classId
            }
        }
    } catch (error) {
        console.error('Error fetching class info:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data kelas'
        }
    }
}
