/**
 * Next.js Middleware untuk Route Protection
 * Proteksi routes berdasarkan authentication & role
 */

import { updateSession } from '@/lib/supabase/middleware'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request)

    const { pathname } = request.nextUrl

    // Public routes (tidak perlu login)
    // TODO: Remove dashboard routes from public after testing
    const publicRoutes = ['/', '/about', '/activities', '/contact', '/login', '/forgot-password', '/reset-password', '/student/dashboard', '/teacher/dashboard', '/admin/dashboard']
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

    // Jika public route, lewatkan
    if (isPublicRoute) {
        return supabaseResponse
    }

    // Jika tidak ada user (belum login), redirect ke homepage
    if (!user) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/'
        return NextResponse.redirect(redirectUrl)
    }

    // Fetch user role menggunakan service client
    const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile) {
        // Jika profile tidak ada, redirect ke homepage dan signout
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/'
        return NextResponse.redirect(redirectUrl)
    }

    const role = profile.role

    // Role-based route protection
    if (pathname.startsWith('/student')) {
        if (role !== 'siswa') {
            return NextResponse.redirect(new URL(getRoleDashboard(role), request.url))
        }
    } else if (pathname.startsWith('/teacher')) {
        if (role !== 'pembina') {
            return NextResponse.redirect(new URL(getRoleDashboard(role), request.url))
        }
    } else if (pathname.startsWith('/admin')) {
        if (role !== 'admin') {
            return NextResponse.redirect(new URL(getRoleDashboard(role), request.url))
        }
    }

    return supabaseResponse
}

// Helper function to get dashboard URL by role
function getRoleDashboard(role: string): string {
    switch (role) {
        case 'siswa':
            return '/student/dashboard'
        case 'pembina':
            return '/teacher/dashboard'
        case 'admin':
            return '/admin/dashboard'
        default:
            return '/'
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
