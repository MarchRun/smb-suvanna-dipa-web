/**
 * Academic Classes Server Actions
 * Path: actions/academic/classes.ts
 * Tanggung Jawab: Manajemen data kelas dan siswa di dalamnya
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Profile } from "@/types";

export interface StudentWithPoints extends Profile {
  points: number;
}

// Menggunakan helper yang sama (DRY) untuk mendapatkan konteks kelas
async function getTeacherClassContext() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Tidak terautentikasi");

  const { data: classData } = await supabase
    .from("classes")
    .select("id, name")
    .eq("teacher_id", user.id)
    .single();

  if (!classData) throw new Error("Anda tidak memiliki kelas yang aktif");

  return { supabase, user, classId: classData.id, className: classData.name };
}

export async function getClassInfo(): Promise<
  ActionResponse<{ className: string; classId: number }>
> {
  try {
    const { className, classId } = await getTeacherClassContext();
    return { success: true, data: { className, classId } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getClassMembers(
  search?: string,
): Promise<ActionResponse<StudentWithPoints[]>> {
  try {
    const { supabase, classId } = await getTeacherClassContext();

    let query = supabase
      .from("profiles")
      .select("*")
      .eq("class_id", classId)
      .eq("role", "siswa")
      .order("full_name", { ascending: true });

    if (search) query = query.ilike("full_name", `%${search}%`);

    const { data, error } = await query;
    if (error) throw error;

    return {
      success: true,
      data: (data || []).map((student) => ({
        ...student,
        points: student.points || 0,
      })),
    };
  } catch (error: any) {
    return { success: false, error: "Gagal mengambil daftar siswa", data: [] };
  }
}

export async function getClassMemberById(
  studentId: string,
): Promise<ActionResponse<Profile>> {
  try {
    const { supabase, classId } = await getTeacherClassContext();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", studentId)
      .eq("class_id", classId)
      .eq("role", "siswa")
      .single();

    if (error) throw new Error("Siswa tidak ditemukan di kelas Anda");

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * CATATAN UNTUK GARLAND:
 * Fungsi givePoints() sengaja saya hapus dari file ini.
 * Alasannya: Memberi poin adalah transaksi finansial (merubah saldo).
 * Kita akan memindahkannya ke dalam entitas `actions/rewards/transactions.ts`
 * pada langkah selanjutnya agar sesuai dengan prinsip arsitektur yang bersih.
 */
