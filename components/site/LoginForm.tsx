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
            setLoading(false)
        }
    }

    return (
        <div className="bg-gray-200 border-2 border-black p-6 sm:p-8 rounded">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6">
                Gerbang Masuk
            </h3>

            {error && (
                <div className="bg-red-100 border-2 border-red-600 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">{error}</p>
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
                    <Link href="/forgot-password" className="text-sm text-gray-700 hover:text-black">
                        Lupa Password?
                    </Link>
                </div>

                <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </div>
    )
}
