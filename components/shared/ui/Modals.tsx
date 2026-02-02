'use client'

import React, { useEffect, useState } from 'react'
import UniversalForm, { FieldConfig } from '@/components/shared/forms/UniversalForm'
import type { Class } from '@/types'

// --- Modal Component ---
export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    children: React.ReactNode
    showCloseButton?: boolean
    preventBackdropClose?: boolean
}

export function Modal({
    isOpen,
    onClose,
    title,
    size = 'md',
    children,
    showCloseButton = true,
    preventBackdropClose = false
}: ModalProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true)
                })
            })
        } else {
            setIsAnimating(false)
            const timer = setTimeout(() => {
                setIsVisible(false)
            }, 200)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

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

    if (!isVisible) return null

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-[95vw]'
    }

    const handleBackdropClick = () => {
        if (!preventBackdropClose) {
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 
                           ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleBackdropClick}
                aria-hidden="true"
            />
            <div
                className={`relative bg-white dark:bg-gray-800 shadow-xl w-full ${sizeClasses[size]} 
                           max-h-[95vh] overflow-hidden rounded-2xl
                           transition-all duration-200
                           ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        {title && (
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                                         dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 
                                         rounded-lg transition-all"
                                aria-label="Close modal"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
                <div className="max-h-[calc(95vh-80px)] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

// --- ConfirmDialog Component ---
export interface ConfirmDialogProps {
    isOpen: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void
    onCancel: () => void
    variant?: 'danger' | 'warning' | 'info'
    isLoading?: boolean
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Konfirmasi',
    cancelLabel = 'Batal',
    onConfirm,
    onCancel,
    variant = 'danger',
    isLoading = false
}: ConfirmDialogProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onCancel()
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onCancel])

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

    const variantStyles = {
        danger: 'bg-red-600 hover:bg-red-700',
        warning: 'bg-yellow-600 hover:bg-yellow-700',
        info: 'bg-blue-600 hover:bg-blue-700'
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                <h3 className="text-lg font-bold mb-2" style={{ color: '#E57526' }}>
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {message}
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                                 transition-all duration-200 disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg text-white
                                  transition-all duration-200 disabled:opacity-50
                                  ${variantStyles[variant]}`}
                    >
                        {isLoading ? 'Loading...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- ImageModal Component ---
export interface ImageModalProps {
    isOpen: boolean
    imageUrl: string
    caption?: string
    onClose: () => void
}

export function ImageModal({ isOpen, imageUrl, caption, onClose }: ImageModalProps) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center text-white z-10"
                title="Close (ESC)"
                aria-label="Close"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div
                className="max-w-5xl max-h-[90vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageUrl}
                    alt={caption || 'Image'}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
                {caption && (
                    <p className="mt-4 text-white text-center text-lg font-semibold">
                        {caption}
                    </p>
                )}
            </div>
        </div>
    )
}

// --- FilterModal Component ---
export interface FilterValues {
    role: string | null
    classId: number | null
    gender: string | null
}

export interface FilterModalProps {
    isOpen: boolean
    onClose: () => void
    onApply: (filters: FilterValues) => void
    classes: Class[]
    initialValues?: FilterValues
}

export function FilterModal({
    isOpen,
    onClose,
    onApply,
    classes,
    initialValues
}: FilterModalProps) {
    const [internalValues, setInternalValues] = useState<FilterValues>({
        role: initialValues?.role || null,
        classId: initialValues?.classId || null,
        gender: initialValues?.gender || null
    })

    useEffect(() => {
        if (isOpen) {
            setInternalValues({
                role: initialValues?.role || null,
                classId: initialValues?.classId || null,
                gender: initialValues?.gender || null
            })
        }
    }, [isOpen, initialValues])

    const filterFields: FieldConfig[] = [
        {
            name: 'role',
            type: 'select',
            label: 'Peran',
            required: false,
            options: [
                { value: '', label: 'Semua Peran' },
                { value: 'siswa', label: 'Siswa' },
                { value: 'pembina', label: 'Pembina' }
            ],
            columnSpan: 2
        },
        {
            name: 'classId',
            type: 'select',
            label: 'Kelas',
            required: false,
            options: [
                { value: '', label: 'Semua Kelas' },
                ...classes.map(c => ({ value: c.id, label: c.name }))
            ],
            columnSpan: 2
        },
        {
            name: 'gender',
            type: 'select',
            label: 'Gender',
            required: false,
            options: [
                { value: '', label: 'Semua Gender' },
                { value: 'Laki-laki', label: 'Laki-laki' },
                { value: 'Perempuan', label: 'Perempuan' }
            ],
            columnSpan: 2
        }
    ]

    const handleApply = async (data: Record<string, any>) => {
        onApply({
            role: data.role || null,
            classId: data.classId ? Number(data.classId) : null,
            gender: data.gender || null
        })
        onClose()
    }

    const handleReset = () => {
        onApply({ role: null, classId: null, gender: null })
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={false}
        >
            <div className="p-6">
                <UniversalForm
                    title="Filter Pengguna"
                    mode="create"
                    fields={filterFields}
                    initialData={{
                        role: internalValues.role || '',
                        classId: internalValues.classId || '',
                        gender: internalValues.gender || ''
                    }}
                    onSubmit={handleApply}
                    submitLabel="Terapkan"
                    cancelLabel="Reset"
                    onCancel={handleReset}
                />
            </div>
        </Modal>
    )
}
