/**
 * Public Content Server Actions
 * Fetch public-facing content from database
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import type { ActionResponse, PublicContent } from '@/types'

/**
 * Fetch content by section (kategori)
 */
export async function getContentBySection(
    kategori: string
): Promise<ActionResponse<PublicContent | null>> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('public_content')
        .select('*')
        .eq('kategori_konten', kategori)
        .eq('status_publikasi', true)
        .order('urutan_konten', { ascending: true })
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
        .eq('status_publikasi', true)
        .order('urutan_konten', { ascending: true })

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
