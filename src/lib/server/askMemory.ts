import Groq from "groq-sdk";
import { AI_MODELS } from "@/lib/config/models";

export interface EntryReference {
  id: string;
  title: string | null;
  cleaned_content: string;
  entry_type: string;
  source_title?: string | null;
  chapter_title?: string | null;
}

export interface AskMemoryResponse {
  answer: string;
  references: EntryReference[];
}

export async function answerFromVault(
  query: string,
  entries: EntryReference[]
): Promise<AskMemoryResponse> {
  // Guardrail: If no entries retrieved from user's vault, respond with PRD exact phrase
  if (!entries || entries.length === 0) {
    return {
      answer: "vault me nahi mila. I could not find anything matching your query in your saved entries.",
      references: [],
    };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const groq = new Groq({ apiKey });

  const contextText = entries
    .map(
      (entry, idx) =>
        `[Entry ${idx + 1}] (${entry.entry_type}) ${entry.title ? `Title: "${entry.title}"` : ""}\nSource: ${entry.source_title || "Unassigned"}${entry.chapter_title ? ` · ${entry.chapter_title}` : ""}\nContent: "${entry.cleaned_content}"`
    )
    .join("\n\n");

  const systemPrompt = `You are Sayfold's Ask My Memory intelligence.
Your task is to answer the user's question using ONLY the provided knowledge entries from their personal vault.

STRICT GROUNDING RULES:
1. Base your answer exclusively on the provided vault entries below.
2. DO NOT hallucinate, fabricate, or incorporate external facts not present in these entries.
3. Reference each source entry using [1], [2], etc., matching the entries provided.
4. If the provided entries do not contain the answer, say "vault me nahi mila" and explain that it's not documented in their vault.
5. Keep your tone calm, concise, editorial, and elegant.`;

  const completion = await groq.chat.completions.create({
    model: AI_MODELS.ASK_MEMORY,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Relevant Vault Entries:\n${contextText}\n\nUser Question:\n"${query}"`,
      },
    ],
    temperature: 0.1,
  });

  const answer =
    completion.choices[0]?.message?.content?.trim() ||
    "vault me nahi mila. I could not formulate an answer from your current vault notes.";

  return {
    answer,
    references: entries,
  };
}

