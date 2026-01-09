/**
 * Filter Modal Component
 * Popup modal for filtering data
 */

'use client'

import { useState, useEffect } from 'react'
import type { Class } from '@/types'

interface FilterModalProps {
    isOpen: boolean
    onClose: () => void
    onApply: (filters: FilterValues) => void
    classes: Class[]
    initialValues?: FilterValues
}

export interface FilterValues {
    role: string | null
    classId: number | null
    gender: string | null
}

export default function FilterModal({
    isOpen,
    onClose,
    onApply,
    classes,
    initialValues
}: FilterModalProps) {
    const [role, setRole] = useState<string | null>(initialValues?.role || null)
    const [classId, setClassId] = useState<number | null>(initialValues?.classId || null)
    const [gender, setGender] = useState<string | null>(initialValues?.gender || null)

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setRole(initialValues?.role || null)
            setClassId(initialValues?.classId || null)
            setGender(initialValues?.gender || null)
        }
    }, [isOpen, initialValues])

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleApply = () => {
        onApply({ role, classId, gender })
        onClose()
    }

    const handleReset = () => {
        setRole(null)
        setClassId(null)
        setGender(null)
    }

    const selectClass = "w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
    const labelClass = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Filter Pengguna
                </h3>

                <div className="space-y-5">
                    {/* Peran */}
                    <div>
                        <label className={labelClass}>Peran</label>
                        <select
                            value={role || ''}
                            onChange={(e) => setRole(e.target.value || null)}
                            className={selectClass}
                        >
                            <option value="">Semua Peran</option>
                            <option value="siswa">Siswa</option>
                            <option value="pembina">Pembina</option>
                        </select>
                    </div>

                    {/* Kelas */}
                    <div>
                        <label className={labelClass}>Kelas</label>
                        <select
                            value={classId ?? ''}
                            onChange={(e) => setClassId(e.target.value ? Number(e.target.value) : null)}
                            className={selectClass}
                        >
                            <option value="">Semua Kelas</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className={labelClass}>Gender</label>
                        <select
                            value={gender || ''}
                            onChange={(e) => setGender(e.target.value || null)}
                            className={selectClass}
                        >
                            <option value="">Semua Gender</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-8">
                    <button
                        onClick={handleReset}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600
                                 text-gray-600 dark:text-gray-300 font-medium
                                 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all duration-200"
                        style={{ backgroundColor: 'var(--primary-900)' }}
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    )
}
