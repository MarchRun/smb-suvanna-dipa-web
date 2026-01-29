/**
 * Filter Form - Using UniversalForm
 * Consistent UI with other forms
 */

'use client'

import { useState } from 'react'
import UniversalForm, { FieldConfig } from '@/components/shared/forms/UniversalForm'

interface FilterFormProps {
    onApply: (filters: {
        stockStatus: 'all' | 'in-stock' | 'out-of-stock'
        sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-desc'
    }) => void
    onReset: () => void
    onClose: () => void
}

export default function FilterForm({ onApply, onReset, onClose }: FilterFormProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [isAnimating, setIsAnimating] = useState(true)

    // Field configuration
    const filterFields: FieldConfig[] = [
        {
            name: 'stockStatus',
            type: 'select',
            label: 'Ketersediaan Stok',
            required: false,
            options: [
                { value: 'all', label: 'Semua' },
                { value: 'in-stock', label: 'Tersedia' },
                { value: 'out-of-stock', label: 'Habis' }
            ],
            columnSpan: 2
        },
        {
            name: 'sortBy',
            type: 'select',
            label: 'Urutkan Berdasarkan',
            required: false,
            options: [
                { value: 'name-asc', label: 'Nama (A-Z)' },
                { value: 'name-desc', label: 'Nama (Z-A)' },
                { value: 'price-asc', label: 'Harga (Rendah ke Tinggi)' },
                { value: 'price-desc', label: 'Harga (Tinggi ke Rendah)' },
                { value: 'stock-desc', label: 'Stok (Terbanyak)' }
            ],
            columnSpan: 2
        }
    ]

    const handleSubmit = async (data: Record<string, any>) => {
        onApply({
            stockStatus: data.stockStatus || 'all',
            sortBy: data.sortBy || 'name-asc'
        })
        handleClose()
    }

    const handleReset = () => {
        onReset()
        handleClose()
    }

    const handleClose = () => {
        setIsAnimating(false)
        setTimeout(() => {
            setIsVisible(false)
            onClose()
        }, 200)
    }

    const handleBackdropClick = () => {
        handleClose()
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with fade */}
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 
                           ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleBackdropClick}
            />

            {/* Modal with scale+fade */}
            <div
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full
                           transition-all duration-200
                           ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 md:p-8">
                    <UniversalForm
                        title="Filter Hadiah"
                        mode="create"
                        fields={filterFields}
                        initialData={{ stockStatus: 'all', sortBy: 'name-asc' }}
                        onSubmit={handleSubmit}
                        submitLabel="Terapkan"
                        cancelLabel="Reset"
                        onCancel={handleReset}
                    />
                </div>
            </div>
        </div>
    )
}
