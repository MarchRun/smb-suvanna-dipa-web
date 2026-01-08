/**
 * Custom Types & Interfaces
 */

// User Role Type
export type UserRole = 'admin' | 'pembina' | 'siswa'

// Order Status
export type OrderStatus = 'pending' | 'approved' | 'rejected'

// Content Section
export type ContentSection = 'agenda' | 'gallery' | 'testimonial'

// Server Action Response Type
export type ActionResponse<T = unknown> = {
    success: boolean
    data?: T
    error?: string
}

// Profile
export interface Profile {
    id: string
    nama_lengkap: string | null
    email: string | null
    nomor_telepon: string | null
    jenis_kelamin: string | null
    tanggal_lahir: string | null
    alamat_rumah: string | null
    url_foto_profil: string | null
    peran: UserRole
    saldo_poin: number | null
    id_kelas: number | null
    dibuat_pada: string
    dimodifikasi_pada: string
}

// Class
export interface Class {
    id: number
    nama_kelas: string
    id_wali_kelas: string | null
    dibuat_pada: string
    dimodifikasi_pada: string | null
}

// Schedule
export interface Schedule {
    id: number
    nama_kegiatan: string
    deskripsi: string | null
    tanggal_kegiatan: string
    lokasi: string | null
    id_kelas: number | null
    dibuat_oleh: string | null
    dibuat_pada: string
    dimodifikasi_pada: string | null
}

// Product (Hadiah)
export interface Product {
    id: number
    nama_hadiah: string
    harga_hadiah: number
    stok_hadiah: number
    url_gambar_hadiah: string | null
    dibuat_pada: string
    dimodifikasi_pada: string | null
}

// Product Order (Pesanan Hadiah)
export interface ProductOrder {
    id: number
    id_siswa: string
    id_hadiah: number
    total_poin: number
    status: OrderStatus
    dibuat_pada: string
    dimodifikasi_pada: string | null
}

// Point History (Riwayat Poin)
export interface PointHistory {
    id: number
    id_pengguna: string
    jumlah_poin: number
    keterangan_poin: string
    diberikan_oleh: string | null
    id_pesanan: number | null
    dibuat_pada: string
}

// Public Content (Konten Publik)
export interface PublicContent {
    id: number
    kategori_konten: ContentSection
    judul_konten: string | null
    isi_konten: Record<string, any> | null
    gambar: string[] | null
    urutan_konten: number
    status_publikasi: boolean
    id_pengguna: string | null
    dimodifikasi_pada: string | null
}

// Password Reset Token
export interface PasswordResetToken {
    id: string
    id_pengguna: string
    email: string
    token: string
    kadaluarsa_pada: string
    sudah_digunakan: boolean
    dibuat_pada: string
}

// Extended Types with Relations
export interface ClassWithWaliKelas extends Class {
    wali_kelas: {
        nama_lengkap: string
    } | null
}

export interface ProfileWithClass extends Profile {
    kelas: {
        nama_kelas: string
    } | null
}

export interface OrderWithDetails extends ProductOrder {
    siswa: {
        nama_lengkap: string
    } | null
    hadiah: {
        nama_hadiah: string
        harga_hadiah: number
    } | null
}
