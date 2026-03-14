/**
 * IoT Attendance API Endpoint
 * Path: app/api/iot/scan/route.ts
 * Menerima data HTTP POST dari perangkat ESP32
 */

import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const API_SECRET = process.env.IOT_API_SECRET || "KunciRahasia123";

export async function POST(request: Request) {
  try {
    // 1. Validasi Keamanan (Hardware Auth)
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== API_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized hardware" },
        { status: 401 },
      );
    }

    // 2. Parse Data dari ESP32
    const body = await request.json();
    const { uid, status, tx_id, delta_ms } = body;

    // tx_id sekarang menjadi parameter wajib
    if (!uid || !status || !tx_id) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // 3. Pengecekan Idempotensi (Anti-Duplikasi)
    // Kita cek apakah tx_id dari ESP32 ini sudah pernah masuk ke database sebelumnya
    const { data: existingLog } = await supabaseAdmin
      .from("attendance_logs")
      .select("id")
      .eq("tx_id", tx_id)
      .single();

    if (existingLog) {
      // Jika sudah ada, ini adalah percobaan pengiriman ulang (retry) dari ESP32.
      // Kita respon 200 OK agar ESP32 menghapus item ini dari antrean LittleFS.
      return NextResponse.json({ message: "DUP_OK" }, { status: 200 });
    }

    // 4. Kalkulasi Real-Timestamp (Fitur Delta Time)
    const tapDate = new Date(Date.now() - (Number(delta_ms) || 0));

    // 5. Cari profile_id berdasarkan kartu RFID
    const { data: tagData } = await supabaseAdmin
      .from("rfid_tags")
      .select("profile_id")
      .eq("uid", uid)
      .eq("status", "active")
      .single();

    // 6. Simpan ke Database
    const { error: insertError } = await supabaseAdmin
      .from("attendance_logs")
      .insert({
        rfid_uid: uid,
        profile_id: tagData ? tagData.profile_id : null,
        status: status.toLowerCase(),
        method: "rfid_kiosk",
        scan_time: tapDate.toISOString(),
        tx_id: tx_id, // SEKARANG KITA MASUKKAN KE DATABASE!
      });

    if (insertError) {
      console.error("Database Insert Error:", insertError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // 7. Sukses tersimpan
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
