/**
 * Centralized Form Field Configurations
 * Reusable field configs for all forms in the application
 * All forms can use these standardized configs
 */

import { FieldConfig } from '@/components/shared/DynamicForm'
import type { Class } from '@/types'

// User Form Fields (for UserFormModal and UserForm)
export const getUserFormFields = (classes: Class[]): FieldConfig[] => [
    {
        name: 'full_name',
        type: 'text',
        label: 'Nama Lengkap',
        placeholder: 'Masukkan nama lengkap',
        required: true,
        columnSpan: 2
    },
    {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'email@example.com',
        required: true
    },
    {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Masukkan password',
        required: true,
        helperText: 'Minimal 6 karakter'
    },
    {
        name: 'phone',
        type: 'tel',
        label: 'Nomor Telepon',
        placeholder: '081234567890',
        required: true
    },
    {
        name: 'birth_date',
        type: 'text',
        label: 'Tanggal Lahir',
        placeholder: 'YYYY-MM-DD',
        required: true
    },
    {
        name: 'gender',
        type: 'select',
        label: 'Jenis Kelamin',
        required: true,
        options: [
            { value: '', label: 'Pilih jenis kelamin' },
            { value: 'Laki-laki', label: 'Laki-laki' },
            { value: 'Perempuan', label: 'Perempuan' }
        ]
    },
    {
        name: 'class_id',
        type: 'select',
        label: 'Kelas',
        required: true,
        options: [
            { value: '', label: 'Pilih kelas' },
            ...classes.map(c => ({ value: c.id, label: c.name }))
        ]
    },
    {
        name: 'role',
        type: 'select',
        label: 'Peran',
        required: true,
        options: [
            { value: 'siswa', label: 'Siswa' },
            { value: 'pembina', label: 'Pembina' }
        ]
    },
    {
        name: 'address',
        type: 'textarea',
        label: 'Alamat Rumah',
        placeholder: 'Masukkan alamat lengkap',
        required: true,
        rows: 4,
        columnSpan: 2
    }
]

// Profile Edit Form Fields
export const profileEditFormFields: FieldConfig[] = [
    {
        name: 'full_name',
        type: 'text',
        label: 'Nama Lengkap',
        placeholder: 'Masukkan nama lengkap',
        required: true
    },
    {
        name: 'phone',
        type: 'tel',
        label: 'Nomor Telepon',
        placeholder: '081234567890',
        required: true
    },
    {
        name: 'gender',
        type: 'select',
        label: 'Jenis Kelamin',
        required: true,
        options: [
            { value: '', label: 'Pilih jenis kelamin' },
            { value: 'Laki-laki', label: 'Laki-laki' },
            { value: 'Perempuan', label: 'Perempuan' }
        ]
    },
    {
        name: 'birth_date',
        type: 'text',
        label: 'Tanggal Lahir',
        placeholder: 'YYYY-MM-DD',
        required: true
    },
    {
        name: 'address',
        type: 'textarea',
        label: 'Alamat Rumah',
        placeholder: 'Masukkan alamat lengkap',
        required: true,
        rows: 4,
        columnSpan: 2
    }
]

// Contact Form Fields
export const contactFormFields: FieldConfig[] = [
    {
        name: 'full_name',
        type: 'text',
        label: 'Nama Lengkap',
        placeholder: 'Masukkan nama lengkap',
        required: true,
        columnSpan: 2
    },
    {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'email@example.com',
        required: true
    },
    {
        name: 'phone',
        type: 'tel',
        label: 'Nomor Telepon',
        placeholder: '081234567890',
        required: true
    },
    {
        name: 'subject',
        type: 'select',
        label: 'Subjek',
        required: true,
        options: [
            { value: '', label: 'Pilih subjek...' },
            { value: 'pertanyaan', label: 'Pertanyaan' },
            { value: 'saran', label: 'Saran' },
            { value: 'keluhan', label: 'Keluhan' }
        ]
    },
    {
        name: 'message',
        type: 'textarea',
        label: 'Pesan',
        placeholder: 'Tulis pesan Anda...',
        required: true,
        rows: 6,
        maxLength: 500,
        showCharCount: true,
        columnSpan: 2
    }
]

// Reward/Product Form Fields
export const productFormFields: FieldConfig[] = [
    {
        name: 'name',
        type: 'text',
        label: 'Nama Produk',
        placeholder: 'Masukkan nama produk',
        required: true,
        columnSpan: 2
    },
    {
        name: 'price',
        type: 'number',
        label: 'Harga (Poin)',
        placeholder: '0',
        required: true,
        min: 0
    },
    {
        name: 'stock',
        type: 'number',
        label: 'Stok',
        placeholder: '0',
        required: true,
        min: 0
    },
    {
        name: 'description',
        type: 'textarea',
        label: 'Deskripsi',
        placeholder: 'Masukkan deskripsi produk',
        required: true,
        rows: 4,
        columnSpan: 2
    }
]

// Login Form Fields
export const loginFormFields: FieldConfig[] = [
    {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'email@example.com',
        required: true,
        columnSpan: 2
    },
    {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Masukkan password',
        required: true,
        columnSpan: 2
    }
]

// Export all configs
export const formConfigs = {
    getUserFormFields,
    profileEditFormFields,
    contactFormFields,
    productFormFields,
    loginFormFields
}
