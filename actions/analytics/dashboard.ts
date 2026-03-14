/**
 * Dashboard Statistics Actions
 * Path: actions/analytics/dashboard.ts
 * Tanggung Jawab: Menyediakan data statistik untuk Dashboard Admin, Guru, dan Siswa
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/types";

// Menggabungkan interface
export interface DashboardStats {
  totalSiswa?: number;
  totalKelas?: number;
  totalPembina?: number;
  className?: string | null;
  teacherName?: string | null;
  studentCount?: number;
}

export async function getDashboardStats(): Promise<
  ActionResponse<DashboardStats>
> {
  const supabase = await createClient();

  try {
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
    if (!profile) throw new Error("Profil tidak ditemukan");

    const stats: DashboardStats = {};

    // 1. Logika untuk ADMIN
    if (profile.role === "admin") {
      const [{ count: siswa }, { count: pembina }, { count: kelas }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "siswa"),
          supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "pembina"),
          supabase.from("classes").select("*", { count: "exact", head: true }),
        ]);
      stats.totalSiswa = siswa || 0;
      stats.totalPembina = pembina || 0;
      stats.totalKelas = kelas || 0;
    }

    // 2. Logika untuk GURU
    else if (profile.role === "guru") {
      const { data: classData } = await supabase
        .from("classes")
        .select("id, name")
        .eq("teacher_id", user.id)
        .maybeSingle();
      if (classData) {
        stats.className = classData.name;
        const { count } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("class_id", classData.id)
          .eq("role", "siswa");
        stats.studentCount = count || 0;
      } else {
        stats.className = null;
        stats.studentCount = 0;
      }
    }

    // 3. Logika untuk SISWA
    else if (profile.role === "siswa") {
      if (profile.class_id) {
        // RLS sudah mengizinkan siswa membaca data kelasnya
        const { data: classData } = await supabase
          .from("classes")
          .select("name, teacher_id")
          .eq("id", profile.class_id)
          .single();
        if (classData) {
          stats.className = classData.name;
          if (classData.teacher_id) {
            const { data: teacher } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", classData.teacher_id)
              .single();
            stats.teacherName = teacher?.full_name || null;
          }
        }
      } else {
        stats.className = null;
        stats.teacherName = null;
      }
    }

    return { success: true, data: stats };
  } catch (error: any) {
    return { success: false, error: error.message, data: {} };
  }
}
