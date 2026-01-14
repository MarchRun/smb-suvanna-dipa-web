/**
 * Public Content Management Actions
 * Manage activities, gallery, and testimonials for public website
 */

'use server'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { ActionResponse } from '@/types'

function getAdminClient() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

// Type definitions
export interface ActivityContent {
    agenda: string[] // 4 items
}

export interface GalleryItem {
    image_url: string
    caption: string
}

export interface GalleryContent {
    items: GalleryItem[] // 5 items
}

export interface TestimonialItem {
    name: string
    description: string
}

export interface TestimonialContent {
    items: TestimonialItem[] // 3 items
}

export interface PublicContentData {
    id: number
    section: string
    title: string | null
    content: any
    images: string[] | null
    updated_at: string
}

/**
 * Get public content by section
 */
export async function getPublicContentBySection(section: 'activities' | 'gallery' | 'testimonials'): Promise<ActionResponse<PublicContentData | null>> {
    const supabase = getAdminClient()

    try {
        const { data, error } = await supabase
            .from('public_content')
            .select('*')
            .eq('section', section)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                // No data found, return null
                return {
                    success: true,
                    data: null
                }
            }
            throw error
        }

        return {
            success: true,
            data
        }
    } catch (error) {
        console.error('Error fetching public content:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil konten',
            data: null
        }
    }
}

/**
 * Update activities/agenda content
 */
export async function updateActivities(agenda: string[]): Promise<ActionResponse> {
    const supabase = getAdminClient()

    try {
        // Validate: must have exactly 4 items
        if (agenda.length !== 4) {
            return {
                success: false,
                error: 'Harus ada 4 agenda'
            }
        }

        // Check if exists
        const { data: existing } = await supabase
            .from('public_content')
            .select('id')
            .eq('section', 'activities')
            .single()

        const content: ActivityContent = { agenda }

        if (existing) {
            // Update
            const { error } = await supabase
                .from('public_content')
                .update({
                    content,
                    updated_at: new Date().toISOString()
                })
                .eq('section', 'activities')

            if (error) throw error
        } else {
            // Insert
            const { error } = await supabase
                .from('public_content')
                .insert({
                    section: 'activities',
                    title: 'Agenda Tahunan Kegiatan',
                    content,
                    is_published: true
                })

            if (error) throw error
        }

        revalidatePath('/admin/konten')
        revalidatePath('/') // Public homepage

        return {
            success: true
        }
    } catch (error) {
        console.error('Error updating activities:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal update agenda'
        }
    }
}

/**
 * Update gallery content
 */
export async function updateGallery(items: GalleryItem[]): Promise<ActionResponse> {
    const supabase = getAdminClient()

    try {
        // Validate: must have exactly 5 items
        if (items.length !== 5) {
            return {
                success: false,
                error: 'Harus ada 5 gambar'
            }
        }

        // Check if exists
        const { data: existing } = await supabase
            .from('public_content')
            .select('id')
            .eq('section', 'gallery')
            .single()

        const content: GalleryContent = { items }
        const images = items.map(item => item.image_url)

        if (existing) {
            // Update
            const { error } = await supabase
                .from('public_content')
                .update({
                    content,
                    images,
                    updated_at: new Date().toISOString()
                })
                .eq('section', 'gallery')

            if (error) throw error
        } else {
            // Insert
            const { error } = await supabase
                .from('public_content')
                .insert({
                    section: 'gallery',
                    title: 'Galeri Kegiatan',
                    content,
                    images,
                    is_published: true
                })

            if (error) throw error
        }

        revalidatePath('/admin/konten')
        revalidatePath('/') // Public homepage

        return {
            success: true
        }
    } catch (error) {
        console.error('Error updating gallery:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal update galeri'
        }
    }
}

/**
 * Update testimonials content
 */
export async function updateTestimonials(items: TestimonialItem[]): Promise<ActionResponse> {
    const supabase = getAdminClient()

    try {
        // Validate: must have exactly 3 items
        if (items.length !== 3) {
            return {
                success: false,
                error: 'Harus ada 3 testimoni'
            }
        }

        // Validate: all must have names
        for (const item of items) {
            if (!item.name || item.name.trim() === '') {
                return {
                    success: false,
                    error: 'Semua nama harus diisi'
                }
            }
        }

        // Check if exists
        const { data: existing } = await supabase
            .from('public_content')
            .select('id')
            .eq('section', 'testimonials')
            .single()

        const content: TestimonialContent = { items }

        if (existing) {
            // Update
            const { error } = await supabase
                .from('public_content')
                .update({
                    content,
                    updated_at: new Date().toISOString()
                })
                .eq('section', 'testimonials')

            if (error) throw error
        } else {
            // Insert
            const { error } = await supabase
                .from('public_content')
                .insert({
                    section: 'testimonials',
                    title: 'Testimoni',
                    content,
                    is_published: true
                })

            if (error) throw error
        }

        revalidatePath('/admin/konten')
        revalidatePath('/') // Public homepage

        return {
            success: true
        }
    } catch (error) {
        console.error('Error updating testimonials:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal update testimoni'
        }
    }
}
