/**
 * DynamicForm Component
 * Universal form builder that auto-generates forms from field configuration
 * Handles validation, state management, layout, and error display automatically
 */

'use client'

import { useState, FormEvent } from 'react'
import Input from '@/components/shared/Input'
import Select from '@/components/shared/Select'
import Textarea from '@/components/shared/Textarea'
import FileUpload from '@/components/shared/FileUpload'

// Field type options
export type FieldType =
    | 'text'
    | 'email'
    | 'password'
    | 'tel'
    | 'date'
    | 'number'
    | 'select'
    | 'textarea'
    | 'file'

// Select option interface
export interface SelectOption {
    value: string | number
    label: string
}

// Field configuration interface
export interface FieldConfig {
    name: string
    type: FieldType
    label: string
    placeholder?: string
    required?: boolean
    disabled?: boolean

    // Type-specific props
    options?: SelectOption[]      // For select
    rows?: number                 // For textarea
    accept?: string               // For file
    maxSize?: number              // For file (bytes)
    min?: number | string         // For number/date
    max?: number | string         // For number/date
    pattern?: RegExp              // Custom validation
    maxLength?: number            // For text/textarea
    showCharCount?: boolean       // For textarea

    // UI props
    helperText?: string
    columnSpan?: 1 | 2            // Grid layout

    // Custom validation function
    validate?: (value: any) => string | undefined
}

// Component props
export interface DynamicFormProps {
    fields: FieldConfig[]
    initialData?: Record<string, any>
    onSubmit: (data: Record<string, any>) => Promise<void>
    submitLabel?: string
    cancelLabel?: string
    onCancel?: () => void
    isLoading?: boolean
    columns?: 1 | 2
    className?: string
}

export default function DynamicForm({
    fields,
    initialData = {},
    onSubmit,
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
    onCancel,
    isLoading = false,
    columns = 2,
    className = ''
}: DynamicFormProps) {
    // Form state
    const [formData, setFormData] = useState<Record<string, any>>(initialData)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    // Validate single field
    const validateField = (field: FieldConfig, value: any): string | undefined => {
        // Required validation
        if (field.required && (!value || value === '')) {
            return `${field.label} wajib diisi`
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
                return 'Format email tidak valid'
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                return 'Format nomor telepon tidak valid'
            }
        }

        // Number min/max validation
        if (field.type === 'number' && value !== '' && value !== null) {
            const numValue = Number(value)
            if (field.min !== undefined && numValue < Number(field.min)) {
                return `Minimal ${field.min}`
            }
            if (field.max !== undefined && numValue > Number(field.max)) {
                return `Maksimal ${field.max}`
            }
        }

        // Text length validation
        if ((field.type === 'text' || field.type === 'textarea') && value) {
            if (field.maxLength && value.length > field.maxLength) {
                return `Maksimal ${field.maxLength} karakter`
            }
        }

        // Pattern validation
        if (field.pattern && value) {
            if (!field.pattern.test(value)) {
                return 'Format tidak valid'
            }
        }

        // Custom validation
        if (field.validate) {
            return field.validate(value)
        }

        return undefined
    }

    // Validate all fields
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        fields.forEach(field => {
            const value = formData[field.name]
            const error = validateField(field, value)
            if (error) {
                newErrors[field.name] = error
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle field change
    const handleFieldChange = (fieldName: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }))

        // Clear error when user types
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[fieldName]
                return newErrors
            })
        }
    }

    // Handle field blur (mark as touched)
    const handleFieldBlur = (fieldName: string) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }))

        // Validate on blur
        const field = fields.find(f => f.name === fieldName)
        if (field) {
            const error = validateField(field, formData[fieldName])
            if (error) {
                setErrors(prev => ({ ...prev, [fieldName]: error }))
            }
        }
    }

    // Handle form submit
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        // Validate all fields
        if (!validateForm()) {
            return
        }

        // Submit
        await onSubmit(formData)
    }

    // Render individual field
    const renderField = (field: FieldConfig) => {
        const value = formData[field.name] || ''
        const error = touched[field.name] ? errors[field.name] : undefined
        const disabled = isLoading || field.disabled

        const commonProps = {
            label: field.label,
            value,
            error,
            disabled,
            required: field.required,
            helperText: field.helperText,
            placeholder: field.placeholder
        }

        switch (field.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'tel':
            case 'number':
                return (
                    <Input
                        {...commonProps}
                        type={field.type}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    />
                )

            case 'date':
                // Date input uses Input as text for now
                return (
                    <Input
                        {...commonProps}
                        type="text"
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    />
                )

            case 'select':
                return (
                    <Select
                        {...commonProps}
                        options={field.options || []}
                        onChange={(val) => handleFieldChange(field.name, val)}
                    />
                )

            case 'textarea':
                return (
                    <Textarea
                        {...commonProps}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        rows={field.rows}
                        maxLength={field.maxLength}
                        showCharCount={field.showCharCount}
                    />
                )

            case 'file':
                return (
                    <FileUpload
                        label={field.label}
                        onFileSelect={(file) => handleFieldChange(field.name, file)}
                        accept={field.accept}
                        maxSize={field.maxSize}
                        helperText={field.helperText}
                        previewUrl={formData[`${field.name}_preview`]}
                    />
                )

            default:
                return null
        }
    }

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            {/* Fields Grid */}
            <div className={`grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : ''} gap-4 md:gap-6`}>
                {fields.map((field) => (
                    <div
                        key={field.name}
                        className={field.columnSpan === 2 ? 'md:col-span-2' : ''}
                    >
                        {renderField(field)}
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600
                                 text-gray-700 dark:text-gray-300 font-bold
                                 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200
                                 disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 
                             disabled:opacity-50"
                    style={{ backgroundColor: 'var(--primary-900)' }}
                >
                    {isLoading ? 'Loading...' : submitLabel}
                </button>
            </div>
        </form>
    )
}
