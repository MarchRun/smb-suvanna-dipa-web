# SMB Suvanna Dipa - Sistem Informasi Sekolah Minggu Buddha

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)

Web application untuk manajemen Sekolah Minggu Buddha (SMB) Suvanna Dipa. Dibangun dengan Next.js 15, TypeScript, Tailwind CSS, dan Supabase.

## 📋 Fitur Utama

- **Multi-role Authentication**: Admin, Pembina (Guru), dan Siswa
- **Dashboard Interaktif**: Statistik real-time dan grafik pengunjung
- **Manajemen Pengguna**: CRUD pengguna dengan filter dan pencarian
- **Manajemen Kelas**: Pengelolaan kelas dan wali kelas
- **Profil Pengguna**: Upload foto profil dan edit data pribadi
- **Konten Publik**: Halaman beranda, tentang, aktivitas, dan kontak
- **Dark Mode**: Tema gelap untuk kenyamanan pengguna
- **Responsive Design**: Optimal di desktop, tablet, dan mobile

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Email**: [Resend](https://resend.com/) (untuk reset password)

## 📦 Prasyarat

Sebelum memulai, pastikan Anda sudah menginstall:

- [Node.js](https://nodejs.org/) versi 18.x atau lebih baru
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- Akun [Supabase](https://supabase.com/) (gratis)
- (Opsional) Akun [Resend](https://resend.com/) untuk fitur reset password

## 🚀 Panduan Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/[username]/smb-sd-web.git
cd smb-sd-web
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root folder dengan isi:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Email Configuration (Resend) - Opsional
RESEND_API_KEY=[your-resend-api-key]
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Cara mendapatkan Supabase Keys:**
> 1. Login ke [Supabase Dashboard](https://app.supabase.com/)
> 2. Pilih project Anda
> 3. Buka **Settings** → **API**
> 4. Copy `URL`, `anon key`, dan `service_role key`

### 4. Setup Database Supabase

Database schema sudah tersedia di Supabase project. Jika perlu membuat ulang:

1. Buka Supabase Dashboard → **SQL Editor**
2. Jalankan query untuk membuat tabel:
   - `profiles` - Data pengguna
   - `classes` - Data kelas
   - `page_views` - Tracking pengunjung
   - `public_content` - Konten halaman publik
   - `products` - Hadiah untuk siswa
   - `password_reset_tokens` - Token reset password

3. Setup **Storage Bucket**:
   - Buat bucket bernama `profile-pictures`
   - Set policy agar authenticated users bisa upload

4. Aktifkan **Row Level Security (RLS)** pada semua tabel

### 5. Jalankan Development Server

```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Folder

```
smb-sd-web/
├── app/                    # Next.js App Router
│   ├── (site)/            # Halaman publik (beranda, tentang, dll)
│   ├── admin/             # Dashboard Admin
│   ├── teacher/           # Dashboard Pembina
│   ├── student/           # Dashboard Siswa
│   └── api/               # API Routes
├── actions/               # Server Actions (Supabase operations)
├── components/            # React Components
│   ├── admin/            # Komponen khusus Admin
│   ├── auth/             # Komponen autentikasi
│   ├── dashboard/        # Komponen dashboard
│   ├── landing/          # Komponen halaman publik
│   ├── profile/          # Komponen profil
│   └── shared/           # Komponen shared/reusable
├── hooks/                 # Custom React Hooks
├── lib/                   # Library & utilities
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## 🔐 Akun Default

Setelah setup database, Anda bisa login dengan akun berikut:

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Admin   | admin@smbsd.com        | admin123   |
| Pembina | pembina@smbsd.com      | pembina123 |
| Siswa   | siswa@smbsd.com        | siswa123   |

> ⚠️ **Penting**: Ganti password default setelah login pertama!

## 📝 Scripts Tersedia

```bash
# Development
npm run dev         # Jalankan development server

# Build
npm run build       # Build untuk production
npm run start       # Jalankan production build

# Linting
npm run lint        # Jalankan ESLint
```

## 🌐 Deployment

### Deploy ke Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com/)
3. Tambahkan environment variables di Vercel Dashboard
4. Deploy!

### Environment Variables untuk Production

Pastikan semua environment variables sudah di-set di platform hosting:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (jika menggunakan fitur email)
- `RESEND_FROM_EMAIL` (jika menggunakan fitur email)
- `NEXT_PUBLIC_APP_URL` (URL production)

## 🤝 Kontribusi

1. Fork repository
2. Buat branch baru (`git checkout -b feature/fitur-baru`)
3. Commit perubahan (`git commit -m 'Tambah fitur baru'`)
4. Push ke branch (`git push origin feature/fitur-baru`)
5. Buat Pull Request

## 📄 Lisensi

Project ini dibuat untuk keperluan internal SMB Suvanna Dipa.

## 📞 Kontak

Jika ada pertanyaan atau masalah, hubungi:
- Email: [email@smbsd.com]
- GitHub Issues: [Link ke Issues]

---

Dibuat dengan ❤️ untuk SMB Suvanna Dipa
