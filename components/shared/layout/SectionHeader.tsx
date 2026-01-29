'use client'

import { useEffect, useState } from 'react'

interface SectionHeaderProps {
    title: string
    subtitle?: string
    color?: string // Defaults to #E57526 (Orange)
    lineColor?: string // Defaults to color if not provided
    className?: string
    isVisible?: boolean // Trigger animation from parent observer
}

export default function SectionHeader({
    title,
    subtitle,
    color = '#E57526',
    lineColor,
    className = '',
    isVisible = true
}: SectionHeaderProps) {
    const finalLineColor = lineColor || color

    return (
        <div className={`flex flex-col items-center justify-center mb-8 sm:mb-10 ${className}`}>
            <div className={`flex items-center justify-center gap-4 transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                {/* Left Line */}
                <div
                    className="hidden sm:block h-[2px] rounded-full transition-all duration-1000 delay-300 ease-out"
                    style={{
                        backgroundColor: finalLineColor,
                        width: isVisible ? '6rem' : '0rem', // 24 (96px) vs 0
                        opacity: 0.8
                    }}
                ></div>

                {/* Title */}
                <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mx-2"
                    style={{ color: color }}
                >
                    {title}
                </h2>

                {/* Right Line */}
                <div
                    className="hidden sm:block h-[2px] rounded-full transition-all duration-1000 delay-300 ease-out"
                    style={{
                        backgroundColor: finalLineColor,
                        width: isVisible ? '6rem' : '0rem',
                        opacity: 0.8
                    }}
                ></div>
            </div>

            {/* Optional Subtitle */}
            {subtitle && (
                <p
                    className={`mt-4 text-center max-w-2xl px-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ color: '#4B5563' }} // Gray-600 default
                >
                    {subtitle}
                </p>
            )}
        </div>
    )
}
