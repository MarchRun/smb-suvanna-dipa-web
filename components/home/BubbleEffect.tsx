/**
 * Bubble Effect Component
 * Colorful bubbles floating from bottom to top continuously
 */

'use client'

import { useEffect, useState } from 'react'

interface Bubble {
    id: number
    left: string
    size: number
    duration: number
    delay: number
    color: string
    xOffset: number // Horizontal movement offset
}

export default function BubbleEffect() {
    const [bubbles, setBubbles] = useState<Bubble[]>([])

    // Array of warm colors matching the theme
    const colors = [
        'rgba(249, 115, 22, 0.6)',  // Orange
        'rgba(251, 146, 60, 0.6)',  // Light Orange
        'rgba(234, 88, 12, 0.6)',   // Dark Orange
        'rgba(253, 186, 116, 0.6)', // Peach
        'rgba(254, 215, 170, 0.6)', // Light Peach
        'rgba(252, 211, 77, 0.6)',  // Yellow
        'rgba(245, 158, 11, 0.6)',  // Amber
        'rgba(217, 119, 6, 0.6)',   // Dark Amber
    ]

    useEffect(() => {
        // Generate random bubbles
        const generateBubbles = () => {
            const newBubbles: Bubble[] = []
            const bubbleCount = 15 // Number of bubbles

            for (let i = 0; i < bubbleCount; i++) {
                newBubbles.push({
                    id: i,
                    left: `${Math.random() * 100}%`, // Random horizontal position
                    size: Math.random() * 60 + 20, // Size between 20-80px
                    duration: Math.random() * 10 + 8, // Duration between 8-18 seconds
                    delay: Math.random() * 5, // Delay between 0-5 seconds
                    color: colors[Math.floor(Math.random() * colors.length)],
                    xOffset: Math.random() * 100 - 50 // Horizontal movement -50px to 50px
                })
            }

            setBubbles(newBubbles)
        }

        generateBubbles()
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
            {bubbles.map((bubble) => (
                <div
                    key={bubble.id}
                    className="absolute rounded-full bubble-float"
                    style={{
                        left: bubble.left,
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        backgroundColor: bubble.color,
                        animation: `floatUp ${bubble.duration}s linear infinite`,
                        animationDelay: `${bubble.delay}s`,
                        boxShadow: `0 0 20px ${bubble.color}`,
                        bottom: '-100px',
                        ['--x-offset' as string]: `${bubble.xOffset}px`
                    }}
                />
            ))}

            <style jsx>{`
                @keyframes floatUp {
                    0% {
                        transform: translateY(0) translateX(0);
                        opacity: 0.8;
                    }
                    50% {
                        transform: translateY(calc(-50vh - 100px)) translateX(var(--x-offset));
                        opacity: 0.8;
                    }
                    85% {
                        transform: translateY(calc(-85vh - 150px)) translateX(var(--x-offset));
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(calc(-100vh - 200px)) translateX(var(--x-offset));
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    )
}
