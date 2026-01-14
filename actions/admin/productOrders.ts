/**
 * Admin Product Orders Actions
 * Handle point exchange validation (approve/reject)
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

export interface ProductOrder {
    id: number
    user_id: string
    product_id: number
    total_points: number
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
    updated_at: string
    // Joined data
    student_name?: string
    student_points?: number
    product_name?: string
    product_price?: number
}

/**
 * Get pending product orders with student and product details
 */
export async function getPendingOrders(): Promise<ActionResponse<ProductOrder[]>> {
    const supabase = getAdminClient()

    try {
        const { data, error } = await supabase
            .from('product_orders')
            .select(`
                *,
                profiles!product_orders_user_id_fkey (
                    full_name,
                    points
                ),
                products!product_orders_product_id_fkey (
                    name,
                    price
                )
            `)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

        if (error) throw error

        // Transform data
        const orders: ProductOrder[] = (data || []).map((order: any) => ({
            id: order.id,
            user_id: order.user_id,
            product_id: order.product_id,
            total_points: order.total_points,
            status: order.status,
            created_at: order.created_at,
            updated_at: order.updated_at,
            student_name: order.profiles?.full_name || 'Unknown',
            student_points: order.profiles?.points || 0,
            product_name: order.products?.name || 'Unknown',
            product_price: order.products?.price || 0
        }))

        return {
            success: true,
            data: orders
        }
    } catch (error) {
        console.error('Error fetching pending orders:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data tukar poin',
            data: []
        }
    }
}

/**
 * Approve product order
 * - Update order status to 'approved'
 * - Deduct points from student
 * - Decrease product stock
 * - Add point history
 */
export async function approveOrder(orderId: number): Promise<ActionResponse> {
    const supabase = getAdminClient()

    try {
        // Get order details
        const { data: order, error: orderError } = await supabase
            .from('product_orders')
            .select(`
                *,
                profiles!product_orders_user_id_fkey (points),
                products!product_orders_product_id_fkey (stock, price)
            `)
            .eq('id', orderId)
            .single()

        if (orderError) throw orderError
        if (!order) throw new Error('Order not found')

        // Validate student has enough points
        const studentPoints = order.profiles?.points || 0
        const requiredPoints = order.total_points

        if (studentPoints < requiredPoints) {
            return {
                success: false,
                error: 'Poin siswa tidak mencukupi'
            }
        }

        // Validate product stock
        const productStock = order.products?.stock || 0
        if (productStock <= 0) {
            return {
                success: false,
                error: 'Stok hadiah habis'
            }
        }

        // Start transaction-like operations
        // 1. Update order status
        const { error: updateOrderError } = await supabase
            .from('product_orders')
            .update({ status: 'approved' })
            .eq('id', orderId)

        if (updateOrderError) throw updateOrderError

        // 2. Deduct student points
        const { error: deductPointsError } = await supabase
            .from('profiles')
            .update({ points: studentPoints - requiredPoints })
            .eq('id', order.user_id)

        if (deductPointsError) throw deductPointsError

        // 3. Decrease product stock
        const { error: decreaseStockError } = await supabase
            .from('products')
            .update({ stock: productStock - 1 })
            .eq('id', order.product_id)

        if (decreaseStockError) throw decreaseStockError

        // 4. Add point history
        const { error: historyError } = await supabase
            .from('point_history')
            .insert({
                user_id: order.user_id,
                amount: -requiredPoints,
                reason: `Tukar hadiah: ${order.products?.name || 'Unknown'}`,
                order_id: orderId
            })

        if (historyError) throw historyError

        revalidatePath('/admin/hadiah/validasi')

        return {
            success: true
        }
    } catch (error) {
        console.error('Error approving order:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal menyetujui tukar poin'
        }
    }
}

/**
 * Reject product order
 * - Update order status to 'rejected'
 */
export async function rejectOrder(orderId: number): Promise<ActionResponse> {
    const supabase = getAdminClient()

    try {
        const { error } = await supabase
            .from('product_orders')
            .update({ status: 'rejected' })
            .eq('id', orderId)

        if (error) throw error

        revalidatePath('/admin/hadiah/validasi')

        return {
            success: true
        }
    } catch (error) {
        console.error('Error rejecting order:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal menolak tukar poin'
        }
    }
}
