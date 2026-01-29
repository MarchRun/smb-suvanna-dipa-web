'use client'

import { useState, FormEvent } from 'react'
import { Input, Select, Textarea, FileUpload } from '@/components/shared/ui/FormElements'

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

export interface SelectOption {
    value: string | number
    label: string
}

export interface FieldConfig {
    name: string
    type: FieldType
    label: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    options?: SelectOption[]
    rows?: number
    accept?: string
    maxSize?: number
    min?: number | string
    max?: number | string
    maxLength?: number
    showCharCount?: boolean
    helperText?: string
    columnSpan?: 1 | 2
    validate?: (value: any) => string | undefined
}

export interface FormSection {
    sectionTitle?: string
    fields: FieldConfig[]
}

export interface UniversalFormProps {
    title: string
    mode?: 'create' | 'edit'
    fields?: FieldConfig[]
    sections?: FormSection[]
    initialData?: Record<string, any>
    onSubmit: (data: Record<string, any>) => Promise<void>
    submitLabel?: string
    cancelLabel?: string
    onCancel?: () => void
    isLoading?: boolean
}

export default function UniversalForm({
    title,
    mode = 'create',
    fields,
    sections,
    initialData = {},
    onSubmit,
    submitLabel,
    cancelLabel = 'Batal',
    onCancel,
    isLoading = false
}: UniversalFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>(initialData)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const defaultSubmitLabel = mode === 'create' ? 'Tambah' : 'Konfirmasi Perubahan'
    const finalSubmitLabel = submitLabel || defaultSubmitLabel

    const validateField = (field: FieldConfig, value: any): string | undefined => {
        if (field.required && (!value || value === '')) {
            return `${field.label} wajib diisi`
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
                return 'Format email tidak valid'
            }
        }

        if (field.type === 'tel' && value) {
            const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                return 'Format nomor telepon tidak valid'
            }
        }

        if (field.validate) {
            return field.validate(value)
        }

        return undefined
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}
        const allFields = sections
            ? sections.flatMap(s => s.fields)
            : (fields || [])

        allFields.forEach(field => {
            const value = formData[field.name]
            const error = validateField(field, value)
            if (error) {
                newErrors[field.name] = error
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleFieldChange = (fieldName: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }))

        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[fieldName]
                return newErrors
            })
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        await onSubmit(formData)
    }

    const renderField = (field: FieldConfig) => {
        const value = formData[field.name] || ''
        const error = errors[field.name]
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
                return (
                    <Input
                        {...commonProps}
                        type="date"
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

    const renderSection = (section: FormSection, index: number) => {
        return (
            <div key={index} className="space-y-4">
                {section.sectionTitle && (
                    <h3 className="text-xl font-bold text-orange-800 border-b-2 border-orange-300 pb-2">
                        {section.sectionTitle}
                    </h3>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {section.fields.map((field) => (
                        <div
                            key={field.name}
                            className={field.columnSpan === 2 ? 'md:col-span-2' : ''}
                        >
                            {renderField(field)}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const titleColor = '#9a3412'
    const buttonBgColor = '#9a3412'

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: titleColor }}
            >
                {title}
            </h2>

            {sections ? (
                <div className="space-y-8">
                    {sections.map((section, index) => renderSection(section, index))}
                </div>
            ) : fields ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {fields.map((field) => (
                        <div
                            key={field.name}
                            className={field.columnSpan === 2 ? 'md:col-span-2' : ''}
                        >
                            {renderField(field)}
                        </div>
                    ))}
                </div>
            ) : null}

            <div className="flex gap-4 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 py-3 px-6 rounded-xl border-2 font-bold
                                 border-orange-600 text-orange-600 
                                 hover:bg-orange-50
                                 transition-all disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 px-6 rounded-xl font-bold text-white 
                             transition-all disabled:opacity-50 hover:opacity-90"
                    style={{ backgroundColor: buttonBgColor }}
                >
                    {isLoading ? 'Loading...' : finalSubmitLabel}
                </button>
            </div>
        </form>
    )
}
