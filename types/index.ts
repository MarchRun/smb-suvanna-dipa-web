/**
 * Custom Types & Interfaces
 * All column names match database schema (English)
 */

// User Role Type
export type UserRole = 'admin' | 'pembina' | 'siswa'

// Order Status
export type OrderStatus = 'pending' | 'approved' | 'rejected'

// Content Section
export type ContentSection = 'hero' | 'about' | 'activities' | 'testimonials' | 'gallery'

// Server Action Response Type
export type ActionResponse<T = unknown> = {
    success: boolean
    data?: T
    error?: string
}

// Profile
export interface Profile {
    id: string
    full_name: string | null
    email: string | null
    phone: string | null
    gender: string | null
    birth_date: string | null
    address: string | null
    profile_picture: string | null
    role: UserRole
    points: number | null
    class_id: number | null
    created_at: string
    updated_at: string
}

// Class
export interface Class {
    id: number
    name: string
    teacher_id: string | null
    created_at: string
    updated_at: string | null
}

// Schedule
export interface Schedule {
    id: number
    name: string
    description: string | null
    event_date: string
    location: string | null
    class_id: number | null
    created_by: string | null
    created_at: string
    updated_at: string | null
}

// Product (Hadiah)
export interface Product {
    id: number
    name: string
    price: number
    stock: number
    image_url: string | null
    created_at: string
    updated_at: string | null
}

// Product Order
export interface ProductOrder {
    id: number
    user_id: string
    product_id: number
    total_points: number
    status: OrderStatus
    created_at: string
    updated_at: string | null
}

// Point History
export interface PointHistory {
    id: number
    user_id: string
    amount: number
    reason: string
    given_by: string | null
    order_id: number | null
    created_at: string
}

// Public Content
export interface PublicContent {
    id: number
    section: ContentSection
    title: string | null
    content: Record<string, any> | null
    images: string[] | null
    display_order: number
    is_published: boolean
    updated_by: string | null
    updated_at: string | null
}

// Password Reset Token
export interface PasswordResetToken {
    id: string
    user_id: string
    email: string
    token: string
    expires_at: string
    used: boolean
    created_at: string
}

// Extended Types with Relations
export interface ClassWithTeacher extends Class {
    teacher: {
        full_name: string
    } | null
}

export interface ProfileWithClass extends Profile {
    class: {
        name: string
    } | null
}

export interface OrderWithDetails extends ProductOrder {
    user: {
        full_name: string
    } | null
    product: {
        name: string
        price: number
    } | null
}
