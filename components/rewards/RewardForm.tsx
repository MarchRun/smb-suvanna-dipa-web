/**
 * Reward Form Component
 * Form for adding/editing products (hadiah)
 */

'use client'

import { useState, useEffect } from 'react'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import { uploadProfilePicture } from '@/actions/profile/uploadPicture'
import type { Product } from '@/actions/admin/products'

interface RewardFormProps {
    mode: 'add' | 'edit'
    initialData?: Product
    onSubmit: (data: { name: string; price: number; stock: number; image?: File }) => Promise<void>
    onCancel: () => void
}

export default function RewardForm({ mode, initialData, onSubmit, onCancel }: RewardFormProps) {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [name, setName] = useState(initialData?.name || '')
    const [price, setPrice] = useState(initialData?.price?.toString() || '')
    const [stock, setStock] = useState(initialData?.stock?.toString() || '')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
            setError('Format file harus JPG atau PNG')
            return
        }

        // Validate file size (max 2MB - same as profile pictures)
        if (file.size > 2 * 1024 * 1024) {
            setError('Ukuran file maksimal 2MB')
            return
        }

        setImageFile(file)
        setError('')

        // Generate preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (!name.trim()) {
            setError('Nama hadiah harus diisi')
            return
        }

        const priceNum = parseInt(price)
        if (isNaN(priceNum) || priceNum < 0) {
            setError('Harga harus angka positif')
            return
        }

        const stockNum = parseInt(stock)
        if (isNaN(stockNum) || stockNum < 0) {
            setError('Stok harus angka positif')
            return
        }

        setLoading(true)
        try {
            await onSubmit({
                name: name.trim(),
                price: priceNum,
                stock: stockNum,
                image: imageFile || undefined
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
            setLoading(false)
        }
    }

    const textColor = isDarkMode ? '#ea580c' : '#7c2d12'

    return (
        <div className="max-w-2xl mx-auto">
            <h2
                className="text-2xl font-bold mb-6"
                style={{ color: textColor }}
            >
                {mode === 'add' ? 'Tambah Hadiah' : 'Edit Hadiah'}
            </h2>

            {error && (
                <div className="mb-4 p-4 rounded-lg bg-red-100 border-2 border-red-500 text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Nama Hadiah"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                />

                <div>
                    <label
                        className="block text-sm font-bold mb-2"
                        style={{ color: textColor }}
                    >
                        Harga Hadiah (poin)
                    </label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="0"
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-xl border-2 font-semibold"
                        style={{
                            borderColor: textColor,
                            color: textColor
                        }}
                    />
                </div>

                <div>
                    <label
                        className="block text-sm font-bold mb-2"
                        style={{ color: textColor }}
                    >
                        Stok Hadiah
                    </label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        min="0"
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-xl border-2 font-semibold"
                        style={{
                            borderColor: textColor,
                            color: textColor
                        }}
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label
                        className="block text-sm font-bold mb-2"
                        style={{ color: textColor }}
                    >
                        Gambar Hadiah
                    </label>

                    {imagePreview && (
                        <div className="mb-4">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg border-2"
                                style={{ borderColor: textColor }}
                            />
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleImageChange}
                        disabled={loading}
                        className="block w-full text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Format: JPG atau PNG, Maksimal 2MB
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    <Button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        variant="secondary"
                        fullWidth
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? 'Menyimpan...' : mode === 'add' ? 'Tambah' : 'Konfirmasi Perubahan'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
