/**
 * Admin - Edit Pengguna Page
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import UserForm, { UserFormData } from '@/components/admin/UserForm'
import { getUserById, updateUser } from '@/actions/admin/users'
import type { Class, Profile } from '@/types'

// Menu items for Admin
const adminMenuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Pengguna', href: '/admin/pengguna' },
    { label: 'Hadiah', href: '/admin/hadiah' },
    { label: 'Konten Publik', href: '/admin/konten' },
    { label: 'Profil', href: '/admin/profil' },
]

export default function EditPenggunaPage() {
    const router = useRouter()
    const params = useParams()
    const userId = params.id as string

    const [user, setUser] = useState<Profile | null>(null)
    const [classes, setClasses] = useState<Class[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
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

    // Fetch user and classes
    useEffect(() => {
        async function fetchData() {
            setPageLoading(true)

            // Fetch user
            const userResult = await getUserById(userId)
            if (userResult.success && userResult.data) {
                setUser(userResult.data)
            } else {
                alert('Pengguna tidak ditemukan')
                router.push('/admin/pengguna')
                return
            }

            // Fetch classes
            try {
                const response = await fetch('/api/classes')
                if (response.ok) {
                    const data = await response.json()
                    setClasses(data)
                }
            } catch (error) {
                console.error('Error fetching classes:', error)
            }

            setPageLoading(false)
        }
        fetchData()
    }, [userId, router])

    const handleSubmit = async (data: UserFormData) => {
        setIsLoading(true)

        const result = await updateUser(userId, {
            full_name: data.full_name,
            phone: data.phone || undefined,
            gender: data.gender || undefined,
            birth_date: data.birth_date || undefined,
            address: data.address || undefined,
            role: data.role,
            class_id: data.class_id,
            password: data.password || undefined
        })

        if (result.success) {
            router.push('/admin/pengguna')
        } else {
            alert(result.error || 'Gagal mengubah pengguna')
        }

        setIsLoading(false)
    }

    const textColor = isDarkMode ? '#ea580c' : 'var(--primary-900)'

    if (pageLoading) {
        return (
            <DashboardLayout role="Admin" menuItems={adminMenuItems}>
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout role="Admin" menuItems={adminMenuItems}>
            <h1
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ color: textColor }}
            >
                Edit Pengguna
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <UserForm
                    mode="edit"
                    initialData={{
                        full_name: user?.full_name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        gender: user?.gender || '',
                        birth_date: user?.birth_date || '',
                        address: user?.address || '',
                        role: user?.role || 'siswa',
                        class_id: user?.class_id || null
                    }}
                    classes={classes}
                    onSubmit={handleSubmit}
                    onCancel={() => router.push('/admin/pengguna')}
                    isLoading={isLoading}
                />
            </div>
        </DashboardLayout>
    )
}
