/**
 * Admin Dashboard Stats Server Actions
 * Fetch real-time statistics from Supabase
 * Uses admin client to bypass RLS
 */

'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResponse } from '@/types'

export interface DashboardStats {
    totalSiswa: number
    totalKelas: number
    totalPembina: number
}

/**
 * Get dashboard statistics for admin
 * Uses admin client to bypass RLS
 */
export async function getDashboardStats(): Promise<ActionResponse<DashboardStats>> {
    const supabase = createAdminClient()

    try {
        // Count siswa (using 'role' column)
        const { count: siswaCount, error: siswaError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'siswa')

        if (siswaError) {
            console.error('Siswa count error:', siswaError)
            throw siswaError
        }

        // Count pembina
        const { count: pembinaCount, error: pembinaError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'pembina')

        if (pembinaError) {
            console.error('Pembina count error:', pembinaError)
            throw pembinaError
        }

        // Count kelas
        const { count: kelasCount, error: kelasError } = await supabase
            .from('classes')
            .select('*', { count: 'exact', head: true })

        if (kelasError) {
            console.error('Kelas count error:', kelasError)
            throw kelasError
        }

        return {
            success: true,
            data: {
                totalSiswa: siswaCount || 0,
                totalKelas: kelasCount || 0,
                totalPembina: pembinaCount || 0
            }
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Gagal mengambil data statistik',
            data: {
                totalSiswa: 0,
                totalKelas: 0,
                totalPembina: 0
            }
        }
    }
}
