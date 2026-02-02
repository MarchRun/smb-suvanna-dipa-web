/**
 * Unified Reward Card Component
 * Displays product/hadiah with variant-based actions
 * - admin: edit/delete buttons
 * - student: tukar button with point check
 */

'use client'

import type { Product } from '@/types'

interface RewardCardProps {
    reward: Product
    variant: 'admin' | 'student'
    // Student-only props
    studentPoints?: number
    onRedeem?: (reward: Product) => void
    // Admin-only props
    onEdit?: (reward: Product) => void
    onDelete?: (reward: Product) => void
}

export default function RewardCard({
    reward,
    variant,
    studentPoints = 0,
    onRedeem,
    onEdit,
    onDelete
}: RewardCardProps) {
    const textColor = '#E57526'
    const bgColor = '#ffffff'
    const borderColor = '#E57526'

    // Student variant calculations
    const canAfford = studentPoints >= reward.price
    const inStock = reward.stock > 0
    const canRedeem = canAfford && inStock

    return (
        <div
            className="rounded-xl border-2 p-4 flex gap-4 transition-all duration-200 hover:shadow-lg"
            style={{
                backgroundColor: bgColor,
                borderColor: borderColor
            }}
        >
            {/* Product Image */}
            <div
                className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
                style={{
                    backgroundColor: reward.image_url ? 'transparent' : textColor
                }}
            >
                {reward.image_url ? (
                    <img
                        src={reward.image_url}
                        alt={reward.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <h3
                    className="font-bold text-lg mb-2 truncate"
                    style={{ color: textColor }}
                >
                    {reward.name}
                </h3>
                <div className="space-y-1">
                    <p
                        className="text-sm font-semibold"
                        style={{ color: '#64748b' }}
                    >
                        Stok: {reward.stock}
                    </p>
                    <p
                        className="text-sm font-semibold"
                        style={{ color: '#64748b' }}
                    >
                        Harga: {reward.price} poin
                    </p>
                </div>
            </div>

            {/* Action Buttons - Variant Based */}
            {variant === 'admin' ? (
                <div className="flex flex-col gap-2">
                    {/* Edit Button */}
                    <button
                        onClick={() => onEdit?.(reward)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:opacity-80"
                        style={{ backgroundColor: textColor }}
                        title="Edit"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => onDelete?.(reward)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:opacity-80"
                        style={{ backgroundColor: '#dc2626' }}
                        title="Hapus"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col justify-center">
                    <button
                        onClick={() => onRedeem?.(reward)}
                        disabled={!canRedeem}
                        className={`px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 
                            ${canRedeem
                                ? 'hover:opacity-80 cursor-pointer'
                                : 'opacity-50 cursor-not-allowed'
                            }`}
                        style={{ backgroundColor: textColor }}
                        title={
                            !inStock
                                ? 'Stok habis'
                                : !canAfford
                                    ? 'Poin tidak cukup'
                                    : 'Tukar hadiah'
                        }
                    >
                        Tukar
                    </button>
                </div>
            )}
        </div>
    )
}
