-- Insert Sample Public Content for Activities Page Only
-- Run this in Supabase SQL Editor

-- Clear existing data first
DELETE FROM public_content;

-- Activities Page - Hero Section
INSERT INTO public_content (section, title, content) VALUES
('hero', 'Page Title', '{"title": "Aktivitas SMB Suvanna Dipa", "subtitle": "SMB Suvanna Dipa menyelenggarakan berbagai kegiatan rutin dan tahunan yang dirancang untuk memperkaya pemahaman spiritual dan mempererat kebersamaan antar anggota."}'::jsonb);

-- Activities Page - About Activities
INSERT INTO public_content (section, title, content) VALUES
('about', 'About Activities', '{"text": "Setiap kegiatan diselenggarakan dengan penuh kesadaran dan tujuan pembelajaran. Kami percaya bahwa melalui kegiatan yang terstruktur dan bermakna, siswa dapat mengembangkan pemahaman yang lebih mendalam tentang ajaran Buddha."}'::jsonb);

-- Activities Page - Activity Items (stored as array)
INSERT INTO public_content (section, title, content) VALUES
('activities', 'All Activities', '{
  "items": [
    {"title": "Perayaan Waisak", "description": "Memperingati Kelahiran, Pencerahan, dan Parinibbana Buddha Gautama. Perayaan diisi dengan puja bakti, meditasi bersama, dan kegiatan Dana.", "image": null},
    {"title": "Retreat Meditasi", "description": "Program retreat meditasi intensif untuk memperdalam praktik mindfulness dan konsentrasi. Dilaksanakan di lingkungan yang tenang dan kondusif.", "image": null},
    {"title": "Bakti Sosial", "description": "Kegiatan berbagi kepada masyarakat kurang mampu sebagai praktik Dana dan Metta. Meliputi pembagian sembako dan kunjungan ke panti asuhan.", "image": null},
    {"title": "Dharma Camp", "description": "Kemah Dhamma untuk siswa dan remaja dengan berbagai kegiatan edukatif dan menyenangkan yang mengajarkan nilai-nilai Buddhis.", "image": null},
    {"title": "Kelas Dhamma Rutin", "description": "Pembelajaran Dhamma setiap minggu dengan topik yang berbeda, dibimbing oleh guru yang berpengalaman.", "image": null},
    {"title": "Meditasi Pagi", "description": "Sesi meditasi pagi setiap hari Minggu untuk melatih ketenangan pikiran dan konsentrasi.", "image": null}
  ]
}'::jsonb);

-- Success Message
SELECT 'Sample Activities content inserted successfully! Total rows: ' || COUNT(*)::text as message
FROM public_content;
