'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextType {
    toasts: Toast[]
    showToast: (message: string, type: ToastType) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast: Toast = { id, message, type }

        setToasts(prev => [...prev, newToast])

        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            removeToast(id)
        }, 4000)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

// Toast Container Component
function ToastContainer({ toasts, onRemove }: { toasts: Toast[], onRemove: (id: string) => void }) {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    )
}

// Individual Toast Item
function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: (id: string) => void }) {
    const [isExiting, setIsExiting] = React.useState(false)

    const handleClose = () => {
        setIsExiting(true)
        setTimeout(() => onRemove(toast.id), 200)
    }

    // Style based on type
    const styles = {
        success: {
            bg: '#16A34A', // Green
            icon: '✓'
        },
        error: {
            bg: '#DC2626', // Red
            icon: '✕'
        },
        info: {
            bg: '#E57526', // Orange (theme color)
            icon: 'i'
        }
    }

    const style = styles[toast.type]

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white min-w-[300px] max-w-[400px] pointer-events-auto transition-all duration-200 ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
                }`}
            style={{ backgroundColor: style.bg }}
        >
            {/* Icon */}
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {style.icon}
            </div>

            {/* Message */}
            <p className="flex-1 text-sm font-semibold">{toast.message}</p>

            {/* Close button */}
            <button
                onClick={handleClose}
                className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
                aria-label="Close"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Progress bar */}
            <div
                className="absolute bottom-0 left-0 h-1 bg-white/30 animate-shrink"
                style={{ animationDuration: '4000ms' }}
            />
        </div>
    )
}
