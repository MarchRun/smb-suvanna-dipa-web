/**
 * Session Timeout Hook
 * Auto logout after 30 minutes of inactivity
 */

'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
const WARNING_TIME = 5 * 60 * 1000 // Show warning 5 minutes before logout

export function useSessionTimeout() {
    const router = useRouter()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const warningRef = useRef<NodeJS.Timeout | null>(null)

    const resetTimer = () => {
        // Clear existing timers
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        if (warningRef.current) {
            clearTimeout(warningRef.current)
        }

        // Set warning timer (5 minutes before logout)
        warningRef.current = setTimeout(() => {
            const shouldStay = confirm(
                'Sesi Anda akan berakhir dalam 5 menit karena tidak ada aktivitas. Klik OK untuk tetap login.'
            )
            if (shouldStay) {
                resetTimer()
            }
        }, INACTIVITY_TIMEOUT - WARNING_TIME)

        // Set logout timer
        timeoutRef.current = setTimeout(async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            router.push('/')
            alert('Sesi Anda telah berakhir karena tidak ada aktivitas.')
        }, INACTIVITY_TIMEOUT)
    }

    useEffect(() => {
        // Events that count as activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

        // Reset timer on any activity
        events.forEach(event => {
            window.addEventListener(event, resetTimer)
        })

        // Start initial timer
        resetTimer()

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            if (warningRef.current) {
                clearTimeout(warningRef.current)
            }
            events.forEach(event => {
                window.removeEventListener(event, resetTimer)
            })
        }
    }, [])
}
