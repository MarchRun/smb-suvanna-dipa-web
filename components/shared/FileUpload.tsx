/**
 * File Upload Component
 * Reusable component for uploading images with preview
 * Max size: 1MB, Formats: JPEG, PNG
 */

'use client'

import { useRef, useState } from 'react'

interface FileUploadProps {
    label: string
    onFileSelect: (file: File | null) => void
    previewUrl: string | null
    accept?: string
    maxSize?: number // in bytes
    helperText?: string
}

export default function FileUpload({
    label,
    onFileSelect,
    previewUrl,
    accept = 'image/jpeg,image/jpg,image/png',
    maxSize = 1 * 1024 * 1024, // 1MB default
    helperText = 'Format: JPEG, PNG. Maksimal 1MB.'
}: FileUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState('')
    const [fileName, setFileName] = useState('')

    // Determine if dark mode is active
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Check dark mode on mount
    if (typeof window !== 'undefined') {
        const checkDark = document.documentElement.classList.contains('dark')
        if (checkDark !== isDarkMode) {
            setIsDarkMode(checkDark)
        }
    }

    const textColor = '#E57526' // Logo orange

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setError('')

        if (!file) {
            onFileSelect(null)
            setFileName('')
            return
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
        if (!validTypes.includes(file.type)) {
            setError('Format file tidak valid. Gunakan JPEG atau PNG.')
            onFileSelect(null)
            setFileName('')
            return
        }

        // Validate file size
        if (file.size > maxSize) {
            const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0)
            setError(`Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB.`)
            onFileSelect(null)
            setFileName('')
            return
        }

        setFileName(file.name)
        onFileSelect(file)
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div>
            <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                {label}
            </label>

            <div className="flex gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <input
                    type="text"
                    value={fileName || (previewUrl ? 'File dipilih' : '')}
                    placeholder="Pilih file..."
                    readOnly
                    className="flex-1 px-4 py-2.5 rounded-l-full border-2 border-r-0 cursor-pointer
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    style={{ borderColor: textColor }}
                    onClick={handleClick}
                />

                <button
                    type="button"
                    onClick={handleClick}
                    className="px-6 py-2.5 rounded-r-full font-bold text-white transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: textColor }}
                >
                    Upload
                </button>
            </div>

            {helperText && !error && (
                <p className="text-gray-500 text-xs mt-1">{helperText}</p>
            )}

            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}

            {previewUrl && (
                <div className="mt-3">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                    />
                </div>
            )}
        </div>
    )
}
