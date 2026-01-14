/**
 * Export Filter Modal Component
 * Modal for filtering data before Excel export
 */

'use client'

import { useState, useEffect } from 'react'
import type { Class } from '@/types'
import { getUsersForExport } from '@/actions/admin/users'
import * as XLSX from 'xlsx'

interface ExportFilterModalProps {
    isOpen: boolean
    onClose: () => void
    classes: Class[]
}

export default function ExportFilterModal({
    isOpen,
    onClose,
    classes
}: ExportFilterModalProps) {
    const [role, setRole] = useState<string | null>(null)
    const [classId, setClassId] = useState<number | null>(null)
    const [gender, setGender] = useState<string | null>(null)
    const [isExporting, setIsExporting] = useState(false)

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setRole(null)
            setClassId(null)
            setGender(null)
        }
    }, [isOpen])

    // Prevent body scroll when open
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

    if (!isOpen) return null

    const handleExport = async () => {
        setIsExporting(true)

        try {
            // Fetch data with filters
            const result = await getUsersForExport({
                role: (role as any) || 'all',
                classId: classId,
                gender: gender
            })

            if (!result.success || !result.data || result.data.length === 0) {
                alert('Tidak ada data untuk diekspor')
                setIsExporting(false)
                return
            }

            // Prepare data for Excel
            const excelData = result.data.map((user: any, index: number) => ({
                'No': index + 1,
                'Nama Lengkap': user.full_name || '-',
                'Email': user.email || '-',
                'Nomor Telepon': user.phone || '-',
                'Jenis Kelamin': user.gender || '-',
                'Tanggal Lahir': user.birth_date || '-',
                'Kelas': user.classes?.name || '-',
                'Peran': user.role === 'siswa' ? 'Siswa' : user.role === 'pembina' ? 'Pembina' : user.role,
                'Alamat': user.address || '-'
            }))

            // Create workbook
            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.json_to_sheet(excelData)

            // Set column widths
            const colWidths = [
                { wch: 5 },  // No
                { wch: 25 }, // Nama Lengkap
                { wch: 30 }, // Email
                { wch: 15 }, // Nomor Telepon
                { wch: 15 }, // Jenis Kelamin
                { wch: 15 }, // Tanggal Lahir
                { wch: 12 }, // Kelas
                { wch: 10 }, // Peran
                { wch: 40 }  // Alamat
            ]
            ws['!cols'] = colWidths

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Data Pengguna')

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().split('T')[0]
            const filename = `Data_Pengguna_${timestamp}.xlsx`

            // Download file
            XLSX.writeFile(wb, filename)

            alert(`Berhasil mengekspor ${result.data.length} data pengguna`)
            onClose()
        } catch (error) {
            console.error('Error exporting:', error)
            alert('Gagal mengekspor data')
        } finally {
            setIsExporting(false)
        }
    }

    const selectClass = "w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
    const labelClass = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Filter Data Export
                </h3>

                <div className="space-y-5">
                    {/* Peran */}
                    <div>
                        <label className={labelClass}>Peran</label>
                        <select
                            value={role || ''}
                            onChange={(e) => setRole(e.target.value || null)}
                            className={selectClass}
                        >
                            <option value="">Semua Peran</option>
                            <option value="siswa">Siswa</option>
                            <option value="pembina">Pembina</option>
                        </select>
                    </div>

                    {/* Kelas */}
                    <div>
                        <label className={labelClass}>Kelas</label>
                        <select
                            value={classId ?? ''}
                            onChange={(e) => setClassId(e.target.value ? Number(e.target.value) : null)}
                            className={selectClass}
                        >
                            <option value="">Semua Kelas</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className={labelClass}>Gender</label>
                        <select
                            value={gender || ''}
                            onChange={(e) => setGender(e.target.value || null)}
                            className={selectClass}
                        >
                            <option value="">Semua Gender</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onClose}
                        disabled={isExporting}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600
                                 text-gray-600 dark:text-gray-300 font-medium
                                 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200
                                 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        style={{ backgroundColor: 'var(--primary-900)' }}
                    >
                        {isExporting ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Mengunduh...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Unduh Excel
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
