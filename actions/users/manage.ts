/**
 * User Management Server Actions
 * Path: actions/users/manage.ts
 * Tanggung Jawab: CRUD master data pengguna oleh Admin
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import type { ActionResponse, Profile } from "@/types";

/**
 * Helper Keamanan: Memastikan eksekutor adalah Admin
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

  if (profile?.role !== "admin")
    throw new Error("Akses ditolak. Anda bukan admin.");

  return {
    // Kembalikan service client HANYA jika sudah terbukti dia admin
    adminSupabase: createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    ),
    user,
  };
}

export async function getUsers(
  filters?: any,
): Promise<ActionResponse<Profile[]>> {
  try {
    const { adminSupabase } = await verifyAdminAccess();

    let query = adminSupabase
      .from("profiles")
      .select("*")
      .order("full_name", { ascending: true });

    if (filters?.role && filters.role !== "all")
      query = query.eq("role", filters.role);
    if (filters?.search)
      query = query.ilike("full_name", `%${filters.search}%`);
    if (filters?.classId) query = query.eq("class_id", filters.classId);

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    return { success: false, error: "Gagal mengambil data pengguna", data: [] };
  }
}

export async function getUserById(
  id: string,
): Promise<ActionResponse<Profile>> {
  try {
    const { adminSupabase } = await verifyAdminAccess();

    const { data, error } = await adminSupabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Pengguna tidak ditemukan" };
  }
}

export async function createUser(data: any): Promise<ActionResponse<Profile>> {
  try {
    const { adminSupabase } = await verifyAdminAccess();

    // 1. Buat Autentikasi User (di auth.users)
    const { data: authData, error: authError } =
      await adminSupabase.auth.admin.createUser({
        email: data.email,
        password: data.password || "password123", // Default password
        email_confirm: true,
      });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Gagal membuat user auth");

    // 2. Buat Profil
    const { data: profile, error: profileError } = await adminSupabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        phone: data.phone || null,
        class_id: data.class_id || null,
      })
      .select()
      .single();

    if (profileError) {
      // Rollback jika profil gagal dibuat
      await adminSupabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    revalidatePath("/admin/users");
    return { success: true, data: profile };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Gagal menambah pengguna",
    };
  }
}

export async function updateUser(
  id: string,
  data: any,
): Promise<ActionResponse<Profile>> {
  try {
    const { adminSupabase } = await verifyAdminAccess();

    const { data: profile, error } = await adminSupabase
      .from("profiles")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/users");
    return { success: true, data: profile };
  } catch (error) {
    return { success: false, error: "Gagal mengubah pengguna" };
  }
}

export async function deleteUser(id: string): Promise<ActionResponse> {
  try {
    const { adminSupabase } = await verifyAdminAccess();

    // Menghapus user dari auth.users otomatis akan menghapus profilnya
    // karena ada ON DELETE CASCADE di database (jika diatur dengan benar)
    const { error } = await adminSupabase.auth.admin.deleteUser(id);

    if (error) throw error;

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus pengguna" };
  }
}
