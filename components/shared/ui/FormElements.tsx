'use client'

import React, { useState, useRef } from 'react'

// --- Input Component ---
interface InputProps {
    label?: string
    type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date'
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    disabled?: boolean
    error?: string
}

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
)

const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
)

export function Input({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    disabled = false,
    error
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type
    const textColor = '#E57526'

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                    {label}
                    {required && <span className="text-red-600 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className={`w-full px-4 py-2 sm:px-4 sm:py-2.5 rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all placeholder:text-gray-500 ${isPassword ? 'pr-12' : ''} ${value === '' ? 'text-gray-500' : 'text-gray-900'}`}
                    style={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #E57526'
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#E57526'
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(229, 117, 38, 0.15)'
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#E57526'
                        e.currentTarget.style.boxShadow = 'none'
                    }}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
        </div>
    )
}

// --- Select Component ---
export interface SelectOption {
    value: string | number
    label: string
}

interface SelectProps {
    label?: string
    value: string | number
    onChange: (value: string) => void
    options: SelectOption[]
    placeholder?: string
    required?: boolean
    error?: string
    disabled?: boolean
    helperText?: string
    className?: string
}

export function Select({
    label,
    value,
    onChange,
    options,
    placeholder = 'Pilih...',
    required = false,
    error,
    disabled = false,
    helperText,
    className = ''
}: SelectProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value)
    }

    const borderColor = '#E57526'
    const textColor = '#E57526'

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className={`w-full px-4 py-2.5 rounded-full border-2 font-semibold transition-all
                           bg-white focus:outline-none focus:ring-2 focus:ring-orange-500
                           disabled:opacity-50 disabled:cursor-not-allowed
                           ${value === '' ? 'text-gray-500' : 'text-gray-900'}
                           ${error ? 'border-red-500' : ''}`}
                style={{
                    borderColor: error ? '#ef4444' : borderColor
                }}
            >
                {placeholder && !options.some(o => o.value === '') && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option
                        key={String(option.value)}
                        value={option.value}
                        className={option.value === '' ? 'text-gray-500' : 'text-gray-900'}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-gray-500 text-xs mt-1">{helperText}</p>
            )}
        </div>
    )
}

// --- Button Component ---
interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
    fullWidth?: boolean
    disabled?: boolean
    className?: string
    noShadow?: boolean
    customStyle?: React.CSSProperties
}

export function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    fullWidth = false,
    disabled = false,
    className = '',
    noShadow = false,
    customStyle = {}
}: ButtonProps) {
    const baseStyles = "px-4 py-2 sm:px-6 sm:py-3 font-semibold border-2 transition-all duration-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"

    const variantStyles = {
        primary: "text-white border-transparent hover:scale-105",
        secondary: "bg-transparent"
    }

    const widthStyles = fullWidth ? "w-full" : ""
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`

    if (variant === 'primary') {
        return (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={combinedClassName}
                style={{
                    backgroundColor: disabled ? '#cbd5e1' : '#E57526',
                    color: '#ffffff',
                    opacity: disabled ? 0.6 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    boxShadow: 'none',
                    ...customStyle
                }}
            >
                {children}
            </button>
        )
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={combinedClassName}
            style={{
                color: 'var(--primary-600)',
                borderColor: 'var(--primary-600)'
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.background = 'var(--primary-100)'
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
            }}
        >
            {children}
        </button>
    )
}

// --- Textarea Component ---
interface TextareaProps {
    label?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    placeholder?: string
    required?: boolean
    error?: string
    disabled?: boolean
    rows?: number
    maxLength?: number
    showCharCount?: boolean
    helperText?: string
    className?: string
}

export function Textarea({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    error,
    disabled = false,
    rows = 4,
    maxLength,
    showCharCount = false,
    helperText,
    className = ''
}: TextareaProps) {
    const borderColor = '#E57526'
    const textColor = '#E57526'

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                maxLength={maxLength}
                className={`w-full px-4 py-3 rounded-xl border-2 font-semibold transition-all resize-none
                           bg-white text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-orange-500
                           disabled:opacity-50 disabled:cursor-not-allowed
                           ${error ? 'border-red-500' : ''}`}
                style={{
                    borderColor: error ? '#ef4444' : borderColor
                }}
            />
            <div className="flex justify-between items-center mt-1">
                <div>
                    {error && (
                        <p className="text-red-500 text-xs">{error}</p>
                    )}
                    {helperText && !error && (
                        <p className="text-gray-500 text-xs">{helperText}</p>
                    )}
                </div>
                {showCharCount && maxLength && (
                    <p className="text-gray-500 text-xs">
                        {value.length}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    )
}

// --- FileUpload Component ---
interface FileUploadProps {
    label: string
    onFileSelect: (file: File | null) => void
    previewUrl: string | null
    accept?: string
    maxSize?: number
    helperText?: string
}

export function FileUpload({
    label,
    onFileSelect,
    previewUrl,
    accept = 'image/jpeg,image/jpg,image/png',
    maxSize = 1 * 1024 * 1024,
    helperText = 'Format: JPEG, PNG. Maksimal 1MB.'
}: FileUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState('')
    const [fileName, setFileName] = useState('')

    const textColor = '#E57526'

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setError('')

        if (!file) {
            onFileSelect(null)
            setFileName('')
            return
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
        if (!validTypes.includes(file.type)) {
            setError('Format file tidak valid. Gunakan JPEG atau PNG.')
            onFileSelect(null)
            setFileName('')
            return
        }

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
                             bg-white text-gray-900"
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
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                </div>
            )}
        </div>
    )
}
