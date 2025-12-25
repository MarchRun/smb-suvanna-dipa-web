/**
 * Login Form Component (for visitor landing page)
 * Connected to Supabase Auth via server action
 * Wireframe style with responsive layout
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/actions/auth/login'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'

export default function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await login({ email, password })

            if (!result.success) {
                setError(result.error || 'Login failed')
                setLoading(false)
                return
            }

            // Redirect based on role
            const role = result.data?.role
            switch (role) {
                case 'siswa':
                    router.push('/student/dashboard')
                    break
                case 'guru':
                    router.push('/teacher/dashboard')
                    break
                case 'admin':
                    router.push('/admin/dashboard')
                    break
                default:
                    setError('Invalid user role')
                    setLoading(false)
            }
        } catch (err) {
            setError('An unexpected error occurred')
        }
    }

    return (
        <div
            className="p-6 sm:p-8 rounded-xl shadow-2xl border-4 transition-all duration-300 hover:scale-105"
            style={{
                backgroundColor: 'white',
                borderColor: 'var(--primary-500)',
                boxShadow: '0 0 30px rgba(249, 115, 22, 0.6)' // Bright orange glow
            }}
        >
            <h2
                className="text-2xl sm:text-3xl font-bold text-center mb-6"
                style={{ color: 'var(--primary-600)' }}
            >
                Gerbang Masuk
            </h2>

            {error && (
                <div
                    className="border-2 px-4 py-3 rounded-lg mb-4"
                    style={{
                        backgroundColor: '#fee2e2',
                        borderColor: '#dc2626',
                        color: '#991b1b'
                    }}
                >
                    <p className="text-sm font-semibold">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />

                <div className="text-right">
                    <Link
                        href="/forgot-password"
                        className="text-sm font-semibold hover:underline transition-colors"
                        style={{ color: 'var(--primary-600)' }}
                    >
                        Lupa Password?
                    </Link>
                </div>

                <Button type="submit" fullWidth disabled={loading} noShadow>
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </div>
    )
}
