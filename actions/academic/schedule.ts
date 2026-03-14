/**
 * Academic Schedule Server Actions
 * Path: actions/academic/schedule.ts
 * Tanggung Jawab: Manajemen jadwal kegiatan kelas (Digunakan oleh Guru & Siswa)
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Schedule } from "@/types";

/**
 * Helper internal: Mendapatkan class_id user yang sedang login (Guru atau Siswa)
 */
async function getUserClassContext() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Tidak terautentikasi");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, class_id")
    .eq("id", user.id)
    .single();

  let classId = profile?.class_id;

  // Jika guru, cek apakah dia ditugaskan sebagai wali kelas di tabel 'classes'
  if (profile?.role === "guru") {
    const { data: classData } = await supabase
      .from("classes")
      .select("id")
      .eq("teacher_id", user.id)
      .maybeSingle();
    if (classData) classId = classData.id;
  }

  if (!classId) throw new Error("Anda tidak memiliki kelas yang aktif");

  return { supabase, user, role: profile?.role, classId };
}

export async function getSchedules(
  month?: number,
  year?: number,
): Promise<ActionResponse<Schedule[]>> {
  try {
    const { supabase, classId } = await getUserClassContext();

    let query = supabase
      .from("schedule")
      .select("*")
      .eq("class_id", classId)
      .order("event_date", { ascending: true });

    if (month !== undefined && year !== undefined) {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();
      query = query.gte("event_date", startDate).lte("event_date", endDate);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    return { success: false, error: "Gagal mengambil data jadwal", data: [] };
  }
}

export async function getScheduleById(
  scheduleId: number,
): Promise<ActionResponse<Schedule>> {
  try {
    const { supabase, classId } = await getUserClassContext();

    const { data, error } = await supabase
      .from("schedule")
      .select("*")
      .eq("id", scheduleId)
      .eq("class_id", classId)
      .single();

    if (error) throw new Error("Jadwal tidak ditemukan");

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createSchedule(data: {
  name: string;
  event_date: string;
  description?: string;
}): Promise<ActionResponse<Schedule>> {
  try {
    const { supabase, user, role, classId } = await getUserClassContext();
    if (role !== "guru" && role !== "admin") throw new Error("Akses ditolak");

    const { data: newSchedule, error } = await supabase
      .from("schedule")
      .insert({ ...data, class_id: classId, created_by: user.id })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: newSchedule };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal membuat jadwal" };
  }
}

export async function updateSchedule(
  scheduleId: number,
  data: any,
): Promise<ActionResponse<Schedule>> {
  try {
    const { supabase, role, classId } = await getUserClassContext();
    if (role !== "guru" && role !== "admin") throw new Error("Akses ditolak");

    const { data: updated, error } = await supabase
      .from("schedule")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", scheduleId)
      .eq("class_id", classId) // Validasi agar guru tidak mengedit jadwal kelas lain
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal mengubah jadwal" };
  }
}

export async function deleteSchedule(
  scheduleId: number,
): Promise<ActionResponse<void>> {
  try {
    const { supabase, role, classId } = await getUserClassContext();
    if (role !== "guru" && role !== "admin") throw new Error("Akses ditolak");

    const { error } = await supabase
      .from("schedule")
      .delete()
      .eq("id", scheduleId)
      .eq("class_id", classId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menghapus jadwal" };
  }
}
