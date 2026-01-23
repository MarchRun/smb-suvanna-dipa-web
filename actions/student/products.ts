/**
 * Student Products Server Actions
 * Actions for fetching products, student points, and managing redemptions
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResponse, Product, ProductOrder, OrderStatus } from '@/types'

export interface StudentRedemption extends ProductOrder {
    product: {
        name: string
        price: number
        image_url: string | null
    } | null
}

export interface ProductFilters {
    search?: string
    maxPrice?: number
}

/**
 * Get available products for students (in stock)
 */
export async function getAvailableProducts(
    filters?: ProductFilters
): Promise<ActionResponse<Product[]>> {
    const supabaseAdmin = createAdminClient()

    try {
        let query = supabaseAdmin
            .from('products')
            .select('*')
            .gt('stock', 0)
            .order('name', { ascending: true })

        // Apply search filter
        if (filters?.search) {
            query = query.ilike('name', `%${filters.search}%`)
        }

        // Apply max price filter
        if (filters?.maxPrice) {
            query = query.lte('price', filters.maxPrice)
        }

        const { data, error } = await query

        if (error) throw error

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error('Error fetching products:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data hadiah'
        }
    }
}

/**
 * Get current student's points
 */
export async function getStudentPoints(): Promise<ActionResponse<number>> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            throw new Error('User not authenticated')
        }

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('points')
            .eq('id', user.id)
            .single()

        if (profileError) throw profileError

        return {
            success: true,
            data: profile?.points || 0
        }
    } catch (error) {
        console.error('Error fetching student points:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data poin'
        }
    }
}

/**
 * Create a new redemption request
 */
export async function createRedemption(
    productId: number
): Promise<ActionResponse<ProductOrder>> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            throw new Error('User not authenticated')
        }

        // Get product details
        const { data: product, error: productError } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('id', productId)
            .single()

        if (productError || !product) {
            throw new Error('Hadiah tidak ditemukan')
        }

        // Check stock
        if (product.stock <= 0) {
            throw new Error('Stok hadiah habis')
        }

        // Get student points
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('points')
            .eq('id', user.id)
            .single()

        if (profileError) throw profileError

        const studentPoints = profile?.points || 0

        // Check if student has enough points
        if (studentPoints < product.price) {
            throw new Error('Poin tidak cukup untuk menukar hadiah ini')
        }

        // Create order
        const { data: order, error: orderError } = await supabaseAdmin
            .from('product_orders')
            .insert({
                user_id: user.id,
                product_id: productId,
                total_points: product.price,
                status: 'pending'
            })
            .select()
            .single()

        if (orderError) throw orderError

        return {
            success: true,
            data: order
        }
    } catch (error) {
        console.error('Error creating redemption:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal membuat permintaan tukar poin'
        }
    }
}

/**
 * Get student's redemption history
 */
export async function getStudentRedemptions(
    statusFilter?: OrderStatus | 'all'
): Promise<ActionResponse<StudentRedemption[]>> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            throw new Error('User not authenticated')
        }

        let query = supabaseAdmin
            .from('product_orders')
            .select(`
                *,
                product:products(name, price, image_url)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        // Apply status filter
        if (statusFilter && statusFilter !== 'all') {
            query = query.eq('status', statusFilter)
        }

        const { data, error } = await query

        if (error) throw error

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error('Error fetching redemptions:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil riwayat tukar poin'
        }
    }
}

/**
 * Cancel a pending redemption
 */
export async function cancelRedemption(
    orderId: number
): Promise<ActionResponse<void>> {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            throw new Error('User not authenticated')
        }

        // Check if order exists and belongs to user
        const { data: order, error: orderError } = await supabaseAdmin
            .from('product_orders')
            .select('*')
            .eq('id', orderId)
            .eq('user_id', user.id)
            .single()

        if (orderError || !order) {
            throw new Error('Pesanan tidak ditemukan')
        }

        // Can only cancel pending orders
        if (order.status !== 'pending') {
            throw new Error('Hanya dapat membatalkan pesanan yang masih pending')
        }

        // Delete the order
        const { error: deleteError } = await supabaseAdmin
            .from('product_orders')
            .delete()
            .eq('id', orderId)

        if (deleteError) throw deleteError

        return {
            success: true
        }
    } catch (error) {
        console.error('Error canceling redemption:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal membatalkan pesanan'
        }
    }
}
