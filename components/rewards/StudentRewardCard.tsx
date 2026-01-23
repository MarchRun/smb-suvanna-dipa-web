/**
 * Student Reward Card Component
 * Card for displaying hadiah with "Tukar" button for students
 */

'use client'

import type { Product } from '@/actions/admin/products'
import { useDarkMode } from '@/hooks/useDarkMode'

interface StudentRewardCardProps {
    reward: Product
    studentPoints: number
    onRedeem: (reward: Product) => void
}

export default function StudentRewardCard({
    reward,
    studentPoints,
    onRedeem
}: StudentRewardCardProps) {
    const isDarkMode = useDarkMode()

    const textColor = isDarkMode ? '#ea580c' : '#E57526'
    const bgColor = isDarkMode ? '#1e293b' : '#ffffff'
    const borderColor = isDarkMode ? '#ea580c' : '#E57526'

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
                        style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}
                    >
                        Stok: {reward.stock}
                    </p>
                    <p
                        className="text-sm font-semibold"
                        style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}
                    >
                        Harga: {reward.price} poin
                    </p>
                </div>
            </div>

            {/* Tukar Button */}
            <div className="flex flex-col justify-center">
                <button
                    onClick={() => onRedeem(reward)}
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
        </div>
    )
}
