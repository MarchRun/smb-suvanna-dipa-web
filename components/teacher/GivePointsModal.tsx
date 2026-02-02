/**
 * Give Points Modal Component
 * Modal form for teacher to give points to students
 * Uses shared Input/Textarea components for consistent UI
 */

'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/shared/ui/Modals'
import { Input, Textarea } from '@/components/shared/ui/FormElements'
import type { Profile } from '@/types'

interface GivePointsModalProps {
    isOpen: boolean
    onClose: () => void
    student: Profile | null
    onSubmit: (amount: number, reason: string) => Promise<void>
    isLoading?: boolean
}

export default function GivePointsModal({
    isOpen,
    onClose,
    student,
    onSubmit,
    isLoading = false
}: GivePointsModalProps) {
    const [amount, setAmount] = useState('')
    const [reason, setReason] = useState('')
    const [error, setError] = useState('')

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setAmount('')
            setReason('')
            setError('')
        }
    }, [isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        const pointAmount = parseInt(amount)
        if (isNaN(pointAmount) || pointAmount === 0) {
            setError('Jumlah poin harus berupa angka dan tidak boleh 0')
            return
        }

        if (!reason.trim()) {
            setError('Alasan pemberian poin harus diisi')
            return
        }

        await onSubmit(pointAmount, reason.trim())
    }

    const textColor = '#E57526'
    const buttonBgColor = '#E57526'

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={false}
        >
            <div className="p-6 md:p-8">
                {/* Title */}
                <h2
                    className="text-2xl md:text-3xl font-bold mb-2"
                    style={{ color: textColor }}
                >
                    Beri Poin
                </h2>
                {student && (
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Siswa: <span className="font-semibold">{student.full_name}</span>
                    </p>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Jumlah Poin - Using shared Input component */}
                    <Input
                        label="Jumlah Poin"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Masukkan jumlah poin (bisa negatif)"
                        disabled={isLoading}
                        required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2 ml-1">
                        Gunakan nilai negatif untuk mengurangi poin
                    </p>

                    {/* Alasan Pemberian Poin - Using shared Textarea component */}
                    <Textarea
                        label="Alasan Pemberian Poin"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Masukkan alasan pemberian poin"
                        rows={4}
                        disabled={isLoading}
                        required
                    />

                    {/* Buttons - Same style as UniversalForm */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-3 px-6 rounded-xl border-2 font-bold
                                     border-orange-600 text-orange-600 
                                     hover:bg-orange-50 dark:hover:bg-orange-900/20
                                     transition-all disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-3 px-6 rounded-xl font-bold text-white 
                                     transition-all disabled:opacity-50 hover:opacity-90"
                            style={{ backgroundColor: buttonBgColor }}
                        >
                            {isLoading ? 'Menyimpan...' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}
