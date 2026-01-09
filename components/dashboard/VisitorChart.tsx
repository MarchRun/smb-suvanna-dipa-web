/**
 * Visitor Chart Component
 * Displays visitor statistics using Recharts
 */

'use client'

import { useState, useEffect } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { getVisitorStats, type VisitorStats } from '@/actions/tracking/pageViews'

interface VisitorChartProps {
    days?: number
}

export default function VisitorChart({ days = 7 }: VisitorChartProps) {
    const [data, setData] = useState<VisitorStats[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const result = await getVisitorStats(days)
            if (result.success && result.data) {
                // Format dates for display
                const formattedData = result.data.map(item => ({
                    ...item,
                    date: new Date(item.date).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short'
                    })
                }))
                setData(formattedData)
            } else {
                setError(result.error || 'Gagal memuat data')
            }
            setLoading(false)
        }
        fetchData()
    }, [days])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48 bg-white/10 rounded-lg">
                <div className="text-white/70 animate-pulse">Memuat chart...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-48 bg-white/10 rounded-lg">
                <div className="text-white/70 text-sm text-center">
                    <p>Tidak dapat memuat data pengunjung</p>
                    <p className="text-xs mt-1 opacity-70">{error}</p>
                </div>
            </div>
        )
    }

    const totalViews = data.reduce((sum, item) => sum + item.views, 0)

    return (
        <div className="mt-4">
            <p className="text-white/80 text-center text-sm mb-4">
                Total pengunjung {days} hari terakhir: <strong>{totalViews}</strong>
            </p>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="date"
                            stroke="rgba(255,255,255,0.7)"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.7)"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                            labelStyle={{ color: '#fff' }}
                        />
                        <Bar
                            dataKey="views"
                            fill="rgba(255,255,255,0.8)"
                            radius={[4, 4, 0, 0]}
                            name="Pengunjung"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
