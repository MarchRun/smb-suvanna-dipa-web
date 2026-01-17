# Skenario Pengujian - Halaman Pengguna

## Total: 122 Test Cases

---

## A. HALAMAN UTAMA (10)

| ID | Test Case | Expected |
|----|-----------|----------|
| A01 | Page loads | No errors |
| A02 | Header "Pengguna" | Correct text |
| A03 | Tambah button | Visible, themed |
| A04 | Unduh Excel button | Visible, themed |
| A05 | Search bar | Rounded, with icon |
| A06 | Filter button | Round, with icon |
| A07 | Table shows data | Users listed |
| A08 | Loading state | Shows briefly |
| A09 | Empty state | "Tidak ada data" |
| A10 | Responsive | Mobile layout works |

---

## B. PENCARIAN (10)

| ID | Test Case | Expected |
|----|-----------|----------|
| B01 | Search by name | Filters correctly |
| B02 | Search by email | Matches email |
| B03 | Partial search | Shows matches |
| B04 | Case insensitive | Works |
| B05 | No results | Empty state |
| B06 | Search with spaces | Finds exact |
| B07 | Clear search | Shows all |
| B08 | Search + Filter | Combined works |
| B09 | Border color | Theme color |
| B10 | Placeholder | "Cari Pengguna..." |

---

## C. FILTER (15)

| ID | Test Case | Expected |
|----|-----------|----------|
| C01 | Open modal | Animated |
| C02 | Filter Siswa | Only Siswa |
| C03 | Filter Pembina | Only Pembina |
| C04 | Semua Peran | All users |
| C05 | Filter class | Only that class |
| C06 | Semua Kelas | All classes |
| C07 | Filter Laki-laki | Males only |
| C08 | Filter Perempuan | Females only |
| C09 | Semua Gender | All genders |
| C10 | Multiple filters | Combined |
| C11 | Cancel | No changes |
| C12 | Reset | All data |
| C13 | Dropdown style | Rounded |
| C14 | Filter persists | Remembered |
| C15 | Count indicator | Shows count |

---

## D. TABEL DATA (12)

| ID | Test Case | Expected |
|----|-----------|----------|
| D01 | Correct columns | No, Nama, Email, etc |
| D02 | Sort by name | Alphabetical |
| D03 | Toggle sort | Asc/Desc |
| D04 | View button | Opens detail |
| D05 | Edit button | Opens modal |
| D06 | Delete button | Opens confirm |
| D07 | Action buttons | All visible |
| D08 | Table borders | Proper style |
| D09 | Row colors | Alternating |
| D10 | Phone format | Correct |
| D11 | Class name | Not ID |
| D12 | Role badge | Styled |

---

## E. DETAIL PENGGUNA (12)

| ID | Test Case | Expected |
|----|-----------|----------|
| E01 | Navigate | Correct URL |
| E02 | Info displayed | All fields |
| E03 | Profile picture | Photo/initials |
| E04 | Back button | Returns to list |
| E05 | Edit button | Opens modal |
| E06 | Delete button | Opens confirm |
| E07 | Class name | Correct |
| E08 | Date format | Formatted |
| E09 | Address | Full shown |
| E10 | Points | Displayed |
| E11 | Page title | User name |
| E12 | Loading state | Shows loader |

---

## F. FORM TAMBAH (15)

| ID | Test Case | Expected |
|----|-----------|----------|
| F01 | Open modal | Form shows |
| F02 | Title | "Tambah Pengguna" |
| F03 | All fields | Present |
| F04 | Required validation | Shows errors |
| F05 | Email validation | Invalid error |
| F06 | Password min | Too short error |
| F07 | Date picker | Not text input |
| F08 | Gender dropdown | Options show |
| F09 | Class dropdown | Classes list |
| F10 | Role dropdown | Siswa/Pembina |
| F11 | File upload | Can select |
| F12 | Submit success | Creates user |
| F13 | Cancel | Closes modal |
| F14 | Input styling | Brown, rounded |
| F15 | Label color | Brown |

---

## G. FORM EDIT (12)

| ID | Test Case | Expected |
|----|-----------|----------|
| G01 | Open modal | With data |
| G02 | Title | "Edit Pengguna" |
| G03 | Data pre-filled | Existing data |
| G04 | Email editable | Can change |
| G05 | Password optional | Can skip |
| G06 | Update photo | Uploads |
| G07 | Change role | Updates |
| G08 | Change class | Updates |
| G09 | Submit success | Saves |
| G10 | Cancel | No changes |
| G11 | Validation | Shows errors |
| G12 | Date editable | Picker works |

---

## H. HAPUS (8)

| ID | Test Case | Expected |
|----|-----------|----------|
| H01 | Confirm opens | Dialog shows |
| H02 | Shows username | In message |
| H03 | Confirm deletes | User removed |
| H04 | Cancel preserves | Not deleted |
| H05 | Loading state | Spinner |
| H06 | Success | Gone from table |
| H07 | ESC key | Closes |
| H08 | Click outside | Closes |

---

## I. UNDUH EXCEL (12)

| ID | Test Case | Expected |
|----|-----------|----------|
| I01 | Open modal | Shows |
| I02 | Filter role | Exports filtered |
| I03 | Filter class | Exports class |
| I04 | Filter gender | Exports gender |
| I05 | Export all | All users |
| I06 | File downloads | .xlsx file |
| I07 | Filename | Date-based |
| I08 | Excel columns | Correct headers |
| I09 | Data correct | Matches DB |
| I10 | Empty alert | "Tidak ada data" |
| I11 | Cancel | No download |
| I12 | Loading | "Mengunduh..." |

---

## J. KOLOM INPUT (10)

| ID | Test Case | Expected |
|----|-----------|----------|
| J01 | Text styling | Brown, rounded |
| J02 | Email type | Email keyboard |
| J03 | Password toggle | Show/hide |
| J04 | Phone input | Accepts digits |
| J05 | Date type | Native picker |
| J06 | Select styling | Same radius |
| J07 | Textarea | Rounded |
| J08 | File input | Split button |
| J09 | Focus state | Ring visible |
| J10 | Disabled | Grayed out |

---

## K. NAVIGATION (8)

| ID | Test Case | Expected |
|----|-----------|----------|
| K01 | Sidebar active | Highlighted |
| K02 | Sidebar nav | Works |
| K03 | Back from detail | Returns |
| K04 | Browser back | Works |
| K05 | Deep link | Direct access |
| K06 | Breadcrumb | If exists |
| K07 | 404 handling | Error shown |
| K08 | Auth redirect | To login |

---

## L. DARK MODE (8)

| ID | Test Case | Expected |
|----|-----------|----------|
| L01 | Toggle | Switches |
| L02 | Sidebar colors | Consistent |
| L03 | Table styling | Readable |
| L04 | Modal styling | Dark theme |
| L05 | Input styling | Visible |
| L06 | Button styling | Visible |
| L07 | Matches public | Same scheme |
| L08 | Persists | Remembered |

---

## Known Bugs (Fixed)

- [x] ~~Filter "Semua" tidak berfungsi dengan benar~~ → Fixed: Select now defaults to "Semua" option
- [x] ~~Excel export perlu diverifikasi~~ → Fixed: Added styling (orange header, borders)
- [x] ~~Dark mode dashboard ≠ public page~~ → Fixed: Now uses CSS variables

## Recent Fixes (17 Jan 2026)
- ✅ Date input now uses native calendar picker
- ✅ Select component shows "Semua" as default (not disabled "Pilih...")
- ✅ Excel export with professional styling (header, borders, frozen row)
- ✅ File upload standardized to 1MB limit
- ✅ Navigation path fixed (`/admin/konten-publik` → `/admin/konten`)
- ✅ 20 random test users created via Admin API
