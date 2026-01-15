/**
 * Session Timeout Hook
 * Auto logout after 30 minutes of inactivity
 */

'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds

export function useSessionTimeout() {
    const router = useRouter()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const resetTimer = () => {
        // Clear existing timer
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // Set logout timer (silent logout after 30 minutes)
        timeoutRef.current = setTimeout(async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            router.push('/')
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
            events.forEach(event => {
                window.removeEventListener(event, resetTimer)
            })
        }
    }, [])
}
