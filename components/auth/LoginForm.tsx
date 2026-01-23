/**
 * Login Form Component
 * Connected to Supabase Auth via server action
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { login } from '@/actions/auth/login'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const isDarkMode = useDarkMode()

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

            const role = result.data?.role
            let redirectUrl = '/'

            if (role === 'siswa') {
                redirectUrl = '/student/dashboard'
            } else if (role === 'pembina') {
                redirectUrl = '/teacher/dashboard'
            } else if (role === 'admin') {
                redirectUrl = '/admin/dashboard'
            }

            window.location.href = redirectUrl
        } catch (err) {
            setError('An unexpected error occurred')
            setLoading(false)
        }
    }

    return (
        <div
            className="p-6 sm:p-8 rounded-xl shadow-2xl border-4 transition-all duration-300 hover:scale-105"
            style={{
                backgroundColor: 'white',
                borderColor: '#E57526', // Logo orange
                boxShadow: '0 4px 20px rgba(229, 117, 38, 0.4)'
            }}
        >
            <h2
                className="text-2xl sm:text-3xl font-bold text-center mb-6"
                style={{ color: '#E57526' }} // Logo orange
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
                        style={{ color: '#E57526' }} // Logo orange
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
