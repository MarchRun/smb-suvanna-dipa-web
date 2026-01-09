-- =====================================================
-- MIGRATION: Standardize Column Names to English
-- Run this in Supabase SQL Editor
-- Data will be preserved, only column names change
-- =====================================================

-- ===== TABLE: classes =====
-- Remove duplicate column (id_wali_kelas is same as teacher_id)
-- First, copy data from id_wali_kelas to teacher_id if teacher_id is null
UPDATE classes SET teacher_id = id_wali_kelas WHERE teacher_id IS NULL AND id_wali_kelas IS NOT NULL;

-- Drop the constraint first
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_id_wali_kelas_fkey;

-- Drop the duplicate column
ALTER TABLE classes DROP COLUMN IF EXISTS id_wali_kelas;

-- ===== TABLE: products =====
ALTER TABLE products RENAME COLUMN url_gambar_hadiah TO image_url;

-- ===== TABLE: profiles =====
ALTER TABLE profiles RENAME COLUMN nomor_telepon TO phone;
ALTER TABLE profiles RENAME COLUMN alamat_rumah TO address;
ALTER TABLE profiles RENAME COLUMN url_foto_profil TO profile_picture;

-- ===== TABLE: public_content =====
-- First drop the foreign key constraint
ALTER TABLE public_content DROP CONSTRAINT IF EXISTS public_content_updated_by_fkey;

-- Rename columns
ALTER TABLE public_content RENAME COLUMN isi_konten TO content;
ALTER TABLE public_content RENAME COLUMN id_pengguna TO updated_by;
ALTER TABLE public_content RENAME COLUMN urutan_konten TO display_order;
ALTER TABLE public_content RENAME COLUMN status_publikasi TO is_published;

-- Re-add the foreign key constraint with new column name
ALTER TABLE public_content 
ADD CONSTRAINT public_content_updated_by_fkey 
FOREIGN KEY (updated_by) REFERENCES profiles (id) ON DELETE SET NULL;

-- =====================================================
-- VERIFICATION: Check the renamed columns
-- =====================================================
-- Run these SELECT statements to verify:
-- SELECT * FROM classes LIMIT 1;
-- SELECT * FROM products LIMIT 1;
-- SELECT * FROM profiles LIMIT 1;
-- SELECT * FROM public_content LIMIT 1;

-- =====================================================
-- SUMMARY OF CHANGES:
-- =====================================================
-- classes: removed id_wali_kelas (duplicate of teacher_id)
-- products: url_gambar_hadiah → image_url
-- profiles: nomor_telepon → phone
-- profiles: alamat_rumah → address
-- profiles: url_foto_profil → profile_picture
-- public_content: isi_konten → content
-- public_content: id_pengguna → updated_by
-- public_content: urutan_konten → display_order
-- public_content: status_publikasi → is_published
-- =====================================================
