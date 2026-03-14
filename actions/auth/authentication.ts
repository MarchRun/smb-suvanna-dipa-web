/**
 * Authentication Server Actions
 * Path: actions/auth/authentication.ts
 * Tanggung Jawab: Menangani proses masuk (login) dan keluar (logout) sistem.
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isValidEmail } from "@/lib/security/sanitize";
import { normalizeEmail } from "@/lib/utils";
import type { ActionResponse } from "@/types";

interface LoginData {
  email: string;
  password: string;
}

export async function login(
  data: LoginData,
): Promise<ActionResponse<{ role: string }>> {
  // Gunakan client standar. Tidak butuh Admin Client untuk login.
  const supabase = await createClient();

  const email = normalizeEmail(data.email);

  if (!isValidEmail(email)) {
    return { success: false, error: "Format email tidak valid" };
  }

  if (!data.password || data.password.length < 6) {
    return { success: false, error: "Password minimal 6 karakter" };
  }

  // 1. Eksekusi Login
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password: data.password,
    });

  if (authError || !authData.user) {
    return {
      success: false,
      error: "Email atau password salah. Silakan coba lagi.",
    };
  }

  // 2. Ambil Role Pengguna (Gunakan client standar karena sesi sudah terbentuk)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return {
      success: false,
      error: "Profil tidak ditemukan. Hubungi administrator.",
    };
  }

  revalidatePath("/", "layout");

  return {
    success: true,
    data: { role: profile.role },
  };
}

export async function logout(): Promise<ActionResponse> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
