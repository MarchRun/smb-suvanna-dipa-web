/**
 * Reward Transactions Server Actions
 * Path: actions/rewards/transactions.ts
 * Tanggung Jawab: Pemberian poin (Guru), Penukaran hadiah (Siswa), Validasi pesanan (Admin)
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types";

// ==========================================
// BAGIAN 1: PEMBERIAN POIN OLEH GURU
// ==========================================

export async function givePoints(
  studentId: string,
  amount: number,
  reason: string,
): Promise<ActionResponse<{ newPoints: number }>> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Tidak terautentikasi");

    // Pastikan guru punya kelas
    const { data: classData } = await supabase
      .from("classes")
      .select("id")
      .eq("teacher_id", user.id)
      .maybeSingle();
    if (!classData) throw new Error("Akses ditolak: Anda bukan wali kelas");

    // Delegasi ke RPC (Atomic transaction)
    const { data, error: rpcError } = await supabase.rpc(
      "increment_student_points",
      {
        target_student_id: studentId,
        point_amount: amount,
        reason_text: reason,
        teacher_id: user.id,
        target_class_id: classData.id,
      },
    );

    if (rpcError) throw new Error(rpcError.message);
    return { success: true, data: { newPoints: data } };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memberikan poin" };
  }
}

// ==========================================
// BAGIAN 2: SIKLUS PENUKARAN OLEH SISWA
// ==========================================

export async function getStudentPoints(): Promise<ActionResponse<number>> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Tidak terautentikasi");

    const { data: profile } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", user.id)
      .single();
    return { success: true, data: profile?.points || 0 };
  } catch (error) {
    return { success: false, error: "Gagal mengambil data poin" };
  }
}

export async function createRedemption(
  productId: number,
): Promise<ActionResponse<{ orderId: number }>> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Tidak terautentikasi");

    // Delegasi pemotongan poin & stok ke RPC (Mencegah Spam Click / Race Condition)
    const { data: orderId, error: rpcError } = await supabase.rpc(
      "checkout_reward",
      {
        buyer_id: user.id,
        target_product_id: productId,
      },
    );

    if (rpcError) throw new Error(rpcError.message);
    return { success: true, data: { orderId } };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menukar poin" };
  }
}

export async function cancelRedemption(
  orderId: number,
): Promise<ActionResponse<void>> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Tidak terautentikasi");

    // Delegasi sistem Refund (kembalikan poin & stok) ke RPC
    const { error: rpcError } = await supabase.rpc("cancel_reward_order", {
      target_order_id: orderId,
      requesting_user_id: user.id,
    });

    if (rpcError) throw new Error(rpcError.message);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Gagal membatalkan pesanan",
    };
  }
}

export async function getStudentRedemptions(
  statusFilter?: string,
): Promise<ActionResponse<any[]>> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Tidak terautentikasi");

    let query = supabase
      .from("product_orders")
      .select(`*, product:products(name, price, image_url)`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== "all")
      query = query.eq("status", statusFilter);

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    return {
      success: false,
      error: "Gagal mengambil riwayat pesanan",
      data: [],
    };
  }
}

// ==========================================
// BAGIAN 3: VALIDASI PESANAN OLEH ADMIN
// ==========================================

export async function getPendingOrders(): Promise<ActionResponse<any[]>> {
  const supabase = await createClient(); // RLS Admin bisa SELECT semua orders
  try {
    const { data, error } = await supabase
      .from("product_orders")
      .select(
        `*, profiles!product_orders_user_id_fkey(full_name, points), products!product_orders_product_id_fkey(name, price)`,
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    return {
      success: false,
      error: "Gagal mengambil data pesanan pending",
      data: [],
    };
  }
}

export async function approveOrder(orderId: number): Promise<ActionResponse> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error: rpcError } = await supabase.rpc("approve_reward_order", {
      target_order_id: orderId,
      executor_id: user?.id,
    });

    if (rpcError) throw new Error(rpcError.message);
    revalidatePath("/admin/rewards/validation");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Gagal menyetujui pesanan",
    };
  }
}

export async function rejectOrder(orderId: number): Promise<ActionResponse> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error: rpcError } = await supabase.rpc("reject_reward_order", {
      target_order_id: orderId,
      executor_id: user?.id,
    });

    if (rpcError) throw new Error(rpcError.message);
    revalidatePath("/admin/rewards/validation");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menolak pesanan" };
  }
}
