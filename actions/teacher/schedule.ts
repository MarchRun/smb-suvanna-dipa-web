/**
 * Teacher Schedule Server Actions
 * CRUD operations for class schedule/events
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResponse, Schedule } from '@/types'

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
 * Get all schedules for teacher's class with optional month/year filter
 */
export async function getTeacherSchedules(
    month?: number,
    year?: number
): Promise<ActionResponse<Schedule[]>> {
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
 * Get schedule by ID (only if belongs to teacher's class)
 */
export async function getScheduleById(scheduleId: number): Promise<ActionResponse<Schedule>> {
    const supabaseAdmin = createAdminClient()

    try {
        const { classId, error } = await getTeacherClassId()

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

/**
 * Create new schedule
 */
export async function createSchedule(data: {
    name: string
    event_date: string
    description?: string
}): Promise<ActionResponse<Schedule>> {
    const supabaseAdmin = createAdminClient()

    try {
        const { classId, teacherId, error } = await getTeacherClassId()

        if (error || !classId || !teacherId) {
            return { success: false, error: 'No class assigned' }
        }

        const { data: newSchedule, error: insertError } = await supabaseAdmin
            .from('schedule')
            .insert({
                name: data.name,
                description: data.description || null,
                event_date: data.event_date,
                class_id: classId,
                created_by: teacherId
            })
            .select()
            .single()

        if (insertError) throw insertError

        return {
            success: true,
            data: newSchedule
        }
    } catch (error) {
        console.error('Error creating schedule:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal membuat jadwal'
        }
    }
}

/**
 * Update existing schedule
 */
export async function updateSchedule(
    scheduleId: number,
    data: {
        name: string
        event_date: string
        description?: string
    }
): Promise<ActionResponse<Schedule>> {
    const supabaseAdmin = createAdminClient()

    try {
        const { classId, error } = await getTeacherClassId()

        if (error || !classId) {
            return { success: false, error: 'No class assigned' }
        }

        // Verify schedule belongs to teacher's class
        const { data: existing } = await supabaseAdmin
            .from('schedule')
            .select('id')
            .eq('id', scheduleId)
            .eq('class_id', classId)
            .single()

        if (!existing) {
            return { success: false, error: 'Jadwal tidak ditemukan' }
        }

        const { data: updated, error: updateError } = await supabaseAdmin
            .from('schedule')
            .update({
                name: data.name,
                description: data.description || null,
                event_date: data.event_date,
                updated_at: new Date().toISOString()
            })
            .eq('id', scheduleId)
            .select()
            .single()

        if (updateError) throw updateError

        return {
            success: true,
            data: updated
        }
    } catch (error) {
        console.error('Error updating schedule:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengupdate jadwal'
        }
    }
}

/**
 * Delete schedule
 */
export async function deleteSchedule(scheduleId: number): Promise<ActionResponse<void>> {
    const supabaseAdmin = createAdminClient()

    try {
        const { classId, error } = await getTeacherClassId()

        if (error || !classId) {
            return { success: false, error: 'No class assigned' }
        }

        // Verify schedule belongs to teacher's class
        const { data: existing } = await supabaseAdmin
            .from('schedule')
            .select('id')
            .eq('id', scheduleId)
            .eq('class_id', classId)
            .single()

        if (!existing) {
            return { success: false, error: 'Jadwal tidak ditemukan' }
        }

        const { error: deleteError } = await supabaseAdmin
            .from('schedule')
            .delete()
            .eq('id', scheduleId)

        if (deleteError) throw deleteError

        return { success: true }
    } catch (error) {
        console.error('Error deleting schedule:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal menghapus jadwal'
        }
    }
}
