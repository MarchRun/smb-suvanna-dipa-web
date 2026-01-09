/**
 * API Route to fetch classes
 * Used for filter dropdown in Pengguna page
 */

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('classes')
        .select('id, name')
        .order('name', { ascending: true })

    if (error) {
        return NextResponse.json([], { status: 500 })
    }

    return NextResponse.json(data || [])
}
