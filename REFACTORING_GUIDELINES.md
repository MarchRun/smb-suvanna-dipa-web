# SMB Suvanna Dipa - Dokumentasi Proyek

## 🔐 Akun Testing

### Login Credentials (9 User Utama)
| Role | Email | Password |
|------|-------|----------|
| **Admin 1** | admin1@smb.test | Test123! |
| **Admin 2** | admin2@smb.test | Test123! |
| **Admin 3** | admin3@smb.test | Test123! |
| **Pembina 1** | pembina1@smb.test | Test123! |
| **Pembina 2** | pembina2@smb.test | Test123! |
| **Pembina 3** | pembina3@smb.test | Test123! |
| **Siswa 1** | siswa1@smb.test | Test123! |
| **Siswa 2** | siswa2@smb.test | Test123! |
| **Siswa 3** | siswa3@smb.test | Test123! |

### User Tambahan (20 User Random)
Dibuat via `scripts/create-test-users.ts`:
- 5 Pembina + 15 Siswa dengan data random
- Email format: `nama.belakangN@smb.test`
- Password: `Test123!`

---

## 📦 Cara Buat User Baru

### Metode 1: Via Web App (Recommended)
1. Login sebagai Admin
2. Buka `/admin/pengguna`
3. Klik **Tambah Pengguna**
4. Isi form lengkap → Submit

### Metode 2: Via Supabase Dashboard
1. Pergi ke Authentication → Users
2. Klik **Add user**
3. Isi email & password
4. Update profile via SQL

### Metode 3: Via Script (Bulk)
```bash
cd smb-sd-web
npx tsx scripts/create-test-users.ts
```

> **Note:** Jangan pakai SQL INSERT langsung ke `auth.users` - ini tidak akan bekerja karena Supabase Auth memerlukan internal tables.

---

## 📋 Database Schema

### profiles
| Column | Type | Constraint |
|--------|------|------------|
| id | uuid | PK, FK → auth.users |
| email | text | UNIQUE |
| full_name | text | |
| phone | text | |
| gender | text | CHECK: 'Laki-laki' / 'Perempuan' |
| birth_date | date | |
| address | text | |
| profile_picture | text | |
| role | text | CHECK: 'admin' / 'pembina' / 'siswa' |
| points | integer | CHECK: ≥ 0 |
| class_id | integer | FK → classes |

### classes
| Column | Type | Constraint |
|--------|------|------------|
| id | serial | PK |
| name | text | UNIQUE |
| teacher_id | uuid | FK → profiles |

---

## 🎨 UI Styling Notes

### Form & Input
- Label color: Brown (`#7c2d12` light / `#ea580c` dark)
- Input border-radius: `rounded-full`
- Input border color: Brown/Orange
- File upload: Split button design (input + upload button)
- **Date input**: Menggunakan native calendar picker (`type="date"`)

### Select/Dropdown
- Jika ada opsi "Semua" dengan value kosong, itu akan menjadi default
- Placeholder "Pilih..." hanya muncul jika tidak ada opsi dengan value kosong

### Modal
- Padding: `p-6 md:p-8`
- Title color: Brown/Orange (same as labels)
- Buttons: Yellow for Cancel, Orange for Submit

### File Upload
- Format: JPEG, PNG
- Max size: **1MB**
- Styling: `rounded-full` dengan border orange

---

## 📊 Excel Export

### Styling
- **Header**: Orange background (#EA580C), white bold text
- **Cells**: Thin black border
- **Frozen header row**: Yes

### Columns
| Column | Width |
|--------|-------|
| No | 5 |
| Nama Lengkap | 25 |
| Email | 30 |
| Nomor Telepon | 15 |
| Jenis Kelamin | 15 |
| Tanggal Lahir | 15 |
| Kelas | 12 |
| Peran | 10 |
| Alamat | 40 |

### Library
- `xlsx-js-style` (supports styling, unlike basic `xlsx`)

---

## 🔧 SQL Quick Reference

### Assign Wali Kelas
```sql
UPDATE classes SET teacher_id = (SELECT id FROM profiles WHERE email = 'pembina1@smb.test') WHERE id = 1;
UPDATE classes SET teacher_id = (SELECT id FROM profiles WHERE email = 'pembina2@smb.test') WHERE id = 2;
UPDATE classes SET teacher_id = (SELECT id FROM profiles WHERE email = 'pembina3@smb.test') WHERE id = 3;
```

### Verifikasi Data
```sql
SELECT id, email, full_name, role, class_id, points FROM profiles ORDER BY role, full_name;
```

### Cleanup Orphan Profiles
```sql
DELETE FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);
```

---

## 📋 Status Implementasi (17 Jan 2026)

### ✅ Halaman Pengguna - DONE (122 Test Cases)
| Feature | Status |
|---------|--------|
| CRUD Users | ✅ Complete |
| Search | ✅ By name/email |
| Filter Modal | ✅ Role/Class/Gender |
| Table Pagination | ✅ 10 per page dengan "Menampilkan X-Y dari Z entri" |
| Detail Page | ✅ Semua field termasuk Kelas & Points |
| Excel Export | ✅ Styled (orange header, borders) |
| Dark/Light Mode | ✅ Toggle berfungsi |
| Modal Forms | ✅ Add/Edit dalam modal popup |

### ✅ Halaman Konten Publik - DONE
| Feature | Status |
|---------|--------|
| Agenda Tahunan | ✅ 4 items, fetch dari DB |
| Galeri Kegiatan | ✅ 5 gambar dengan preview |
| Testimoni | ✅ 3 items, fetch dari DB |
| Sticky Button | ✅ "Ubah Konten" fixed di bawah |
| Dynamic Content | ✅ Halaman `/activities` fetch dari DB |

### ⚠️ NOTES (Halaman Pengguna)
- Detail Page hanya untuk **lihat profil** (tidak ada Edit/Delete button - by design)
- Filter Count indicator tidak diperlukan
- Breadcrumb tidak diperlukan
- Title "Detail Pengguna" (bukan nama user) - by design
- **ESC key close modal** - TODO: belum diimplementasi

### ❌ BELUM DITEST (Halaman Lain)
- `/admin/dashboard` - Dashboard Admin
- `/admin/hadiah` - Manajemen Hadiah ← **NEXT**
- `/admin/profil` - Profile Page
- Dashboard Pembina/Siswa

---

## 📝 Recent Updates (17 Jan 2026)

### New Features
- ✅ **Konten Publik Redesign** - Centered titles, sticky button, rounded borders
- ✅ **Dynamic Activities Page** - Agenda, Gallery, Testimoni fetch dari database
- ✅ **Gallery 5 Images** - Support 5 gambar di galeri (sebelumnya 4)
- ✅ **Table Pagination** - "Menampilkan 1-10 dari 46 entri" dengan navigasi halaman
- ✅ **Detail Page Kelas & Points** - Field yang sebelumnya missing sudah ditambahkan

### Bug Fixes
- ✅ Date input uses native calendar picker
- ✅ Select shows "Semua" as default
- ✅ Excel export dengan styling profesional
- ✅ File upload limit 1MB

### Files Modified (Konten Publik)
- `app/admin/konten/page.tsx` - Redesign dengan sticky button, testimoni section
- `components/activities/GalleryCarousel.tsx` - Fetch 5 gambar dari DB
- `components/activities/AgendaCards.tsx` - Fetch agenda dari DB
- `components/activities/TestimonialCards.tsx` - Fetch testimoni dari DB

### Files Modified (Pengguna)
- `components/admin/UserTable.tsx` - Added pagination
- `app/admin/pengguna/[id]/page.tsx` - Added Kelas/Points fields
- `components/shared/ExportFilterModal.tsx` - Excel styling
- `components/shared/Input.tsx` - Date type support
- `components/shared/Select.tsx` - Default "Semua" option


