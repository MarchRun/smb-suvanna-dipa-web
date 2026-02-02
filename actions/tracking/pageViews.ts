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
// Enhanced Visitor Stats Interface
export interface VisitorChartData {
    chartData: VisitorStats[]
    totalViews: number
    trend: {
        value: number
        direction: 'up' | 'down' | 'neutral'
    }
}

/**
 * Get daily visitor stats for last 7 days with trend
 */
export async function getVisitorStats(days: number = 30): Promise<ActionResponse<VisitorChartData>> {
    const supabase = await createClient()

    // Calculate Date Ranges
    const now = new Date()

    // Current Period: [now - days, now]
    const currentStartDate = new Date(now)
    currentStartDate.setDate(now.getDate() - days)

    // Previous Period: [now - 2*days, now - days] (for trend)
    const prevStartDate = new Date(currentStartDate)
    prevStartDate.setDate(currentStartDate.getDate() - days)

    try {
        // --- 1. Fetch Archived Data (daily_visitor_stats) ---
        // For both periods
        // We use string manipulation for dates to match the DB DATE format (YYYY-MM-DD)
        const prevStartStr = prevStartDate.toISOString().split('T')[0]
        const nowStr = now.toISOString().split('T')[0]

        let archivedData: { date: string; views: number }[] = []

        try {
            const { data, error } = await supabase
                .from('daily_visitor_stats')
                .select('date, views')
                .gte('date', prevStartStr)
                .lte('date', nowStr)

            if (error) {
                // If table doesn't exist yet (PGRST205/42P01), just ignore archived data
                // This prevents the dashboard from crashing before migration is run
                if (error.code !== 'PGRST205' && error.code !== '42P01') {
                    throw error
                }
            } else if (data) {
                archivedData = data
            }
        } catch (err) {
            console.warn('Could not fetch archived stats (table might be missing):', err)
            // Continue without archived data
        }

        // --- 2. Fetch Live Data (page_views) ---
        // Fetch all live data needed for both periods
        const { data: liveDataCurrent, error: liveError } = await supabase
            .from('page_views')
            .select('created_at')
            .gte('created_at', prevStartDate.toISOString())

        if (liveError) throw liveError

        // --- 3. Process & Merge Data ---

        // Helper: Aggregate Live Data by Date
        const liveStatsMap = new Map<string, number>()
        liveDataCurrent?.forEach(row => {
            const dateStr = new Date(row.created_at).toISOString().split('T')[0]
            liveStatsMap.set(dateStr, (liveStatsMap.get(dateStr) || 0) + 1)
        })

        // Helper: Convert Archived Data to Map
        const archivedStatsMap = new Map<string, number>()
        archivedData?.forEach(row => {
            archivedStatsMap.set(row.date, row.views)
        })

        // --- 4. Build Chart Data (Current Period) ---
        const statsMap = new Map<string, number>()

        // Initialize all dates in current period with 0
        for (let i = 0; i < days; i++) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            statsMap.set(dateStr, 0)
        }

        // Fill with merged data
        for (const dateStr of statsMap.keys()) {
            const archivedCount = archivedStatsMap.get(dateStr) || 0
            const liveCount = liveStatsMap.get(dateStr) || 0
            statsMap.set(dateStr, archivedCount + liveCount)
        }

        const chartData: VisitorStats[] = Array.from(statsMap.entries())
            .map(([date, views]) => ({ date, views }))
            .sort((a, b) => a.date.localeCompare(b.date))

        // --- 5. Calculate Trend ---
        // Calculate Total Views for Current Period
        const currentTotal = Array.from(statsMap.values()).reduce((a, b) => a + b, 0)

        // Calculate Total Views for Previous Period
        let prevTotal = 0
        for (let i = 0; i < days; i++) {
            const date = new Date(currentStartDate)
            date.setDate(date.getDate() - 1 - i) // Backwards from currentStart
            const dateStr = date.toISOString().split('T')[0]

            const archivedCount = archivedStatsMap.get(dateStr) || 0
            const liveCount = liveStatsMap.get(dateStr) || 0
            prevTotal += (archivedCount + liveCount)
        }

        let trendValue = 0
        let trendDirection: 'up' | 'down' | 'neutral' = 'neutral'

        if (prevTotal === 0) {
            trendValue = currentTotal > 0 ? 100 : 0
            trendDirection = currentTotal > 0 ? 'up' : 'neutral'
        } else {
            trendValue = Math.round(((currentTotal - prevTotal) / prevTotal) * 100)
            trendDirection = trendValue > 0 ? 'up' : trendValue < 0 ? 'down' : 'neutral'
        }

        return {
            success: true,
            data: {
                chartData,
                totalViews: currentTotal,
                trend: {
                    value: Math.abs(trendValue),
                    direction: trendDirection
                }
            }
        }

    } catch (error) {
        console.error('Error fetching visitor stats:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data statistik',
            data: {
                chartData: [],
                totalViews: 0,
                trend: { value: 0, direction: 'neutral' }
            }
        }
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
