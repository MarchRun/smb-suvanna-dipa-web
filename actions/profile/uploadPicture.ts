/**
 * Profile Picture Upload Server Action
 * Handles profile picture uploads to Supabase Storage
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResponse } from '@/types'

/**
 * Upload profile picture to Supabase Storage
 * Returns the public URL of the uploaded image
 */
export async function uploadProfilePicture(formData: FormData): Promise<ActionResponse<string>> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            throw new Error('User not authenticated')
        }

        // Get the file from FormData
        const file = formData.get('file') as File
        if (!file) {
            throw new Error('No file provided')
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!validTypes.includes(file.type)) {
            throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            throw new Error('File size too large. Maximum size is 5MB.')
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `profile-pictures/${fileName}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('profile-pictures')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            throw new Error('Failed to upload file')
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('profile-pictures')
            .getPublicUrl(filePath)

        // Update profile with new picture URL
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                profile_picture: publicUrl,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (updateError) {
            console.error('Profile update error:', updateError)
            throw new Error('Failed to update profile picture')
        }

        return {
            success: true,
            data: publicUrl
        }
    } catch (error) {
        console.error('Error uploading profile picture:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengupload foto profil'
        }
    }
}

/**
 * Delete old profile picture from storage
 * Called before uploading a new one
 */
export async function deleteOldProfilePicture(pictureUrl: string): Promise<ActionResponse<void>> {
    const supabaseAdmin = createAdminClient()

    try {
        // Extract file path from URL
        const url = new URL(pictureUrl)
        const pathParts = url.pathname.split('profile-pictures/')
        if (pathParts.length < 2) {
            throw new Error('Invalid picture URL')
        }

        const filePath = `profile-pictures/${pathParts[1]}`

        // Delete from storage
        const { error: deleteError } = await supabaseAdmin.storage
            .from('profile-pictures')
            .remove([filePath])

        if (deleteError) {
            console.error('Delete error:', deleteError)
            // Don't throw error as the old file might not exist
        }

        return {
            success: true,
            data: undefined
        }
    } catch (error) {
        console.error('Error deleting old profile picture:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal menghapus foto lama'
        }
    }
}
