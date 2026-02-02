import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        const supabase = await createClient()

        // 1. Calculate stats for yesterday (or older) that haven't been archived
        // Simplified approach: Archive data older than 24 hours (i.e., strictly 'yesterday' and before)
        // Ideally, this runs once a day at 00:01 AM for the previous day.

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const dateStr = yesterday.toISOString().split('T')[0] // YYYY-MM-DD

        // Check if stats for this date already exist
        const { data: existingStats } = await supabase
            .from('daily_visitor_stats')
            .select('id')
            .eq('date', dateStr)
            .single()

        if (existingStats) {
            return NextResponse.json({ message: 'Stats for yesterday already archived' })
        }

        // Count views for that specific date range
        const startOfDay = new Date(dateStr)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(dateStr)
        endOfDay.setHours(23, 59, 59, 999)

        const { count, error: countError } = await supabase
            .from('page_views')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfDay.toISOString())
            .lte('created_at', endOfDay.toISOString())

        if (countError) throw countError

        if (count && count > 0) {
            // 2. Insert into daily_visitor_stats
            const { error: insertError } = await supabase
                .from('daily_visitor_stats')
                .insert({
                    date: dateStr,
                    views: count
                })

            if (insertError) throw insertError

            // 3. Delete raw logs for that day
            const { error: deleteError } = await supabase
                .from('page_views')
                .delete()
                .gte('created_at', startOfDay.toISOString())
                .lte('created_at', endOfDay.toISOString())

            if (deleteError) throw deleteError

            return NextResponse.json({
                success: true,
                message: `Archived ${count} views for ${dateStr}`
            })
        }

        return NextResponse.json({ message: `No views found for ${dateStr}` })

    } catch (error) {
        console.error('Archiving error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to archive stats' },
            { status: 500 }
        )
    }
}
