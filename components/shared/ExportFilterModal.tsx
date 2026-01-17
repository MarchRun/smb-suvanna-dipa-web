/**
 * Export Filter Modal - Using UniversalForm
 * Modal for filtering data before Excel export
 */

'use client'

import { useState } from 'react'
import UniversalForm, { FieldConfig } from '@/components/shared/UniversalForm'
import Modal from '@/components/shared/Modal'
import type { Class } from '@/types'
import { getUsersForExport } from '@/actions/admin/users'
import XLSX from 'xlsx-js-style'

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
    const [isExporting, setIsExporting] = useState(false)

    // Field configuration
    const filterFields: FieldConfig[] = [
        {
            name: 'role',
            type: 'select',
            label: 'Peran',
            required: false,
            options: [
                { value: '', label: 'Semua Peran' },
                { value: 'siswa', label: 'Siswa' },
                { value: 'pembina', label: 'Pembina' }
            ],
            columnSpan: 2
        },
        {
            name: 'class_id',
            type: 'select',
            label: 'Kelas',
            required: false,
            options: [
                { value: '', label: 'Semua Kelas' },
                ...classes.map(c => ({ value: c.id, label: c.name }))
            ],
            columnSpan: 2
        },
        {
            name: 'gender',
            type: 'select',
            label: 'Gender',
            required: false,
            options: [
                { value: '', label: 'Semua Gender' },
                { value: 'Laki-laki', label: 'Laki-laki' },
                { value: 'Perempuan', label: 'Perempuan' }
            ],
            columnSpan: 2
        }
    ]

    const handleExport = async (data: Record<string, any>) => {
        setIsExporting(true)

        try {
            // Fetch data with filters
            const result = await getUsersForExport({
                role: (data.role as any) || 'all',
                classId: data.class_id ? Number(data.class_id) : null,
                gender: data.gender || null
            })

            if (!result.success || !result.data || result.data.length === 0) {
                alert('Tidak ada data untuk diekspor')
                setIsExporting(false)
                return
            }

            // Define headers
            const headers = ['No', 'Nama Lengkap', 'Email', 'Nomor Telepon', 'Jenis Kelamin', 'Tanggal Lahir', 'Kelas', 'Peran', 'Alamat']

            // Header style (Orange background, white bold text)
            const headerStyle = {
                font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
                fill: { fgColor: { rgb: 'EA580C' } }, // Orange
                alignment: { horizontal: 'center', vertical: 'center' },
                border: {
                    top: { style: 'thin', color: { rgb: '000000' } },
                    bottom: { style: 'thin', color: { rgb: '000000' } },
                    left: { style: 'thin', color: { rgb: '000000' } },
                    right: { style: 'thin', color: { rgb: '000000' } }
                }
            }

            // Cell style (borders only)
            const cellStyle = {
                border: {
                    top: { style: 'thin', color: { rgb: '000000' } },
                    bottom: { style: 'thin', color: { rgb: '000000' } },
                    left: { style: 'thin', color: { rgb: '000000' } },
                    right: { style: 'thin', color: { rgb: '000000' } }
                },
                alignment: { vertical: 'center' }
            }

            // Prepare data rows
            const rows = result.data.map((user: any, index: number) => [
                index + 1,
                user.full_name || '-',
                user.email || '-',
                user.phone || '-',
                user.gender || '-',
                user.birth_date || '-',
                user.classes?.name || '-',
                user.role === 'siswa' ? 'Siswa' : user.role === 'pembina' ? 'Pembina' : user.role,
                user.address || '-'
            ])

            // Create worksheet with headers + data
            const wsData = [headers, ...rows]
            const ws = XLSX.utils.aoa_to_sheet(wsData)

            // Apply header styles
            headers.forEach((_, colIndex) => {
                const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex })
                if (ws[cellRef]) {
                    ws[cellRef].s = headerStyle
                }
            })

            // Apply cell styles to data rows
            rows.forEach((row, rowIndex) => {
                row.forEach((_, colIndex) => {
                    const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex })
                    if (ws[cellRef]) {
                        ws[cellRef].s = cellStyle
                    }
                })
            })

            // Set column widths
            ws['!cols'] = [
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

            // Freeze header row
            ws['!freeze'] = { xSplit: 0, ySplit: 1 }

            // Create workbook
            const wb = XLSX.utils.book_new()
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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={false}
        >
            <div className="p-6">
                <UniversalForm
                    title="Filter Data Export"
                    mode="create"
                    fields={filterFields}
                    initialData={{ role: '', class_id: '', gender: '' }}
                    onSubmit={handleExport}
                    submitLabel={isExporting ? 'Mengunduh...' : 'Unduh Excel'}
                    cancelLabel="Batal"
                    onCancel={onClose}
                    isLoading={isExporting}
                />
            </div>
        </Modal>
    )
}
