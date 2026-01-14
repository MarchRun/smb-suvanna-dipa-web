/**
 * Middleware
 * Handles authentication, authorization, and security
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { applySecurityHeaders } from '@/lib/security/headers'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Apply security headers
    const securityHeaders = applySecurityHeaders(new Headers())
    securityHeaders.forEach((value, key) => {
        response.headers.set(key, value)
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const publicRoutes = [
        '/',
        '/about',
        '/activities',
        '/contact',
        '/forgot-password',
        '/reset-password'
    ]

    const path = request.nextUrl.pathname
    const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith('/api/'))

    if (!user && !isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (user) {
        // Use admin client to bypass RLS
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profileError || !profile || !profile.role) {
            await supabase.auth.signOut()
            return NextResponse.redirect(new URL('/', request.url))
        }

        const userRole = profile.role

        // Redirect authenticated users from homepage to their dashboard
        if (path === '/') {
            const dashboards = {
                'admin': '/admin/dashboard',
                'pembina': '/teacher/dashboard',
                'siswa': '/student/dashboard'
            }

            const dashboardUrl = dashboards[userRole as keyof typeof dashboards]
            if (dashboardUrl) {
                return NextResponse.redirect(new URL(dashboardUrl, request.url))
            }
        }

        // Role-based access control
        if (path.startsWith('/admin')) {
            if (userRole !== 'admin') {
                const redirectMap = {
                    'pembina': '/teacher/dashboard',
                    'siswa': '/student/dashboard'
                }
                const redirectUrl = redirectMap[userRole as keyof typeof redirectMap] || '/'
                return NextResponse.redirect(new URL(redirectUrl, request.url))
            }
        }

        if (path.startsWith('/teacher')) {
            if (userRole !== 'pembina') {
                const redirectMap = {
                    'admin': '/admin/dashboard',
                    'siswa': '/student/dashboard'
                }
                const redirectUrl = redirectMap[userRole as keyof typeof redirectMap] || '/'
                return NextResponse.redirect(new URL(redirectUrl, request.url))
            }
        }

        if (path.startsWith('/student')) {
            if (userRole !== 'siswa') {
                const redirectMap = {
                    'admin': '/admin/dashboard',
                    'pembina': '/teacher/dashboard'
                }
                const redirectUrl = redirectMap[userRole as keyof typeof redirectMap] || '/'
                return NextResponse.redirect(new URL(redirectUrl, request.url))
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
