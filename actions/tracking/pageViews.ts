/**
 * Page View Tracking Server Actions
 * Track and retrieve visitor statistics
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import type { ActionResponse } from '@/types'

export interface PageViewData {
    page_path: string
    page_name: string
    visitor_id?: string
    user_agent?: string
    referrer?: string
}

export interface VisitorStats {
    date: string
    views: number
}

export interface PageStats {
    page_name: string
    views: number
}

/**
 * Track a page view
 */
export async function trackPageView(data: PageViewData): Promise<ActionResponse<null>> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('page_views')
        .insert({
            page_path: data.page_path,
            page_name: data.page_name,
            visitor_id: data.visitor_id,
            user_agent: data.user_agent,
            referrer: data.referrer
        })

    if (error) {
        console.error('Error tracking page view:', error)
        return {
            success: false,
            error: error.message
        }
    }

    return { success: true }
}

/**
 * Get daily visitor stats for last 7 days
 */
export async function getVisitorStats(days: number = 7): Promise<ActionResponse<VisitorStats[]>> {
    const supabase = await createClient()

    // Get date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
        .from('page_views')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

    if (error) {
        console.error('Error fetching visitor stats:', error)
        return {
            success: false,
            error: error.message,
            data: []
        }
    }

    // Group by date
    const statsMap = new Map<string, number>()

    // Initialize all dates with 0
    for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        statsMap.set(dateStr, 0)
    }

    // Count views per date
    data?.forEach((row) => {
        const dateStr = new Date(row.created_at).toISOString().split('T')[0]
        statsMap.set(dateStr, (statsMap.get(dateStr) || 0) + 1)
    })

    // Convert to array and sort by date
    const stats: VisitorStats[] = Array.from(statsMap.entries())
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date))

    return {
        success: true,
        data: stats
    }
}

/**
 * Get page-wise view counts
 */
export async function getPageStats(): Promise<ActionResponse<PageStats[]>> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('page_views')
        .select('page_name')

    if (error) {
        console.error('Error fetching page stats:', error)
        return {
            success: false,
            error: error.message,
            data: []
        }
    }

    // Group by page_name
    const statsMap = new Map<string, number>()
    data?.forEach((row) => {
        statsMap.set(row.page_name, (statsMap.get(row.page_name) || 0) + 1)
    })

    const stats: PageStats[] = Array.from(statsMap.entries())
        .map(([page_name, views]) => ({ page_name, views }))
        .sort((a, b) => b.views - a.views)

    return {
        success: true,
        data: stats
    }
}
