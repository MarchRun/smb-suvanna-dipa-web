# Test Scenarios: Modul Hadiah & Poin (Rewards System)

Dokumen ini berisi daftar skenario pengujian (test cases) yang sangat spesifik untuk memastikan kualitas fitur Hadiah (Admin) dan Poin (Siswa).

**Total Skenario:** 75+ Kasus Uji

---

## 👨‍💼 Role: Admin
Laman: `/admin/rewards`

### A. Tambah Hadiah (Create)
| No | Kategori | Skenario | Expected Result |
|----|----------|----------|-----------------|
| A01 | Positif | Input nama, harga (10), stok (100), gambar valid (JPG <1MB). | Hadiah berhasil dibuat, muncul di list, modal tertutup. |
| A02 | Positif | Input nama, harga (0), stok (100) (Hadiah Gratis). | Hadiah berhasil dibuat dengan harga 0 poin. |
| A03 | Positif | Input nama, harga (1000000), stok (1). | Hadiah berhasil dibuat (batas atas wajar). |
| A04 | Negatif | Kosongkan field "Nama Produk". | Muncul pesan error validasi "Nama produk wajib diisi". |
| A05 | Negatif | Input "Harga" dengan nilai negatif (-500). | Validasi gagal, input ditolak atau pesan "Harga tidak boleh negatif". |
| A06 | Negatif | Input "Harga" dengan huruf/simbol ("abc"). | Input field tidak menerima karakter non-numerik. |
| A07 | Negatif | Input "Stok" dengan nilai negatif (-1). | Validasi gagal, pesan "Stok tidak boleh negatif". |
| A08 | Negatif | Upload gambar dengan format .PDF. | Upload gagal, pesan "Format file harus JPG/PNG". |
| A09 | Negatif | Upload gambar dengan ukuran > 5MB. | Upload gagal, pesan "Ukuran file maksimal 1MB/2MB". |
| A10 | Edge Case | Input nama dengan karakter emoji atau simbol entitas HTML. | Nama tersimpan sesuai input (tanpa error XSS saat render). |
| A11 | Edge Case | Input nama sangat panjang (misal 255 karakter). | Nama tersimpan, tampilan di card terpotong (truncate) dengan rapi. |
| A12 | UX | Klik tombol "Batal" saat form sudah terisi sebagian. | Modal tertutup, data tidak tersimpan. |
| A13 | UX | Klik area backdrop (luar modal) saat form terbuka. | Modal tertutup (jika behaviour default) atau tetap terbuka (jika forced). |

### B. Edit Hadiah (Update)
| No | Kategori | Skenario | Expected Result |
|----|----------|----------|-----------------|
| A14 | Positif | Ubah "Nama Produk" saja. | Nama berubah, harga & stok tetap. |
| A15 | Positif | Ubah "Harga" menjadi lebih mahal. | Harga terupdate di database & UI. |
| A16 | Positif | Ubah "Stok" menjadi 0 (Out of Stock). | Stok menjadi 0, siswa tidak bisa redeem. |
| A17 | Positif | Ganti gambar produk dengan gambar baru. | Gambar baru muncul, gambar lama terhapus/timpa (tergantung logika storage). |
| A18 | Negatif | Hapus nama produk (jadi string kosong) lalu Simpan. | Muncul error validasi. |
| A19 | Edge Case | Edit produk yang sedang ditransaksikan (pending). | Data master berubah, transaksi pending tetap mengacu snapshot harga lama (ideal) atau ikut berubah (perlu dicek). |
| A20 | UX | Buka form edit, ubah data, lalu tekan cancel. Buka lagi. | Data di form harus kembali ke nilai asli (reset), bukan nilai ubahan tadi. |

### C. Hapus Hadiah (Delete)
| No | Kategori | Skenario | Expected Result |
|----|----------|----------|-----------------|
| A21 | Positif | Klik hapus pada hadiah yang tidak ada transaksi. | Muncul konfirmasi, klik Ya, data hilang dari list. |
| A22 | UX | Klik hapus, muncul konfirmasi, klik Batal. | Data tetap ada. |
| A23 | Negatif | Hapus hadiah yang sudah pernah diredeem (Integrity Constraint). | Gagal hapus (Constraints Error) atau Soft Delete (Status: Deleted). |

### D. List & Filter (Read)
| No | Kategori | Skenario | Expected Result |
|----|----------|----------|-----------------|
| A24 | Positif | Buka halaman rewards pertama kali. | Loading spinner muncul, lalu list produk tampil. |
| A25 | Positif | Search dengan kata kunci "Buku". | Hanya menampilkan hadiah yang mengandung kata "Buku". |
| A26 | Positif | Search dengan kata kunci acak "xyz123". | List kosong, muncul pesan "Tidak ada hadiah ditemukan". |
| A27 | Positif | Filter Stock: "Out of Stock". | Hanya menampilkan hadiah dengan stok 0. |
| A28 | Positif | Filter Stock: "In Stock". | Hanya menampilkan hadiah dengan stok > 0. |

### E. Validasi Penukaran (Approval)
Laman: `/admin/rewards/validation` atau `/admin/rewards` (Tab Validasi)

| No | Kategori | Skenario | Expected Result |
|----|----------|----------|-----------------|
| A29 | Positif | Admin menyetujui (Terima) request siswa. | Status transaksi "Approved", Stok berkurang (jika potong stok saat approve), Poin siswa terpotong (jika belum). |
| A30 | Positif | Admin menolak request siswa. | Status "Rejected", Poin dikembalikan ke siswa. |
| A31 | Negatif | Admin memvalidasi request yang sudah dibatalkan siswa. | Muncul notifikasi "Request tidak valid" atau status sudah berubah. |
| A32 | UI | Cek detail: Nama Siswa, Hadiah, Tanggal. | Data sesuai dengan yang direquest. |

---

## 👨‍🎓 Role: Siswa
Laman: `/student/points`

### F. Lihat Hadiah (Browsing)
| No | Kategori | Skenario | Expected Result |
|----|----------|----------|-----------------|
| S01 | Positif | Melihat list hadiah saya. | Menampilkan Info Poin Saya, dan Grid Hadiah. |
| S02 | Positif | Cek status poin di header. | Poin sesuai dengan total perolehan - total penukaran. |
| S03 | Positif | Cari hadiah "Pensil". | Muncul hadiah pensil. |
| S04 | UI | Melihat hadiah yang stoknya habis. | Tombol "Tukar" disable atau tulisan "Stok Habis" muncul. |
| S05 | UI | Melihat hadiah yang harganya > Poin Saya. | Tombol "Tukar" disable/greyed out atau bisa diklik tapi muncul warning. |

### G. Tukar Poin (Redemption)
| No | Kategori | Skenario | Expected Result |
|----|----------|----------|-----------------|
| S06 | Positif | Tukar hadiah (Poin Cukup, Stok Ada). | Muncul Modal Konfirmasi -> Klik Ya -> Sukses. Poin berkurang (visual). |
| S07 | Positif | Tukar hadiah Gratis (0 Poin). | Sukses, poin tidak berkurang. |
| S08 | Negatif | Tukar hadiah saat Poin Tidak Cukup. | Gagal, muncul alert "Poin tidak cukup". (Bypass button disable lewat inspect element). |
| S09 | Negatif | Tukar hadiah saat Stok 0. | Gagal, muncul alert "Stok habis". |
| S10 | Edge Case | Klik tombol "Tukar" berkali-kali dengan cepat (Spam click). | Sistem hanya memproses 1 request transaksi (Debouncing check). |
| S11 | Edge Case | Transaksi saat poin pas-pasan (Poin = Harga). | Sukses, sisa poin jadi 0. |
| S12 | Edge Case | Dua siswa menukar hadiah terakhir (Stok 1) bersamaan. | Salah satu sukses, yang lain gagal (Concurrency lock check). |

### H. Status & Riwayat
Laman: `/student/points/status`

| No | Kategori | Skenario | Expected Result |
|----|----------|----------|-----------------|
| S13 | Positif | Cek status penukaran "Pending". | Muncul di list dengan badge kuning/abu. |
| S14 | Positif | Cek status penukaran "Disetujui". | Muncul di list dengan badge hijau. |
| S15 | Positif | Cek status penukaran "Ditolak". | Muncul di list dengan badge merah. |
| S16 | Positif | Batalkan request "Pending". | Request hilang/berubah status "Cancelled", Poin kembali otomatis. |
| S17 | Negatif | Batalkan request yang sudah "Disetujui". | Tombol batal tidak ada atau aksi ditolak. |

---

## 🔄 Integrasi & System Flow
| No | Kategori | Skenario | Expected Result |
|----|----------|----------|-----------------|
| I01 | Flow | Admin tambah stok -> Siswa lihat. | Saat admin update stok dari 0 ke 5, siswa harus bisa melihat tombol "Tukar" menjadi aktif (setelah refresh). |
| I02 | Flow | Siswa redeem -> Admin cek validasi. | Request baru harus muncul realtime atau setelah refresh di dashboard admin. |
| I03 | Flow | Admin Reject -> Siswa cek poin. | Poin siswa harus bertambah kembali (Refund) setelah direject admin. |
| I04 | Database| Hapus user siswa. | Riwayat penukaran hadiah user tersebut harus tertangani (Cascade delete atau Set Null). |
