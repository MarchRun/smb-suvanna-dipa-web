/**
 * Admin Products (Hadiah) Actions
 * CRUD operations for managing rewards
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { ActionResponse } from '@/types'

// Admin client for bypassing RLS
function getAdminClient() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export interface Product {
    id: number
    name: string
    price: number
    stock: number
    image_url: string | null
    created_at: string
    updated_at: string
}

export interface ProductFilters {
    search?: string
    stockStatus?: 'all' | 'in-stock' | 'out-of-stock'
}

export interface ProductSort {
    field: 'name' | 'price' | 'stock'
    direction: 'asc' | 'desc'
}

/**
 * Get all products with optional filters and sorting
 */
export async function getProducts(
    filters?: ProductFilters,
    sort?: ProductSort
): Promise<ActionResponse<Product[]>> {
    const supabase = getAdminClient()

    try {
        let query = supabase
            .from('products')
            .select('*')

        // Apply search filter
        if (filters?.search) {
            query = query.ilike('name', `%${filters.search}%`)
        }

        // Apply stock status filter
        if (filters?.stockStatus === 'in-stock') {
            query = query.gt('stock', 0)
        } else if (filters?.stockStatus === 'out-of-stock') {
            query = query.eq('stock', 0)
        }

        // Apply sorting
        if (sort) {
            query = query.order(sort.field, { ascending: sort.direction === 'asc' })
        } else {
            // Default sort by name
            query = query.order('name', { ascending: true })
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
            error: error instanceof Error ? error.message : 'Gagal mengambil data hadiah',
            data: []
        }
    }
}

/**
 * Get single product by ID
 */
export async function getProductById(id: number): Promise<ActionResponse<Product | null>> {
    const supabase = getAdminClient()

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return {
                    success: false,
                    error: 'Hadiah tidak ditemukan',
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
        console.error('Error fetching product:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data hadiah',
            data: null
        }
    }
}

/**
 * Create new product
 */
export async function createProduct(data: {
    name: string
    price: number
    stock: number
    image_url?: string
}): Promise<ActionResponse<Product>> {
    const supabase = getAdminClient()

    try {
        // Validate inputs
        if (!data.name || data.name.trim() === '') {
            return {
                success: false,
                error: 'Nama hadiah harus diisi'
            }
        }

        if (data.price < 0) {
            return {
                success: false,
                error: 'Harga tidak boleh negatif'
            }
        }

        if (data.stock < 0) {
            return {
                success: false,
                error: 'Stok tidak boleh negatif'
            }
        }

        const { data: product, error } = await supabase
            .from('products')
            .insert({
                name: data.name.trim(),
                price: data.price,
                stock: data.stock,
                image_url: data.image_url || null
            })
            .select()
            .single()

        if (error) throw error

        revalidatePath('/admin/hadiah')

        return {
            success: true,
            data: product
        }
    } catch (error) {
        console.error('Error creating product:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal menambah hadiah'
        }
    }
}

/**
 * Update existing product
 */
export async function updateProduct(
    id: number,
    data: {
        name?: string
        price?: number
        stock?: number
        image_url?: string
    }
): Promise<ActionResponse<Product>> {
    const supabase = getAdminClient()

    try {
        // Validate inputs
        if (data.name !== undefined && data.name.trim() === '') {
            return {
                success: false,
                error: 'Nama hadiah harus diisi'
            }
        }

        if (data.price !== undefined && data.price < 0) {
            return {
                success: false,
                error: 'Harga tidak boleh negatif'
            }
        }

        if (data.stock !== undefined && data.stock < 0) {
            return {
                success: false,
                error: 'Stok tidak boleh negatif'
            }
        }

        const updateData: any = {}
        if (data.name !== undefined) updateData.name = data.name.trim()
        if (data.price !== undefined) updateData.price = data.price
        if (data.stock !== undefined) updateData.stock = data.stock
        if (data.image_url !== undefined) updateData.image_url = data.image_url || null

        const { data: product, error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/admin/hadiah')

        return {
            success: true,
            data: product
        }
    } catch (error) {
        console.error('Error updating product:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengubah hadiah'
        }
    }
}

/**
 * Delete product
 */
export async function deleteProduct(id: number): Promise<ActionResponse> {
    const supabase = getAdminClient()

    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/hadiah')

        return {
            success: true
        }
    } catch (error) {
        console.error('Error deleting product:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal menghapus hadiah'
        }
    }
}
