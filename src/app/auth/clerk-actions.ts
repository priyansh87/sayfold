"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ClerkUserSyncPayload {
  id: string;
  email: string;
  name?: string | null;
}

function deriveDeterministicPassword(clerkUserId: string): string {
  const secret = process.env.CLERK_SECRET_KEY || "sayfold-clerk-salt";
  return crypto.createHmac("sha256", secret).update(clerkUserId).digest("hex");
}

export async function syncClerkUserToSupabase(payload: ClerkUserSyncPayload) {
  const { id, email, name } = payload;

  if (!id || !email) {
    return { error: "Missing required user identity." };
  }

  const supabase = await createClient();
  const password = deriveDeterministicPassword(id);

  // 1. Attempt to sign in to Supabase with the deterministic password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!signInError) {
    revalidatePath("/", "layout");
    return { success: true, isNewUser: false };
  }

  // 2. If sign-in failed, register the new user in Supabase
  const displayName = name?.trim() || email.split("@")[0];
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (signUpError) {
    // If the email is already registered with a traditional password:
    if (signUpError.message.toLowerCase().includes("already registered")) {
      return {
        error:
          "An account with this email already exists using traditional email & password. Please sign in with your password below.",
      };
    }
    return { error: signUpError.message };
  }

  revalidatePath("/", "layout");
  return { success: true, isNewUser: true };
}

