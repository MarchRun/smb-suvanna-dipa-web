/**
 * Student Schedule Server Actions
 * Read-only schedule viewing for students
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResponse, Schedule } from '@/types'

/**
 * Get student's class ID from their profile
 */
async function getStudentClassId(): Promise<{ classId: number | null; error?: string }> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        return { classId: null, error: 'User not authenticated' }
    }

    // Get student's class_id from profile
    const { data: studentProfile } = await supabaseAdmin
        .from('profiles')
        .select('class_id')
        .eq('id', user.id)
        .eq('role', 'siswa')
        .single()

    if (!studentProfile?.class_id) {
        return { classId: null, error: 'Student has no assigned class' }
    }

    return { classId: studentProfile.class_id }
}

/**
 * Get all schedules for student's class with optional month/year filter
 */
export async function getStudentSchedules(
    month?: number,
    year?: number
): Promise<ActionResponse<Schedule[]>> {
    const supabaseAdmin = createAdminClient()

    try {
        const { classId, error } = await getStudentClassId()

        if (error || !classId) {
            return {
                success: true,
                data: [],
                error: error || 'No class assigned'
            }
        }

        let query = supabaseAdmin
            .from('schedule')
            .select('*')
            .eq('class_id', classId)
            .order('event_date', { ascending: true })

        // Apply month/year filter if provided
        if (month !== undefined && year !== undefined) {
            const startDate = new Date(year, month - 1, 1)
            const endDate = new Date(year, month, 0, 23, 59, 59)

            query = query
                .gte('event_date', startDate.toISOString())
                .lte('event_date', endDate.toISOString())
        }

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error('Error fetching schedules:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data jadwal',
            data: []
        }
    }
}

/**
 * Get schedule by ID (only if belongs to student's class)
 */
export async function getStudentScheduleById(scheduleId: number): Promise<ActionResponse<Schedule>> {
    const supabaseAdmin = createAdminClient()

    try {
        const { classId, error } = await getStudentClassId()

        if (error || !classId) {
            return { success: false, error: 'No class assigned' }
        }

        const { data, error: fetchError } = await supabaseAdmin
            .from('schedule')
            .select('*')
            .eq('id', scheduleId)
            .eq('class_id', classId)
            .single()

        if (fetchError) {
            return { success: false, error: 'Jadwal tidak ditemukan' }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Error fetching schedule:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data jadwal'
        }
    }
}
