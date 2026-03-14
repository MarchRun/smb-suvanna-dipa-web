/**
 * User Profile Server Actions
 * Path: actions/users/profile.ts
 * Tanggung Jawab: Manajemen profil mandiri (Self-service)
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResponse, Profile } from "@/types";

/**
 * Mengambil profil user yang sedang login
 */
export async function getCurrentUserProfile(): Promise<
  ActionResponse<Profile | null>
> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return { success: false, error: "Tidak terautentikasi", data: null };

    // Tidak butuh Admin Client, RLS secara default mengizinkan user membaca profilnya sendiri
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    return { success: true, data: profile };
  } catch (error) {
    console.error("[getCurrentUserProfile] Error:", error);
    return { success: false, error: "Gagal mengambil data profil", data: null };
  }
}

/**
 * Memperbarui data profil sendiri
 */
export async function updateProfile(
  data: Partial<Profile>,
): Promise<ActionResponse<Profile>> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return { success: false, error: "Tidak terautentikasi" };

    // Mencegah user mengupdate field sensitif (seperti poin atau role) secara mandiri
    const safeData = {
      full_name: data.full_name,
      phone: data.phone,
      gender: data.gender,
      birth_date: data.birth_date,
      address: data.address,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update(safeData)
      .eq("id", user.id) // Pastikan hanya bisa update ID sendiri
      .select()
      .single();

    if (updateError) throw updateError;

    revalidatePath("/", "layout");
    return { success: true, data: updatedProfile };
  } catch (error) {
    console.error("[updateProfile] Error:", error);
    return { success: false, error: "Gagal memperbarui profil" };
  }
}

/**
 * Mengunggah foto profil
 */
export async function uploadProfilePicture(
  formData: FormData,
): Promise<ActionResponse<string>> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return { success: false, error: "Tidak terautentikasi" };

    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "File tidak ditemukan" };

    // Validasi tipe & ukuran (Maks 2MB)
    if (!file.type.startsWith("image/"))
      return { success: false, error: "File harus berupa gambar" };
    if (file.size > 2 * 1024 * 1024)
      return { success: false, error: "Ukuran file maksimal 2MB" };

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`; // Cache buster dengan Date.now()

    // Upload ke storage
    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Dapatkan URL publik
    const {
      data: { publicUrl },
    } = supabase.storage.from("profiles").getPublicUrl(fileName);

    // Update tabel profil
    await supabase
      .from("profiles")
      .update({ profile_picture: publicUrl })
      .eq("id", user.id);

    revalidatePath("/", "layout");
    return { success: true, data: publicUrl };
  } catch (error) {
    console.error("[uploadProfilePicture] Error:", error);
    return { success: false, error: "Gagal mengunggah foto profil" };
  }
}
