/**
 * Admin User Management Server Actions
 * CRUD operations for managing users (siswa & pembina)
 */

'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResponse, Profile, UserRole } from '@/types'

// Filter options for user list
export interface UserFilters {
    search?: string
    role?: UserRole | 'all'
    classId?: number | null
    gender?: string | null
}

// Sort options
export interface UserSort {
    column: 'full_name' | 'role' | 'created_at'
    direction: 'asc' | 'desc'
}

// Create user data
export interface CreateUserData {
    email: string
    password: string
    full_name: string
    phone?: string
    gender?: string
    birth_date?: string
    address?: string
    role: UserRole
    class_id?: number | null
    profile_picture?: string
}

// Update user data
export interface UpdateUserData {
    full_name?: string
    phone?: string
    gender?: string
    birth_date?: string
    address?: string
    role?: UserRole
    class_id?: number | null
    password?: string // Optional - only if changing password
    profile_picture?: string
}

/**
 * Get list of users with filters and sorting
 */
export async function getUsers(
    filters?: UserFilters,
    sort?: UserSort
): Promise<ActionResponse<Profile[]>> {
    const supabase = createAdminClient()

    try {
        let query = supabase
            .from('profiles')
            .select('*')

        // Apply role filter (only siswa and pembina for this list)
        if (filters?.role && filters.role !== 'all') {
            query = query.eq('role', filters.role)
        } else {
            // By default, show only siswa and pembina (not admin)
            query = query.in('role', ['siswa', 'pembina'])
        }

        // Apply class filter
        if (filters?.classId) {
            query = query.eq('class_id', filters.classId)
        }

        // Apply gender filter
        if (filters?.gender) {
            query = query.eq('gender', filters.gender)
        }

        // Apply search filter
        if (filters?.search) {
            query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
        }

        // Apply sorting
        if (sort) {
            query = query.order(sort.column, { ascending: sort.direction === 'asc' })
        } else {
            query = query.order('full_name', { ascending: true })
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching users:', error)
            throw error
        }

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error('Error in getUsers:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data pengguna',
            data: []
        }
    }
}

/**
 * Get single user by ID
 */
export async function getUserById(id: string): Promise<ActionResponse<Profile | null>> {
    const supabase = createAdminClient()

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                // User not found
                return {
                    success: false,
                    error: 'Pengguna tidak ditemukan',
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
        console.error('Error fetching user:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data pengguna',
            data: null
        }
    }
}

/**
 * Create new user (with Supabase Auth)
 */
export async function createUser(data: CreateUserData): Promise<ActionResponse<Profile | null>> {
    const supabase = createAdminClient()

    try {
        // 1. Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: true // Auto-confirm email
        })

        if (authError) throw authError
        if (!authData.user) throw new Error('Failed to create user')

        // 2. Update profile with additional data
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .update({
                full_name: data.full_name,
                phone: data.phone || null,
                gender: data.gender || null,
                birth_date: data.birth_date || null,
                address: data.address || null,
                role: data.role,
                class_id: data.class_id || null,
                profile_picture: data.profile_picture || null
            })
            .eq('id', authData.user.id)
            .select()
            .single()

        if (profileError) throw profileError

        return {
            success: true,
            data: profile
        }
    } catch (error) {
        console.error('Error creating user:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal membuat pengguna',
            data: null
        }
    }
}

/**
 * Update existing user
 */
export async function updateUser(id: string, data: UpdateUserData): Promise<ActionResponse<Profile | null>> {
    const supabase = createAdminClient()

    try {
        // Build update object (only include non-undefined values)
        const updateData: Record<string, unknown> = {}
        if (data.full_name !== undefined) updateData.full_name = data.full_name
        if (data.phone !== undefined) updateData.phone = data.phone
        if (data.gender !== undefined) updateData.gender = data.gender
        if (data.birth_date !== undefined) updateData.birth_date = data.birth_date
        if (data.address !== undefined) updateData.address = data.address
        if (data.role !== undefined) updateData.role = data.role
        if (data.class_id !== undefined) updateData.class_id = data.class_id
        if (data.profile_picture !== undefined) updateData.profile_picture = data.profile_picture

        // Update profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (profileError) throw profileError

        // If password is provided, update auth user
        if (data.password) {
            const { error: authError } = await supabase.auth.admin.updateUserById(id, {
                password: data.password
            })
            if (authError) throw authError
        }

        return {
            success: true,
            data: profile
        }
    } catch (error) {
        console.error('Error updating user:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengubah pengguna',
            data: null
        }
    }
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<ActionResponse<null>> {
    const supabase = createAdminClient()

    try {
        // Delete auth user (this will cascade delete profile due to FK)
        const { error } = await supabase.auth.admin.deleteUser(id)

        if (error) throw error

        return {
            success: true,
            data: null
        }
    } catch (error) {
        console.error('Error deleting user:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal menghapus pengguna',
            data: null
        }
    }
}

/**
 * Get users for Excel export (with filters)
 */
export async function getUsersForExport(filters?: UserFilters): Promise<ActionResponse<Profile[]>> {
    const supabase = createAdminClient()

    try {
        let query = supabase
            .from('profiles')
            .select('*, classes(id, name)')

        // Apply role filter (only siswa and pembina for this list)
        if (filters?.role && filters.role !== 'all') {
            query = query.eq('role', filters.role)
        } else {
            // By default, show only siswa and pembina (not admin)
            query = query.in('role', ['siswa', 'pembina'])
        }

        // Apply class filter
        if (filters?.classId) {
            query = query.eq('class_id', filters.classId)
        }

        // Apply gender filter
        if (filters?.gender) {
            query = query.eq('gender', filters.gender)
        }

        // Apply search filter
        if (filters?.search) {
            query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
        }

        // Sort by name
        query = query.order('full_name', { ascending: true })

        const { data, error } = await query

        if (error) {
            console.error('Error fetching users for export:', error)
            throw error
        }

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error('Error in getUsersForExport:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data pengguna',
            data: []
        }
    }
}
