# Pedoman Refactoring Kode Sumber
## SMB Suvanna Dipa - Web Application

> **Tujuan:** Meningkatkan efisiensi kode, konsistensi UI, dan reusability komponen dengan mengurangi duplikasi dan menerapkan prinsip DRY (Don't Repeat Yourself).

---

## 🎯 Prinsip Utama

### 1. **Component Reusability**
- Komponen yang digunakan di banyak tempat harus dibuat generic dan configurable
- Gunakan props untuk customize behavior tanpa duplikasi kode
- Pisahkan logic dan presentation layer

### 2. **UI Consistency**
- Semua komponen sejenis harus memiliki tampilan yang konsisten
- Gunakan design system variables (colors, spacing, typography)
- Standardisasi ukuran button, input, modal, dll

### 3. **Code Efficiency**
- Hindari copy-paste code
- Gunakan helper functions untuk logic yang berulang
- Leverage TypeScript types untuk reusability

---

## 🔤 Naming Conventions & Language Usage

### 1. **File & Folder Naming (ENGLISH)**
Semua file dan folder menggunakan **Bahasa Inggris** dengan konvensi berikut:

#### **React Components**
- **Format:** PascalCase
- **Pattern:** `{Purpose}{ComponentType}.tsx`
- **Examples:**
  - `UserFormModal.tsx` ✅ (bukan `ModalFormUser.tsx`)
  - `DataTable.tsx` ✅ (bukan `TabelData.tsx`)
  - `AuthFormWrapper.tsx` ✅
  - `StatsCard.tsx` ✅

#### **Utility Files & Helpers**
- **Format:** camelCase
- **Pattern:** `{purpose}Helpers.ts` atau `{purpose}Utils.ts`
- **Examples:**
  - `formHelpers.ts` ✅
  - `dateUtils.ts` ✅
  - `validationHelpers.ts` ✅

#### **Server Actions**
- **Format:** camelCase
- **Pattern:** `{entity}.ts` atau `{action}{Entity}.ts`
- **Location:** `actions/{domain}/`
- **Examples:**
  - `actions/admin/users.ts` ✅
  - `actions/admin/products.ts` ✅
  - `actions/profile/uploadPicture.ts` ✅

#### **Folders/Directories**
- **Format:** kebab-case (lowercase dengan dash)
- **Pattern:** Singkat, descriptive, English
- **Examples:**
  - `components/shared/` ✅
  - `components/auth/` ✅
  - `app/admin/` ✅
  - `lib/utils/` ✅

#### **Route Folders (App Directory)**
- **Format:** kebab-case
- **Mengikuti URL structure**
- **Examples:**
  - `app/(site)/forgot-password/` ✅
  - `app/admin/pengguna/` ⚠️ (exception: mengikuti URL Indonesia)
  - `app/admin/hadiah/` ⚠️ (exception: mengikuti URL Indonesia)

> **Note:** Route folders boleh menggunakan Bahasa Indonesia jika URL-nya memang dalam Bahasa Indonesia untuk SEO/UX purposes. Namun, component files di dalamnya tetap English.

#### **Hooks**
- **Format:** camelCase dengan prefix `use`
- **Examples:**
  - `useDarkMode.ts` ✅
  - `useFormState.ts` ✅
  - `useModal.ts` ✅

#### **Types & Interfaces**
- **Format:** PascalCase
- **Pattern:** `{Entity}{Type}` atau `{Purpose}Props`
- **Examples:**
  - `UserFormModalProps` ✅
  - `FilterConfig` ✅
  - `ColumnConfig<T>` ✅

---

### 2. **UI Text & Labels (BAHASA INDONESIA)**
Semua teks yang ditampilkan ke user menggunakan **Bahasa Indonesia** dengan pedoman berikut:

#### **Prinsip Label Text**
- ✅ **Gunakan:** Bahasa Indonesia formal namun friendly
- ✅ **Gunakan:** Kata serapan umum yang mudah dimengerti
- ❌ **Hindari:** Bahasa Inggris murni (kecuali istilah teknis universal)
- ❌ **Hindari:** Terjemahan kaku yang membingungkan

#### **Kata Serapan yang Diizinkan**
Kata-kata teknis yang sudah umum dalam Bahasa Indonesia:

| English | Indonesian | Status | Alasan |
|---------|-----------|--------|--------|
| Email | Email | ✅ Gunakan | Sudah sangat umum |
| Password | Password | ✅ Gunakan | Lebih familiar daripada "Kata Sandi" |
| Login | Login / Masuk | ✅ Gunakan | Umum digunakan |
| Logout | Logout / Keluar | ✅ Gunakan | Umum digunakan |
| Dashboard | Dashboard | ✅ Gunakan | Tidak ada padanan yang pas |
| Profile | Profil | ✅ Gunakan | Sudah diserap |
| Download | Unduh | ✅ Gunakan | Bahasa Indonesia baku |
| Upload | Unggah | ✅ Gunakan | Bahasa Indonesia baku |
| File | Berkas / File | ✅ Keduanya OK | Kontekstual |
| Filter | Filter | ✅ Gunakan | Sudah umum |
| Export | Ekspor | ✅ Gunakan | Sudah diserap |

#### **Contoh Penerapan UI Text**

**✅ GOOD Examples:**
```tsx
// Buttons
<Button>Login</Button>
<Button>Tambah Pengguna</Button>
<Button>Unduh Excel</Button>
<Button>Konfirmasi Perubahan</Button>

// Form Labels
<label>Nama Lengkap</label>
<label>Email</label>
<label>Password</label>
<label>Nomor Telepon</label>
<label>Tanggal Lahir</label>

// Modal Titles
"Tambah Pengguna Baru"
"Edit Profil"
"Konfirmasi Hapus"
"Filter Data"

// Messages
"Data berhasil disimpan!"
"Email reset password telah dikirim"
"Apakah Anda yakin ingin menghapus data ini?"

// Placeholders
placeholder="Masukkan email Anda"
placeholder="Contoh: 081234567890"
placeholder="Pilih tanggal lahir"
```

**❌ BAD Examples:**
```tsx
// Jangan campur-campur
<Button>Add User</Button> ❌ // Harus: "Tambah Pengguna"
<Button>Save Changes</Button> ❌ // Harus: "Simpan Perubahan"

// Jangan terlalu kaku
<label>Kata Sandi</label> ❌ // Better: "Password" (lebih familiar)
<label>Surat Elektronik</label> ❌ // Better: "Email"

// Jangan inconsistent
"Anda yakin delete?" ❌ // Harus: "Anda yakin ingin menghapus?"
"Berhasil save!" ❌ // Harus: "Berhasil disimpan!"
```

---

### 3. **Code Comments & Documentation**
Untuk maintainability dan profesionalisme:

#### **Code Comments (ENGLISH)**
```tsx
// ✅ GOOD - English code comments
// Fetch user profile from database
const loadProfile = async () => {
  // ...
}

// Validate form before submission
function validateForm(data: FormData) {
  // ...
}

// ❌ BAD - Indonesian code comments
// Ambil profil user dari database ❌
// Validasi form sebelum submit ❌
```

#### **Documentation Files (ENGLISH)**
- README.md → English
- CONTRIBUTING.md → English
- API Documentation → English
- Technical Specs → English

#### **User-Facing Documentation (INDONESIAN)**
- User Manual → Bahasa Indonesia
- Help Center → Bahasa Indonesia
- Error Messages → Bahasa Indonesia
- Email Templates → Bahasa Indonesia

---

### 4. **Naming Patterns by Component Type**

#### **Modals**
```
Pattern: {Entity}{Action}Modal.tsx
Examples:
  - UserFormModal.tsx ✅
  - ConfirmDeleteModal.tsx ✅
  - FilterModal.tsx ✅
  - ImageViewModal.tsx ✅
```

#### **Forms**
```
Pattern: {Entity}Form.tsx
Examples:
  - UserForm.tsx ✅
  - LoginForm.tsx ✅
  - RewardForm.tsx ✅
```

#### **Tables/Lists**
```
Pattern: {Entity}Table.tsx atau {Entity}List.tsx
Examples:
  - UserTable.tsx ✅
  - ProductList.tsx ✅
  - AttendanceTable.tsx ✅
```

#### **Cards**
```
Pattern: {Purpose}Card.tsx
Examples:
  - StatsCard.tsx ✅
  - RewardCard.tsx ✅
  - ProfileCard.tsx ✅
```

#### **Pages**
```
Pattern: page.tsx (Next.js convention)
Location: Descriptive folder path
Examples:
  - app/admin/users/page.tsx ✅
  - app/(site)/about/page.tsx ✅
  - app/student/dashboard/page.tsx ✅
```

---

### 5. **Variable & Function Naming**

#### **Variables**
```typescript
// ✅ GOOD - English, descriptive, camelCase
const userName = 'John Doe'
const isLoading = false
const totalStudents = 150
const currentPage = 1

// ❌ BAD
const namaPengguna = 'John' ❌
const loading = false ❌ // Ambiguous, better: isLoading
const total = 150 ❌ // Not specific
const page = 1 ❌ // Could be confused with Page component
```

#### **Functions**
```typescript
// ✅ GOOD - Verb + Noun pattern
function fetchUserData() { }
function handleSubmit() { }
function validateEmail() { }
function formatDate() { }
function calculateAge() { }

// ❌ BAD
function ambilData() { } ❌ // Indonesian
function submit() { } ❌ // Missing context
function check() { } ❌ // Too vague
```

#### **Event Handlers**
```typescript
// ✅ GOOD - handle{Event} pattern
const handleClick = () => { }
const handleChange = () => { }
const handleSubmit = () => { }
const handleDelete = () => { }

// ✅ ALSO GOOD - on{Event} for props
<Button onClick={handleClick} />
<Input onChange={handleChange} />
```

#### **Boolean Variables**
```typescript
// ✅ GOOD - is/has/can prefix
const isLoading = true
const hasPermission = false
const canEdit = true
const shouldValidate = true

// ❌ BAD
const loading = true ❌ // Ambiguous type
const permission = false ❌ // Not clear it's boolean
const edit = true ❌ // Confusing
```

---

### 6. **Constants & Enums**

#### **Constants**
```typescript
// ✅ GOOD - UPPER_SNAKE_CASE for true constants
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const DEFAULT_PAGE_SIZE = 10
const API_BASE_URL = 'https://api.example.com'

// ✅ GOOD - camelCase for config objects
const validationRules = {
  minLength: 8,
  maxLength: 100,
  required: true
}
```

#### **Enums (if used)**
```typescript
// ✅ GOOD - PascalCase for enum name, UPPER_CASE for values
enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student'
}

enum FileType {
  IMAGE = 'image',
  PDF = 'pdf',
  DOCUMENT = 'document'
}
```

---

### 7. **Import Organization**

```typescript
// ✅ GOOD - Grouped and ordered
// 1. External libraries
import { useState, useEffect } from 'react'
import Image from 'next/image'

// 2. Internal utilities/helpers
import { formatDate } from '@/lib/utils/dateHelpers'
import { validateForm } from '@/lib/utils/formHelpers'

// 3. Components
import Button from '@/components/shared/Button'
import Input from '@/components/shared/Input'

// 4. Types
import type { UserFormData } from '@/types/user'

// 5. Styles (if any)
import styles from './page.module.css'
```

---

### 8. **Consistency Checklist**

Before creating/renaming any file, component, or function, verify:

- [ ] File name is in **English**?
- [ ] File name follows **correct case convention** (PascalCase/camelCase/kebab-case)?
- [ ] File name is **short yet descriptive**?
- [ ] UI text is in **Bahasa Indonesia**?
- [ ] Kata serapan yang digunakan **mudah dimengerti**?
- [ ] Code comments are in **English**?
- [ ] Variable names are **descriptive and clear**?
- [ ] No mixing Indonesian and English in the same context?

---

### 9. **Migration Notes**

Beberapa file/folder existing yang **tidak perlu diubah**:
- Route folders yang sudah match dengan URL (e.g., `app/admin/pengguna/`)
- Database table names (tetap seperti schema)
- API endpoints yang sudah established

File/Component yang **perlu di-rename** saat refactoring:
- ❌ Component dengan nama Indonesia → ✅ English equivalent
- ❌ Helper functions dengan nama unclear → ✅ Descriptive English names
- ❌ Props/interfaces yang inconsistent → ✅ Follow naming pattern

---

## 📋 Komponen Yang Perlu Direfactor

### A. **Halaman Publik (Pengunjung)**

#### 1. **Shared Layout Components**
**Komponen:** `Header` dan `Footer`

**Status Saat Ini:**
- ✅ `Navbar.tsx` sudah ada di `components/shared/`
- ✅ `Footer.tsx` sudah ada di `components/shared/`

**Action Required:**
- [ ] Verifikasi konsistensi penggunaan di semua halaman publik
- [ ] Pastikan tidak ada variasi custom di setiap halaman
- [ ] Centralize theme toggle logic

---

#### 2. **Unified Auth Form Component**
**Problem:** Form Login, Lupa Password, Reset Password memiliki UI yang mirip tapi kode terpisah

**Komponen Saat Ini:**
- `components/auth/LoginForm.tsx`
- `app/(site)/forgot-password/page.tsx` - Form inline
- `app/(site)/reset-password/page.tsx` - Form inline

**Solusi:** Buat `<AuthFormWrapper>` Component

```typescript
// components/auth/AuthFormWrapper.tsx
interface AuthFormWrapperProps {
  formType: 'login' | 'forgot-password' | 'reset-password' | 'register'
  title: string
  subtitle?: string
  onSubmit: (data: FormData) => void
  fields: AuthField[]
  buttons: AuthButton[]
  footerLinks?: FooterLink[]
}

interface AuthField {
  name: string
  type: 'email' | 'password' | 'text'
  label: string
  placeholder?: string
  required?: boolean
  showPasswordToggle?: boolean
  validation?: ValidationRule[]
}

interface AuthButton {
  label: string
  type: 'submit' | 'button'
  variant: 'primary' | 'secondary'
  onClick?: () => void
}
```

**Benefit:**
- ✅ Single source of truth untuk UI auth forms
- ✅ Mudah maintain dan update styling
- ✅ Consistency across all auth flows

**Penggunaan:**
```tsx
// Login Page
<AuthFormWrapper
  formType="login"
  title="Gerbang Masuk"
  fields={[
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'password', type: 'password', label: 'Password', required: true, showPasswordToggle: true }
  ]}
  buttons={[
    { label: 'Login', type: 'submit', variant: 'primary' }
  ]}
  footerLinks={[
    { label: 'Lupa Password?', href: '/forgot-password' }
  ]}
/>

// Forgot Password Page
<AuthFormWrapper
  formType="forgot-password"
  title="Lupa Password"
  subtitle="Masukkan email Anda untuk reset password"
  fields={[
    { name: 'email', type: 'email', label: 'Email', required: true }
  ]}
  buttons={[
    { label: 'Kembali', type: 'button', variant: 'secondary', onClick: () => router.push('/') },
    { label: 'Kirim Link Reset', type: 'submit', variant: 'primary' }
  ]}
/>
```

---

### B. **Dashboard Systems (Admin, Pembina, Siswa)**

#### 1. **Unified Dashboard Layout**
**Problem:** Setiap role (Admin, Pembina, Siswa) memiliki layout yang sama tapi kode terpisah

**Komponen Saat Ini:**
- `components/dashboard/DashboardLayout.tsx` - Sudah bagus! ✅
- `components/dashboard/DashboardSidebar.tsx` - Sudah generic dengan menuItems prop ✅

**Status:** ✅ **SUDAH OPTIMAL** - Layout sudah reusable dengan props

---

#### 2. **Unified Form Modal Component**
**Problem:** Form Tambah/Edit untuk berbagai entity (User, Hadiah, Kelas, dll) memiliki struktur modal yang mirip

**Komponen Saat Ini:**
- `components/admin/UserFormModal.tsx`
- `components/admin/PublicContentEditModal.tsx`
- `components/profile/ProfileEditModal.tsx`
- `components/rewards/RewardForm.tsx`

**Solusi:** Buat `<UnifiedFormModal>` Component

```typescript
// components/shared/UnifiedFormModal.tsx
interface UnifiedFormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  mode: 'create' | 'edit'
  fields: FormFieldConfig[]
  onSubmit: (data: Record<string, any>) => Promise<void>
  submitLabel?: string
  cancelLabel?: string
  isLoading?: boolean
}

interface FormFieldConfig {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select' | 'file' | 'checkbox'
  placeholder?: string
  required?: boolean
  defaultValue?: any
  options?: SelectOption[] // For select/dropdown
  validation?: ValidationRule[]
  size?: 'small' | 'medium' | 'large' // For layout width
  accept?: string // For file upload
  maxSize?: number // For file upload (in MB)
  rows?: number // For textarea
  showPasswordToggle?: boolean // For password fields
  colspan?: 1 | 2 // For grid layout (2 column support)
}
```

**Layout Grid System:**
```tsx
// Otomatis handle 2-column layout
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {fields.map(field => (
    <div className={field.colspan === 2 ? 'col-span-2' : ''}>
      <FormField field={field} />
    </div>
  ))}
</div>
```

**Benefit:**
- ✅ Consistent modal design (button colors: yellow Batal, gray Konfirmasi)
- ✅ Support berbagai jenis input dalam 1 component
- ✅ Automatic grid layout dengan colspan
- ✅ Built-in file upload dengan preview
- ✅ Built-in validation handling

**Penggunaan:**
```tsx
// User Form Modal
<UnifiedFormModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title={mode === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna'}
  mode={mode}
  fields={[
    { name: 'full_name', label: 'Nama Lengkap', type: 'text', required: true, colspan: 2 },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Nomor Telepon', type: 'text', placeholder: '081234567890' },
    { name: 'gender', label: 'Jenis Kelamin', type: 'select', options: genderOptions, required: true },
    { name: 'dob', label: 'Tanggal Lahir', type: 'date', required: true },
    { name: 'address', label: 'Alamat', type: 'textarea', rows: 4, colspan: 2, size: 'large' },
    { name: 'profile_picture', label: 'Foto Profil', type: 'file', accept: 'image/jpeg,image/png', maxSize: 2 }
  ]}
  onSubmit={handleSubmit}
/>
```

---

#### 3. **Unified Data Table Component**
**Problem:** Tabel untuk User, Hadiah, Attendance, dll memiliki struktur yang mirip

**Solusi:** Buat `<DataTable>` Component

```typescript
// components/shared/DataTable.tsx
interface DataTableProps<T> {
  columns: ColumnConfig<T>[]
  data: T[]
  actions?: ActionConfig<T>[]
  pagination?: PaginationConfig
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

interface ColumnConfig<T> {
  key: keyof T | string
  label: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface ActionConfig<T> {
  label: string
  icon?: React.ReactNode
  variant: 'view' | 'edit' | 'delete' | 'custom'
  onClick: (row: T) => void
  show?: (row: T) => boolean // Conditional visibility
}
```

**Benefit:**
- ✅ Consistent table styling
- ✅ Built-in actions column
- ✅ Automatic pagination
- ✅ Sorting support
- ✅ Loading states

---

#### 4. **Unified Filter Modal Component**
**Problem:** Filter modal untuk berbagai halaman (User, Hadiah, dll) memiliki struktur mirip

**Komponen Saat Ini:**
- `components/shared/FilterModal.tsx` - Untuk User filter
- `components/rewards/FilterForm.tsx` - Untuk Hadiah filter

**Solusi:** Generalisasi `FilterModal.tsx`

```typescript
// components/shared/FilterModal.tsx (Enhanced)
interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterConfig[]
  onApply: (filters: Record<string, any>) => void
  onReset: () => void
}

interface FilterConfig {
  name: string
  label: string
  type: 'select' | 'multiselect' | 'date-range' | 'number-range' | 'checkbox'
  options?: SelectOption[]
  defaultValue?: any
}
```

---

#### 5. **Unified Dashboard Stats Component**
**Problem:** Dashboard stats cards untuk Admin, Pembina, Siswa mirip

**Solusi:** Buat `<StatsGrid>` Component

```typescript
// components/dashboard/StatsGrid.tsx
interface StatsGridProps {
  stats: StatCard[]
  columns?: 2 | 3 | 4
}

interface StatCard {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  color?: string
}
```

**Penggunaan:**
```tsx
<StatsGrid
  columns={4}
  stats={[
    { label: 'Total Siswa', value: 150, icon: <UsersIcon />, color: 'orange' },
    { label: 'Total Pembina', value: 12, icon: <TeachersIcon />, color: 'blue' },
    { label: 'Kelas Aktif', value: 8, icon: <ClassIcon />, color: 'green' },
    { label: 'Total Poin', value: 5420, icon: <StarIcon />, color: 'yellow' }
  ]}
/>
```

---

### C. **Halaman Profil**

#### 1. **Unified Profile Page Component**
**Problem:** Profil untuk Admin, Pembina, Siswa memiliki struktur yang sangat mirip

**Komponen Saat Ini:**
- `app/admin/profil/page.tsx`
- `app/teacher/profil/page.tsx`
- `app/student/profil/page.tsx`

**Solusi:** Buat `<ProfilePageLayout>` Component

```typescript
// components/profile/ProfilePageLayout.tsx
interface ProfilePageLayoutProps {
  role: 'Admin' | 'Siswa' | 'Pembina'
  profileData: ProfileData
  onEdit: () => void
  menuItems: MenuItem[]
  additionalSections?: React.ReactNode // For role-specific sections
}
```

**Benefit:**
- ✅ Single source of truth untuk layout profil
- ✅ Extensible untuk role-specific features
- ✅ Consistent UI across all roles

---

## 🎨 Design System Standardization

### 1. **Color Variables**
Pastikan semua component menggunakan CSS variables dari `globals.css`:

```css
/* globals.css */
:root {
  --primary-orange: #ea580c;
  --primary-yellow: #fbbf24;
  --text-brown: #7c2d12;
  /* ... */
}

.dark {
  --primary-orange: #f97316;
  /* ... */
}
```

**Pattern:**
```tsx
// ❌ Bad - Hardcoded
<button style={{ backgroundColor: '#fbbf24' }}>

// ✅ Good - CSS Variable
<button style={{ backgroundColor: 'var(--primary-yellow)' }}>

// ✅ Better - Tailwind with custom colors
<button className="bg-primary-yellow">
```

---

### 2. **Button Standardization**
**Problem:** Button styling tidak konsisten

**Solusi:** Enhance `components/shared/Button.tsx`

```typescript
// components/shared/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
  // ... existing props
}
```

**Standard Colors:**
- **Primary (Orange):** Action buttons, Submit
- **Secondary (Yellow):** Cancel, Batal
- **Danger (Red):** Delete, Hapus
- **Ghost:** Text buttons, Links

---

### 3. **Input Standardization**
**Status:** ✅ `components/shared/Input.tsx` sudah ada

**Enhancement Needed:**
- [ ] Add file upload variant dengan preview
- [ ] Add textarea variant
- [ ] Add date picker styling
- [ ] Add select/dropdown styling

---

### 4. **Modal Standardization**
**Standard Modal Styling:**
```tsx
// Semua modal harus memiliki:
- White background (dark: dark gray)
- Rounded corners (rounded-xl)
- Max width constraints
- Scroll jika konten panjang
- Backdrop blur
- ESC key to close
- Click outside to close
- Prevent body scroll when open
```

**Button Layout (Konsisten):**
```tsx
// Footer buttons always:
<div className="flex justify-between gap-4 pt-6">
  <Button variant="secondary">Batal</Button> {/* Yellow, left */}
  <Button variant="primary">Konfirmasi</Button> {/* Gray/Dark, right */}
</div>
```

---

## 🔧 Utility Functions & Hooks

### 1. **Form Handling Utilities**
```typescript
// lib/utils/formHelpers.ts
export function validateForm(fields: FormField[], data: Record<string, any>): ValidationErrors
export function formatFormData(data: Record<string, any>): FormData
export function resetForm(fields: FormField[]): Record<string, any>
```

### 2. **Date Utilities**
```typescript
// lib/utils/dateHelpers.ts
export function formatDate(date: Date, format: string): string
export function getAge(birthDate: Date): number
export function isWeekend(date: Date): boolean
```

### 3. **Custom Hooks**
```typescript
// hooks/useFormState.ts - For reusable form logic
// hooks/useModal.ts - For modal open/close state
// hooks/usePagination.ts - For table pagination
// hooks/useInView.ts - Already exists for animations
// hooks/useDarkMode.ts - For dark mode detection (extract from components)
```

---

## 📁 Recommended File Structure

```
components/
├── shared/
│   ├── forms/
│   │   ├── UnifiedFormModal.tsx      # New - Universal form modal
│   │   ├── FormField.tsx             # New - Individual field component
│   │   ├── FormFileUpload.tsx        # New - File upload with preview
│   │   └── FormValidation.ts         # New - Validation helpers
│   ├── table/
│   │   ├── DataTable.tsx             # New - Universal data table
│   │   ├── TablePagination.tsx       # New - Pagination component
│   │   └── TableActions.tsx          # New - Action buttons component
│   ├── layout/
│   │   ├── PageContainer.tsx         # New - Standard page wrapper
│   │   └── SectionHeader.tsx         # New - Section title component
│   ├── Button.tsx                    # Enhanced
│   ├── Input.tsx                     # Enhanced
│   ├── FilterModal.tsx               # Enhanced - Generic
│   ├── ConfirmDialog.tsx             # Existing ✅
│   └── ImageModal.tsx                # Existing ✅
├── auth/
│   ├── AuthFormWrapper.tsx           # New - Unified auth forms
│   └── AuthLayout.tsx                # New - Auth pages layout
├── dashboard/
│   ├── DashboardLayout.tsx           # Existing ✅
│   ├── DashboardSidebar.tsx          # Existing ✅
│   ├── StatsGrid.tsx                 # New - Stats cards grid
│   └── StatsCard.tsx                 # New - Individual stat card
└── profile/
    ├── ProfilePageLayout.tsx         # New - Unified profile layout
    └── ProfileEditModal.tsx          # Existing - Generalize ✅
```

---

## 🚀 Migration Strategy

### Phase 1: Foundation (Week 1)
1. Create `UnifiedFormModal` component
2. Create `DataTable` component
3. Enhance `FilterModal` to be generic
4. Create `AuthFormWrapper` component

### Phase 2: Dashboard Refactoring (Week 2)
1. Create `StatsGrid` and `StatsCard` components
2. Refactor Admin dashboard to use new components
3. Refactor Teacher dashboard
4. Refactor Student dashboard

### Phase 3: Forms Migration (Week 3)
1. Migrate all User forms to `UnifiedFormModal`
2. Migrate Hadiah forms
3. Migrate Profile forms
4. Migrate Public Content forms

### Phase 4: Auth Pages (Week 4)
1. Migrate Login to `AuthFormWrapper`
2. Migrate Forgot Password
3. Migrate Reset Password
4. Test all auth flows

### Phase 5: Testing & Cleanup
1. Comprehensive testing of all refactored components
2. Remove old duplicate components
3. Update documentation
4. Code review

---

## ✅ Refactoring Checklist

### Before Starting Refactoring
- [ ] Backup current codebase
- [ ] Create feature branch: `refactor/unified-components`
- [ ] Document current component usage
- [ ] Setup testing environment

### During Refactoring
- [ ] Create new component
- [ ] Test component in isolation (Storybook optional)
- [ ] Migrate one page as proof of concept
- [ ] Get approval before full migration
- [ ] Migrate remaining pages one by one
- [ ] Test each migration thoroughly

### After Refactoring
- [ ] Remove old duplicate components
- [ ] Update imports across codebase
- [ ] Run full test suite
- [ ] Verify dark mode works
- [ ] Verify responsive design
- [ ] Performance check
- [ ] Code review
- [ ] Merge to main

---

## 📝 Additional Findings & Recommendations

### 1. **Inconsistent Dark Mode Detection**
**Problem:** Setiap halaman memiliki duplicate dark mode detection code

```tsx
// Repeated in every page:
const [isDarkMode, setIsDarkMode] = useState(false)
useEffect(() => {
  const checkDarkMode = () => {
    setIsDarkMode(document.documentElement.classList.contains('dark'))
  }
  checkDarkMode()
  const observer = new MutationObserver(checkDarkMode)
  // ...
}, [])
```

**Solusi:** Buat custom hook `useDarkMode()`

```typescript
// hooks/useDarkMode.ts
export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  useEffect(() => {
    // Implementation
  }, [])
  
  return isDarkMode
}

// Usage in any component:
const isDarkMode = useDarkMode()
```

---

### 2. **Repeated Color Logic**
**Problem:** Dynamic color calculation berulang di banyak component

```tsx
// Repeated everywhere:
const textColor = isDarkMode ? '#ea580c' : '#7c2d12'
```

**Solusi:** Use CSS variables atau create utility function

```typescript
// lib/utils/theme.ts
export function getTextColor(isDarkMode: boolean) {
  return isDarkMode ? 'var(--primary-orange)' : 'var(--text-brown)'
}
```

---

### 3. **Image Upload Logic Duplication**
**Problem:** Image upload + preview logic di-copy paste di banyak form

**Solusi:** Create reusable `<ImageUploadField>` component

```typescript
// components/shared/ImageUploadField.tsx
interface ImageUploadFieldProps {
  label: string
  currentImageUrl?: string
  onUpload: (file: File) => Promise<string>
  accept?: string
  maxSizeM?: number
  showPreview?: boolean
}
```

---

### 4. **Search & Filter Pattern**
**Problem:** Search + Filter + Sort pattern berulang di banyak halaman

**Solusi:** Create `<DataPageHeader>` component

```typescript
// components/shared/DataPageHeader.tsx
interface DataPageHeaderProps {
  title: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  onFilter?: () => void
  onExport?: () => void
  onAdd?: () => void
  addButtonLabel?: string
}
```

---

## 🎓 Best Practices to Follow

### 1. **Component Design Principles**
- **Single Responsibility:** Satu component = satu tujuan
- **Composition over Inheritance:** Gunakan composition untuk flexibility
- **Props over State:** Minimize internal state, maximize props
- **TypeScript First:** Always define interfaces untuk props

### 2. **Performance Optimization**
- Use `React.memo()` untuk component yang sering re-render
- Use `useMemo()` dan `useCallback()` untuk expensive calculations
- Lazy load modal components
- Optimize bundle size dengan code splitting

### 3. **Accessibility**
- Semua form fields harus memiliki label
- Buttons harus memiliki aria-label yang descriptive
- Modal harus trap focus
- Support keyboard navigation (Tab, Enter, ESC)

### 4. **Error Handling**
- Consistent error message display
- Form validation errors harus user-friendly
- Network error handling dengan retry mechanism
- Loading states untuk semua async operations

---

## 📊 Expected Impact

### Code Reduction
- **Estimated:** 30-40% reduction in total lines of code
- **Form components:** From ~5 different forms → 1 unified component
- **Page components:** From ~15 pages with duplicate logic → Shared layout components

### Maintainability
- ✅ Single source of truth untuk UI components
- ✅ Bug fixes di 1 component = fixes everywhere
- ✅ Style changes lebih mudah dan konsisten
- ✅ New features lebih cepat karena leverage existing components

### Developer Experience
- ✅ Lebih mudah onboarding developer baru
- ✅ Lebih cepat development karena less boilerplate
- ✅ Consistency = less decision fatigue

---

## 📚 References & Resources

- [React Component Composition Patterns](https://react.dev/learn/passing-props-to-a-component)
- [TypeScript Generics for Reusable Components](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Design Systems Best Practices](https://www.designsystems.com/)
- [Tailwind CSS Component Patterns](https://tailwindcss.com/docs/reusing-styles)

---

## 💡 Next Steps

1. **Review & Approval:** Diskusi pedoman ini dengan tim
2. **Prioritization:** Tentukan component mana yang di-refactor dulu
3. **Prototyping:** Buat proof of concept untuk `UnifiedFormModal`
4. **Implementation:** Mulai fase 1 refactoring
5. **Iteration:** Review hasil, adjust strategy jika perlu

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-15  
**Author:** Development Team  
**Status:** 📋 Planning
