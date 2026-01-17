-- SQL Script untuk insert data konten publik awal
-- Jalankan di Supabase SQL Editor

-- ==================================================
-- SECTION: ACTIVITIES (Agenda Tahunan Kegiatan)
-- ==================================================

-- Cek apakah sudah ada data activities
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public_content WHERE section = 'activities') THEN
        INSERT INTO public_content (section, content)
        VALUES (
            'activities',
            '{"agenda": ["Waisak", "Kathina", "Asadha", "Magha Puja"]}'::jsonb
        );
    ELSE
        UPDATE public_content
        SET content = '{"agenda": ["Waisak", "Kathina", "Asadha", "Magha Puja"]}'::jsonb
        WHERE section = 'activities';
    END IF;
END $$;

-- ==================================================
-- SECTION: GALLERY (Galeri Kegiatan - 5 gambar)
-- ==================================================

-- Cek apakah sudah ada data gallery
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public_content WHERE section = 'gallery') THEN
        INSERT INTO public_content (section, content)
        VALUES (
            'gallery',
            '{"items": [
                {"image_url": "/images/slider-image1.png", "caption": "Kegiatan Waisak 2025"},
                {"image_url": "/images/slider-image2.png", "caption": "Perayaan Kathina"},
                {"image_url": "/images/slider-image3.png", "caption": "Meditasi Bersama"},
                {"image_url": "/images/slider-image4.png", "caption": "Bakti Sosial"},
                {"image_url": "/images/slider-image5.png", "caption": "Upacara Magha Puja"}
            ]}'::jsonb
        );
    ELSE
        UPDATE public_content
        SET content = '{"items": [
            {"image_url": "/images/slider-image1.png", "caption": "Kegiatan Waisak 2025"},
            {"image_url": "/images/slider-image2.png", "caption": "Perayaan Kathina"},
            {"image_url": "/images/slider-image3.png", "caption": "Meditasi Bersama"},
            {"image_url": "/images/slider-image4.png", "caption": "Bakti Sosial"},
            {"image_url": "/images/slider-image5.png", "caption": "Upacara Magha Puja"}
        ]}'::jsonb
        WHERE section = 'gallery';
    END IF;
END $$;

-- ==================================================
-- SECTION: TESTIMONIALS (Testimoni - 3 orang)
-- ==================================================

-- Cek apakah sudah ada data testimonials
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public_content WHERE section = 'testimonials') THEN
        INSERT INTO public_content (section, content)
        VALUES (
            'testimonials',
            '{"items": [
                {"name": "Andi Wijaya", "description": "SMB Suvanna Dipa sangat membantu anak saya dalam memahami nilai-nilai kebajikan dan meditasi. Pengajarannya sangat baik dan menyenangkan."},
                {"name": "Siti Rahayu", "description": "Anak-anak sangat antusias mengikuti kegiatan di SMB. Lingkungannya positif dan guru-gurunya sangat sabar dalam mengajar."},
                {"name": "Budi Santoso", "description": "Saya sangat bersyukur anak saya bisa belajar di SMB Suvanna Dipa. Perkembangan spiritual dan karakternya meningkat pesat."}
            ]}'::jsonb
        );
    ELSE
        UPDATE public_content
        SET content = '{"items": [
            {"name": "Andi Wijaya", "description": "SMB Suvanna Dipa sangat membantu anak saya dalam memahami nilai-nilai kebajikan dan meditasi. Pengajarannya sangat baik dan menyenangkan."},
            {"name": "Siti Rahayu", "description": "Anak-anak sangat antusias mengikuti kegiatan di SMB. Lingkungannya positif dan guru-gurunya sangat sabar dalam mengajar."},
            {"name": "Budi Santoso", "description": "Saya sangat bersyukur anak saya bisa belajar di SMB Suvanna Dipa. Perkembangan spiritual dan karakternya meningkat pesat."}
        ]}'::jsonb
        WHERE section = 'testimonials';
    END IF;
END $$;

-- ==================================================
-- VERIFIKASI DATA
-- ==================================================

-- Tampilkan semua data yang telah diinsert
SELECT section, content FROM public_content ORDER BY section;
