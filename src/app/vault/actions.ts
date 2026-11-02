"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { EntryType } from "@/types/database";

export async function updateEntry(
  entryId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const title = (formData.get("title") as string)?.trim() || null;
  const cleanedContent = (formData.get("cleaned_content") as string)?.trim();
  const entryType = formData.get("entry_type") as EntryType;
  const sourceId = (formData.get("source_id") as string) || null;
  const chapterId = (formData.get("chapter_id") as string) || null;

  if (!cleanedContent) {
    return { error: "Content is required." };
  }

  const { error } = await supabase
    .from("knowledge_entries")
    .update({
      title,
      cleaned_content: cleanedContent,
      entry_type: entryType,
      source_id: sourceId,
      chapter_id: chapterId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", entryId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/vault");
  revalidatePath("/library");
  return { success: true };
}

export async function deleteEntry(entryId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("knowledge_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/vault");
  revalidatePath("/library");
  return { success: true };
}

export async function toggleFavourite(entryId: string, currentStatus: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("knowledge_entries")
    .update({
      is_favourite: !currentStatus,
    })
    .eq("id", entryId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/vault");
  return { success: true, is_favourite: !currentStatus };
}
