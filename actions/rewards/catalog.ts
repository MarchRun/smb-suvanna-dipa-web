/**
 * Reward Catalog Server Actions
 * Path: actions/rewards/catalog.ts
 * Tanggung Jawab: Manajemen master data hadiah (Katalog Produk)
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResponse, Product } from "@/types";

/**
 * Helper Keamanan: Validasi Admin
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
  return { supabase, user };
}

/**
 * [PUBLIC/AUTH] Mengambil daftar hadiah (Digunakan Admin & Siswa)
 */
export async function getProducts(
  filters?: any,
  sort?: any,
): Promise<ActionResponse<Product[]>> {
  const supabase = await createClient();
  try {
    let query = supabase.from("products").select("*");

    if (filters?.search) query = query.ilike("name", `%${filters.search}%`);
    if (filters?.stockStatus === "in-stock") query = query.gt("stock", 0);
    else if (filters?.stockStatus === "out-of-stock")
      query = query.eq("stock", 0);

    if (sort)
      query = query.order(sort.field, { ascending: sort.direction === "asc" });
    else query = query.order("name", { ascending: true });

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    return {
      success: false,
      error: "Gagal mengambil katalog hadiah",
      data: [],
    };
  }
}

/**
 * [PUBLIC/AUTH] Mengambil satu produk
 */
export async function getProductById(
  id: number,
): Promise<ActionResponse<Product | null>> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error("Hadiah tidak ditemukan");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message, data: null };
  }
}

/**
 * [ADMIN] Tambah Hadiah Baru
 */
export async function createProduct(
  data: any,
): Promise<ActionResponse<Product>> {
  try {
    const { supabase } = await verifyAdminAccess();
    if (!data.name?.trim())
      return { success: false, error: "Nama wajib diisi" };
    if (data.price < 0 || data.stock < 0)
      return { success: false, error: "Harga dan stok tidak boleh negatif" };

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name: data.name.trim(),
        price: data.price,
        stock: data.stock,
        image_url: data.image_url || null,
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/admin/rewards");
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menambah hadiah" };
  }
}

/**
 * [ADMIN] Update Hadiah
 */
export async function updateProduct(
  id: number,
  data: any,
): Promise<ActionResponse<Product>> {
  try {
    const { supabase } = await verifyAdminAccess();
    const { data: product, error } = await supabase
      .from("products")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/admin/rewards");
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal mengubah hadiah" };
  }
}

/**
 * [ADMIN] Hapus Hadiah (Dengan perlindungan Foreign Key)
 */
export async function deleteProduct(id: number): Promise<ActionResponse> {
  try {
    const { supabase } = await verifyAdminAccess();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      if (error.code === "23503")
        return {
          success: false,
          error:
            "Hadiah ini sudah pernah ditukar oleh siswa. Anda hanya bisa mengubah stoknya menjadi 0.",
        };
      throw error;
    }

    revalidatePath("/admin/rewards");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menghapus hadiah" };
  }
}
