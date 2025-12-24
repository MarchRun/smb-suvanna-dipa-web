/**
 * Login Form Component (for visitor landing page)
 * Wireframe style with responsive layout
 */

'use client'

import { useState } from 'react'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement authentication logic
        console.log('Login attempt:', { email, password })
    }

    return (
        <div className="bg-gray-200 border-2 border-black p-6 sm:p-8 rounded">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6">
                Gerbang Masuk
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className="text-right">
                    <a href="#" className="text-sm text-gray-700 hover:text-black">
                        Lupa Password?
                    </a>
                </div>

                <Button type="submit" fullWidth>
                    Login
                </Button>
            </form>
        </div>
    )
}
