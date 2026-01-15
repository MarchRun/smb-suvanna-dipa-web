/**
 * Reward Form - Using UniversalForm
 * Form for adding/editing products (hadiah)
 */

'use client'

import UniversalForm, { FieldConfig } from '@/components/shared/UniversalForm'
import { productFormFields } from '@/lib/forms/fieldConfigs'
import type { Product } from '@/actions/admin/products'

interface RewardFormProps {
    mode: 'add' | 'edit'
    initialData?: Product
    onSubmit: (data: { name: string; price: number; stock: number; image?: File }) => Promise<void>
    onCancel: () => void
}

export default function RewardForm({ mode, initialData, onSubmit, onCancel }: RewardFormProps) {
    const formInitialData = {
        name: initialData?.name || '',
        price: initialData?.price || '',
        stock: initialData?.stock || ''
    }

    const handleSubmit = async (data: Record<string, any>) => {
        await onSubmit({
            name: data.name,
            price: Number(data.price),
            stock: Number(data.stock),
            image: data.image
        })
    }

    return (
        <UniversalForm
            title={mode === 'add' ? 'Tambah Hadiah' : 'Edit Hadiah'}
            mode={mode === 'add' ? 'create' : 'edit'}
            fields={productFormFields}
            initialData={formInitialData}
            onSubmit={handleSubmit}
            onCancel={onCancel}
        />
    )
}
