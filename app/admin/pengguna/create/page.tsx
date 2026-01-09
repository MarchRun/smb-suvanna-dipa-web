/**
 * Admin - Tambah Pengguna Page
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import UserForm, { UserFormData } from '@/components/admin/UserForm'
import { createUser } from '@/actions/admin/users'
import type { Class } from '@/types'

// Menu items for Admin
const adminMenuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pengguna', href: '/admin/pengguna' },
    { label: 'Hadiah', href: '/admin/hadiah' },
    { label: 'Konten Publik', href: '/admin/konten' },
    { label: 'Profil', href: '/admin/profil' },
]

export default function TambahPenggunaPage() {
    const router = useRouter()
    const [classes, setClasses] = useState<Class[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Dark mode detection
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
        checkDarkMode()
        const observer = new MutationObserver(checkDarkMode)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })
        return () => observer.disconnect()
    }, [])

    // Fetch classes
    useEffect(() => {
        async function fetchClasses() {
            try {
                const response = await fetch('/api/classes')
                if (response.ok) {
                    const data = await response.json()
                    setClasses(data)
                }
            } catch (error) {
                console.error('Error fetching classes:', error)
            }
        }
        fetchClasses()
    }, [])

    const handleSubmit = async (data: UserFormData) => {
        setIsLoading(true)

        const result = await createUser({
            email: data.email,
            password: data.password,
            full_name: data.full_name,
            phone: data.phone || undefined,
            gender: data.gender || undefined,
            birth_date: data.birth_date || undefined,
            address: data.address || undefined,
            role: data.role,
            class_id: data.class_id
        })

        if (result.success) {
            router.push('/admin/pengguna')
        } else {
            alert(result.error || 'Gagal menambah pengguna')
        }

        setIsLoading(false)
    }

    const textColor = isDarkMode ? '#ea580c' : 'var(--primary-900)'

    return (
        <DashboardLayout role="Admin" menuItems={adminMenuItems}>
            <h1
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ color: textColor }}
            >
                Tambah Pengguna
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <UserForm
                    mode="create"
                    classes={classes}
                    onSubmit={handleSubmit}
                    onCancel={() => router.push('/admin/pengguna')}
                    isLoading={isLoading}
                />
            </div>
        </DashboardLayout>
    )
}
