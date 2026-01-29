'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const INACTIVITY_TIMEOUT = 30 * 60 * 1000

export function useSessionTimeout() {
    const router = useRouter()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const resetTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            router.push('/')
        }, INACTIVITY_TIMEOUT)
    }

    useEffect(() => {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

        events.forEach(event => {
            window.addEventListener(event, resetTimer)
        })

        resetTimer()

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
