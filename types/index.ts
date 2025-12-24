/**
 * Custom Types & Interfaces
 */

// User Role Type
export type UserRole = 'admin' | 'guru' | 'siswa'

// Order Status
export type OrderStatus = 'pending' | 'approved' | 'rejected'

// Material Status  
export type MaterialStatus = 'hidden' | 'visible'

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
    points: number
    class_id: number | null
    created_at: string
    updated_at: string
}

// Class
export interface Class {
    id: number
    name: string
    description: string | null
    teacher_id: string | null
    created_at: string
}

// Schedule
export interface Schedule {
    id: number
    name: string
    description: string | null
    event_date: string
    location: string | null
    created_by: string | null
    created_at: string
    updated_at: string
}

// Product
export interface Product {
    id: number
    name: string
    description: string | null
    price: number
    stock: number
    image_url: string | null
    created_at: string
    updated_at: string
}

// Product Order
export interface ProductOrder {
    id: number
    user_id: string
    product_id: number
    quantity: number
    total_points: number
    status: OrderStatus
    created_at: string
    updated_at: string
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
    updated_by: string | null
    updated_at: string
}

// Material
export interface Material {
    id: number
    title: string
    content: string | null
    class_id: number | null
    author_id: string | null
    attachments: Record<string, any> | null
    scheduled_for: string | null
    status: MaterialStatus
    created_at: string
    updated_at: string
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
    profile: {
        full_name: string
    } | null
    product: {
        name: string
        price: number
    } | null
}

export interface MaterialWithAuthor extends Material {
    author: {
        full_name: string
    } | null
    class: {
        name: string
    } | null
}
