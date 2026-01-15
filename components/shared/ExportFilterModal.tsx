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
