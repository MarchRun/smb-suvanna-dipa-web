/**
 * Public Content Server Actions
 * Path: actions/content/manage.ts
 * Tanggung Jawab: Mengelola dan menampilkan konten halaman publik (About, Gallery, dll)
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResponse, PublicContent } from "@/types";

// Interfaces bawaan dari kode lamamu tetap dipertahankan
export interface ActivityContent {
  agenda: string[];
}
export interface GalleryItem {
  image_url: string;
  caption: string;
}
export interface GalleryContent {
  items: GalleryItem[];
}
export interface TestimonialItem {
  name: string;
  description: string;
}
export interface TestimonialContent {
  items: TestimonialItem[];
}

/**
 * Helper Keamanan
 */
async function verifyAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Tidak terautentikasi");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Akses ditolak");

  return supabase;
}

// ==========================================
// FUNGSI PUBLIK (BACA DATA)
// ==========================================

export async function getContentBySection(
  section: string,
): Promise<ActionResponse<PublicContent | null>> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("public_content")
      .select("*")
      .eq("section", section)
      .eq("is_published", true)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return { success: true, data: data || null };
  } catch (error: any) {
    return { success: false, error: "Gagal mengambil konten", data: null };
  }
}

export async function getAllPublicContent(): Promise<
  ActionResponse<PublicContent[]>
> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("public_content")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error: any) {
    return { success: false, error: "Gagal mengambil data konten", data: [] };
  }
}

// ==========================================
// FUNGSI ADMIN (UBAH DATA)
// ==========================================

export async function updateActivities(
  agenda: string[],
): Promise<ActionResponse> {
  try {
    const supabase = await verifyAdminAccess();
    if (agenda.length !== 4) throw new Error("Harus ada 4 agenda");

    const content: ActivityContent = { agenda };

    // Menggunakan upsert agar tidak perlu cek exists dulu (Lebih DRY)
    const { error } = await supabase.from("public_content").upsert(
      {
        section: "activities",
        title: "Agenda Tahunan Kegiatan",
        content,
        is_published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "section" },
    );

    if (error) throw error;

    revalidatePath("/admin/content");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal update agenda" };
  }
}

export async function updateGallery(
  items: GalleryItem[],
): Promise<ActionResponse> {
  try {
    const supabase = await verifyAdminAccess();
    if (items.length !== 5) throw new Error("Harus ada 5 gambar");

    const content: GalleryContent = { items };
    const images = items.map((item) => item.image_url);

    const { error } = await supabase.from("public_content").upsert(
      {
        section: "gallery",
        title: "Galeri Kegiatan",
        content,
        images,
        is_published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "section" },
    );

    if (error) throw error;

    revalidatePath("/admin/content");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal update galeri" };
  }
}

export async function updateTestimonials(
  items: TestimonialItem[],
): Promise<ActionResponse> {
  try {
    const supabase = await verifyAdminAccess();
    if (items.length !== 3) throw new Error("Harus ada 3 testimoni");
    if (items.some((item) => !item.name?.trim()))
      throw new Error("Semua nama harus diisi");

    const content: TestimonialContent = { items };

    const { error } = await supabase.from("public_content").upsert(
      {
        section: "testimonials",
        title: "Testimoni",
        content,
        is_published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "section" },
    );

    if (error) throw error;

    revalidatePath("/admin/content");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal update testimoni" };
  }
}
