/**
 * Modal Component - WITH ANIMATIONS
 * Reusable modal wrapper with smooth fade+scale animations
 * Provides consistent modal behavior across the application
 */

'use client'

import { useEffect, useState } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    children: React.ReactNode
    showCloseButton?: boolean
    preventBackdropClose?: boolean
}

export default function Modal({
    isOpen,
    onClose,
    title,
    size = 'md',
    children,
    showCloseButton = true,
    preventBackdropClose = false
}: ModalProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    // Handle animations on open/close
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            // Trigger animation after render
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true)
                })
            })
        } else {
            setIsAnimating(false)
            // Wait for animation to complete before hiding
            const timer = setTimeout(() => {
                setIsVisible(false)
            }, 200) // Match transition duration
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    // Close on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isVisible) return null

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-[95vw]'
    }

    const handleBackdropClick = () => {
        if (!preventBackdropClose) {
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with fade animation */}
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 
                           ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleBackdropClick}
                aria-hidden="true"
            />

            {/* Modal Container with scale+fade animation */}
            <div
                className={`relative bg-white dark:bg-gray-800 shadow-xl w-full ${sizeClasses[size]} 
                           max-h-[90vh] overflow-hidden rounded-2xl
                           transition-all duration-200
                           ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        {title && (
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                                         dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 
                                         rounded-lg transition-all"
                                aria-label="Close modal"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Content - NO PADDING, forms handle their own */}
                <div className="max-h-[calc(90vh-140px)] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}
