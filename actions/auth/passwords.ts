/**
 * Password Management Server Actions
 * Path: actions/auth/passwords.ts
 * Tanggung Jawab: Mengelola aliran lupa password dan reset password via Resend.
 */

"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, generatePasswordResetEmail } from "@/lib/email/resend";
import { randomUUID } from "crypto";
import type { ActionResponse } from "@/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const TOKEN_EXPIRY_HOURS = 1;

export async function requestPasswordReset(
  email: string,
): Promise<ActionResponse> {
  // Gunakan Admin API karena user belum login dan kita perlu mencari data di auth.users
  const adminClient = createAdminClient();
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const { data: authData, error: authError } =
      await adminClient.auth.admin.listUsers();
    if (authError) return { success: true }; // Return success untuk mencegah Email Enumeration

    const user = authData.users.find(
      (u) => u.email?.toLowerCase() === normalizedEmail,
    );
    if (!user) return { success: true };

    // Siapkan Token
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS);

    // Nonaktifkan token lama (Clean Code: Rantai await)
    await adminClient
      .from("password_reset_tokens")
      .update({ used: true })
      .eq("user_id", user.id)
      .eq("used", false);

    // Simpan token baru
    const { error: tokenError } = await adminClient
      .from("password_reset_tokens")
      .insert({
        user_id: user.id,
        email: user.email,
        token: token,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) return { success: true };

    // Kirim Email
    const resetLink = `${APP_URL}/reset-password?token=${token}`;
    const userName =
      user.user_metadata?.name || user.user_metadata?.full_name || "Pengguna";

    await sendEmail({
      to: user.email!,
      subject: "Reset Password - SMB Suvanna Dipa",
      html: generatePasswordResetEmail(resetLink, userName),
    });

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: true };
  }
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<ActionResponse> {
  const adminClient = createAdminClient();

  try {
    const { data: tokenData, error: tokenError } = await adminClient
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .single();

    if (tokenError || !tokenData) {
      return {
        success: false,
        error: "Link reset password tidak valid atau sudah kadaluarsa",
      };
    }

    if (new Date() > new Date(tokenData.expires_at)) {
      await markTokenAsUsed(adminClient, tokenData.id);
      return {
        success: false,
        error: "Link sudah kadaluarsa. Silakan minta link baru.",
      };
    }

    const { error: updateError } = await adminClient.auth.admin.updateUserById(
      tokenData.user_id,
      { password: newPassword },
    );

    if (updateError) {
      return {
        success: false,
        error: "Gagal mengubah password. Silakan coba lagi.",
      };
    }

    await markTokenAsUsed(adminClient, tokenData.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Terjadi kesalahan sistem. Silakan coba lagi.",
    };
  }
}

export async function validateResetToken(
  token: string,
): Promise<ActionResponse<{ valid: boolean; email?: string }>> {
  const adminClient = createAdminClient();

  try {
    const { data: tokenData, error } = await adminClient
      .from("password_reset_tokens")
      .select("email, expires_at, used")
      .eq("token", token)
      .single();

    if (error || !tokenData) return { success: true, data: { valid: false } };

    const isValid =
      !tokenData.used && new Date() < new Date(tokenData.expires_at);
    return {
      success: true,
      data: { valid: isValid, email: isValid ? tokenData.email : undefined },
    };
  } catch (error) {
    return { success: true, data: { valid: false } };
  }
}

// Helper Internal untuk DRY (Don't Repeat Yourself)
async function markTokenAsUsed(adminClient: any, tokenId: string) {
  return adminClient
    .from("password_reset_tokens")
    .update({ used: true })
    .eq("id", tokenId);
}
