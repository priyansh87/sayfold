"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SourceType } from "@/types/database";

export async function createSource(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const title = (formData.get("title") as string)?.trim();
  const sourceType = (formData.get("source_type") as SourceType) || "book";
  const creator = (formData.get("creator") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  if (!title) {
    return { error: "Title is required" };
  }

  const { data, error } = await supabase
    .from("sources")
    .insert({
      user_id: user.id,
      title,
      source_type: sourceType,
      creator,
      description,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/library");
  return { success: true, source: data };
}

export async function updateSource(
  sourceId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const title = (formData.get("title") as string)?.trim();
  const sourceType = formData.get("source_type") as SourceType;
  const creator = (formData.get("creator") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  if (!title) {
    return { error: "Title is required" };
  }

  const { error } = await supabase
    .from("sources")
    .update({
      title,
      source_type: sourceType,
      creator,
      description,
    })
    .eq("id", sourceId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/library");
  revalidatePath(`/library/${sourceId}`);
  return { success: true };
}

export async function deleteSource(sourceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("sources")
    .delete()
    .eq("id", sourceId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/library");
  return { success: true };
}

export async function createChapter(sourceId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const title = (formData.get("title") as string)?.trim();
  const chapterNumberStr = formData.get("chapter_number") as string;
  const chapterNumber = chapterNumberStr ? parseInt(chapterNumberStr, 10) : 1;

  if (!title) {
    return { error: "Chapter title is required" };
  }

  const { data, error } = await supabase
    .from("chapters")
    .insert({
      source_id: sourceId,
      user_id: user.id,
      title,
      chapter_number: isNaN(chapterNumber) ? 1 : chapterNumber,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/library/${sourceId}`);
  return { success: true, chapter: data };
}

export async function updateChapter(
  chapterId: string,
  sourceId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const title = (formData.get("title") as string)?.trim();
  const chapterNumberStr = formData.get("chapter_number") as string;

  if (!title) {
    return { error: "Chapter title is required" };
  }

  const updatePayload: { title: string; chapter_number?: number } = { title };
  if (chapterNumberStr) {
    const num = parseInt(chapterNumberStr, 10);
    if (!isNaN(num)) updatePayload.chapter_number = num;
  }

  const { error } = await supabase
    .from("chapters")
    .update(updatePayload)
    .eq("id", chapterId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/library/${sourceId}`);
  return { success: true };
}

export async function deleteChapter(chapterId: string, sourceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("chapters")
    .delete()
    .eq("id", chapterId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/library/${sourceId}`);
  return { success: true };
}
