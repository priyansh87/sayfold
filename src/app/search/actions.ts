"use server";

import { createClient } from "@/lib/supabase/server";
import { answerFromVault, type EntryReference, type AskMemoryResponse } from "@/lib/server/askMemory";

export async function askMemoryAction(query: string): Promise<AskMemoryResponse & { error?: string }> {
  const trimmed = query?.trim();
  if (!trimmed) {
    return {
      answer: "Please enter a question to ask your vault.",
      references: [],
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      answer: "Please sign in to access your vault.",
      references: [],
      error: "Not authenticated",
    };
  }

  try {
    // 1. First attempt: Postgres Full-Text Search via fts column
    let matchedEntries: any[] = [];

    // Clean query words for tsquery format (e.g. 'habit & stacking')
    const tsQuery = trimmed
      .replace(/[^\w\s]/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .join(" & ");

    if (tsQuery) {
      const { data: ftsData, error: ftsErr } = await supabase
        .from("knowledge_entries")
        .select(`
          id,
          title,
          cleaned_content,
          entry_type,
          sources:source_id (title),
          chapters:chapter_id (title, chapter_number)
        `)
        .eq("user_id", user.id)
        .textSearch("fts", tsQuery)
        .limit(6);

      if (!ftsErr && ftsData && ftsData.length > 0) {
        matchedEntries = ftsData;
      }
    }

    // 2. Fallback attempt: ILIKE substring search if FTS had 0 matches
    if (matchedEntries.length === 0) {
      const { data: ilikeData } = await supabase
        .from("knowledge_entries")
        .select(`
          id,
          title,
          cleaned_content,
          entry_type,
          sources:source_id (title),
          chapters:chapter_id (title, chapter_number)
        `)
        .eq("user_id", user.id)
        .or(`title.ilike.%${trimmed}%,cleaned_content.ilike.%${trimmed}%`)
        .limit(6);

      if (ilikeData && ilikeData.length > 0) {
        matchedEntries = ilikeData;
      }
    }

    // Map matched entries to clean EntryReference structure
    const references: EntryReference[] = matchedEntries.map((e: any) => ({
      id: e.id,
      title: e.title,
      cleaned_content: e.cleaned_content,
      entry_type: e.entry_type,
      source_title: e.sources?.title || null,
      chapter_title: e.chapters?.title
        ? `Ch.${e.chapters.chapter_number}: ${e.chapters.title}`
        : null,
    }));

    // 3. Groq answer grounded strictly in user's vault entries
    const response = await answerFromVault(trimmed, references);
    return response;
  } catch (err: any) {
    console.error("Ask My Memory Error:", err);
    return {
      answer: "An error occurred while querying your vault memory.",
      references: [],
      error: err.message,
    };
  }
}
