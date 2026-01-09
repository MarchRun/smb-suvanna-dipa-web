/**
 * Public Content Server Actions
 * Fetch public-facing content from database
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import type { ActionResponse, PublicContent } from '@/types'

/**
 * Fetch content by section
 */
export async function getContentBySection(
    section: string
): Promise<ActionResponse<PublicContent | null>> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('public_content')
        .select('*')
        .eq('section', section)
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .single()

    if (error) {
        return {
            success: false,
            error: error.message,
            data: null
        }
    }

    return {
        success: true,
        data: data
    }
}

/**
 * Fetch all public content (for activities page)
 */
export async function getAllPublicContent(): Promise<ActionResponse<PublicContent[]>> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('public_content')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })

    if (error) {
        return {
            success: false,
            error: error.message,
            data: []
        }
    }

    return {
        success: true,
        data: data || []
    }
}
