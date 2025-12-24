/**
 * Next.js Middleware untuk Route Protection
 * Proteksi routes berdasarkan authentication & role
 */

import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request)

    const { pathname } = request.nextUrl

    // Public routes (tidak perlu login)
    const publicRoutes = ['/', '/tentang', '/aktivitas', '/kontak', '/login', '/forgot-password', '/reset-password']
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    // Jika public route, lewatkan
    if (isPublicRoute) {
        return supabaseResponse
    }

    // Jika tidak ada user (belum login), redirect ke login
    if (!user) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(redirectUrl)
    }

    // TODO: Cek role-based access setelah profile table ready

    return supabaseResponse
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
