/**
 * Filter Form Component
 * Modal popup for filtering rewards
 */

'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/shared/Button'

interface FilterFormProps {
    onApply: (filters: {
        stockStatus: 'all' | 'in-stock' | 'out-of-stock'
        sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-desc'
    }) => void
    onReset: () => void
    onClose: () => void
}

export default function FilterForm({ onApply, onReset, onClose }: FilterFormProps) {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [stockStatus, setStockStatus] = useState<'all' | 'in-stock' | 'out-of-stock'>('all')
    const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-desc'>('name-asc')

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

    const handleApply = () => {
        onApply({ stockStatus, sortBy })
        onClose()
    }

    const handleReset = () => {
        setStockStatus('all')
        setSortBy('name-asc')
        onReset()
        onClose()
    }

    const textColor = isDarkMode ? '#ea580c' : '#7c2d12'
    const bgColor = isDarkMode ? '#1e293b' : '#ffffff'

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Modal */}
                <div
                    className="w-full max-w-md rounded-xl p-6 shadow-2xl"
                    style={{ backgroundColor: bgColor }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2
                        className="text-2xl font-bold mb-6"
                        style={{ color: textColor }}
                    >
                        Filter Hadiah
                    </h2>

                    <div className="space-y-6">
                        {/* Stock Status Filter */}
                        <div>
                            <label
                                className="block text-sm font-bold mb-3"
                                style={{ color: textColor }}
                            >
                                Ketersediaan Stok
                            </label>
                            <div className="space-y-2">
                                {[
                                    { value: 'all', label: 'Semua' },
                                    { value: 'in-stock', label: 'Tersedia' },
                                    { value: 'out-of-stock', label: 'Habis' }
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="stockStatus"
                                            value={option.value}
                                            checked={stockStatus === option.value}
                                            onChange={(e) => setStockStatus(e.target.value as any)}
                                            className="w-4 h-4"
                                            style={{ accentColor: textColor }}
                                        />
                                        <span style={{ color: textColor }}>{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Sort Filter */}
                        <div>
                            <label
                                className="block text-sm font-bold mb-3"
                                style={{ color: textColor }}
                            >
                                Urutkan
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full px-4 py-3 rounded-xl border-2 font-semibold"
                                style={{
                                    borderColor: textColor,
                                    color: textColor,
                                    backgroundColor: bgColor
                                }}
                            >
                                <option value="name-asc">Nama A-Z</option>
                                <option value="name-desc">Nama Z-A</option>
                                <option value="price-asc">Harga Terendah</option>
                                <option value="price-desc">Harga Tertinggi</option>
                                <option value="stock-desc">Stok Terbanyak</option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                onClick={handleReset}
                                variant="secondary"
                                fullWidth
                            >
                                Reset
                            </Button>
                            <Button
                                type="button"
                                onClick={handleApply}
                                fullWidth
                            >
                                Terapkan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
