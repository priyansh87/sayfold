import { Annotation, StateGraph, END, START } from "@langchain/langgraph";
import Groq from "groq-sdk";
import { z } from "zod";
import { AI_MODELS } from "@/lib/config/models";
import type { EntryType } from "@/types/database";

export const ClassificationSchema = z.object({
  entry_type: z.enum(["Idea", "Vocab", "Quote", "Question", "Note"]),
  title: z.string().min(1).max(120),
  cleaned_content: z.string().min(1),
  source_id: z.string().nullable().optional(),
  chapter_id: z.string().nullable().optional(),
  quote_attribution: z.string().nullable().optional(),
  vocab: z
    .object({
      word: z.string(),
      meaning: z.string(),
      example: z.string().optional(),
    })
    .nullable()
    .optional(),
  confidence: z.number().min(0).max(1),
  requires_confirmation: z.boolean(),
  confirmation_reason: z.string().nullable().optional(),
});

export type ClassificationResult = z.infer<typeof ClassificationSchema>;

export const CaptureAnnotation = Annotation.Root({
  audioBuffer: Annotation<Buffer | undefined>,
  audioMimeType: Annotation<string | undefined>,
  userId: Annotation<string>,
  activeSourceId: Annotation<string | null | undefined>,
  activeChapterId: Annotation<string | null | undefined>,
  userSources: Annotation<Array<{ id: string; title: string; source_type: string }>>,
  userChapters: Annotation<
    Array<{ id: string; source_id: string; title: string; chapter_number: number }>
  >,
  transcription: Annotation<string | undefined>,
  classification: Annotation<ClassificationResult | undefined>,
  status: Annotation<"processing" | "awaiting_confirmation" | "saved" | "failed">,
  error: Annotation<string | null | undefined>,
  savedEntry: Annotation<any>,
});

export type CaptureState = typeof CaptureAnnotation.State;

// Node 1: Validate Audio
async function validateAudio(state: CaptureState): Promise<Partial<CaptureState>> {
  // If transcription is already provided, skip audio check
  if (state.transcription) {
    return { status: "processing" };
  }

  if (!state.audioBuffer || state.audioBuffer.length === 0) {
    return {
      status: "failed",
      error: "No audio data received. Recording was empty.",
    };
  }

  // Max 25MB size limit
  const maxBytes = 25 * 1024 * 1024;
  if (state.audioBuffer.length > maxBytes) {
    return {
      status: "failed",
      error: "Audio size exceeds 25MB limit.",
    };
  }

  return { status: "processing" };
}

// Node 2: Groq Whisper Transcription
async function transcribeAudio(state: CaptureState): Promise<Partial<CaptureState>> {
  if (state.status === "failed") return {};
  if (state.transcription) {
    return {};
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { status: "failed", error: "GROQ_API_KEY is not configured on server." };
  }

  try {
    const groq = new Groq({ apiKey });
    const mime = state.audioMimeType || "audio/webm";
    const extension = mime.includes("wav")
      ? "wav"
      : mime.includes("mp4") || mime.includes("m4a")
      ? "m4a"
      : mime.includes("ogg")
      ? "ogg"
      : "webm";

    // Convert Buffer to Uint8Array for BlobPart compatibility
    const uint8Array = new Uint8Array(state.audioBuffer!);
    const audioFile = new File([uint8Array], `capture.${extension}`, {
      type: mime,
    });

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: AI_MODELS.TRANSCRIPTION,
      language: "en",
    });

    const text = transcription.text?.trim();
    if (!text) {
      return {
        status: "failed",
        error: "Whisper did not detect any speech in the recording.",
      };
    }

    return {
      transcription: text,
      // Audio buffer is completely cleared from memory now — zero permanent storage!
      audioBuffer: undefined,
    };
  } catch (err: any) {
    return {
      status: "failed",
      error: `Transcription error: ${err.message || "Failed to transcribe audio"}`,
      audioBuffer: undefined,
    };
  }
}

// Node 3: Resolve Context & Classify with Groq LLM
async function resolveAndClassify(state: CaptureState): Promise<Partial<CaptureState>> {
  if (state.status === "failed" || !state.transcription) return {};

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { status: "failed", error: "GROQ_API_KEY is missing." };
  }

  const groq = new Groq({ apiKey });

  const activeSource = state.userSources.find((s) => s.id === state.activeSourceId);
  const activeChapter = state.userChapters.find((c) => c.id === state.activeChapterId);

  const sourcesContextStr =
    state.userSources.length > 0
      ? state.userSources
          .map((s) => `- ID: "${s.id}", Title: "${s.title}" (${s.source_type})`)
          .join("\n")
      : "No cataloged sources.";

  const chaptersContextStr =
    state.userChapters.length > 0
      ? state.userChapters
          .map(
            (c) =>
              `- ID: "${c.id}", SourceID: "${c.source_id}", Ch.${c.chapter_number}: "${c.title}"`
          )
          .join("\n")
      : "No cataloged chapters.";

  const systemPrompt = `You are Sayfold's intelligent knowledge extraction agent.
Your mission: Analyze a user's spoken voice note captured while reading/studying, clean it, categorize it, and accurately resolve its source and chapter context.

### Classification Categories:
- "Idea": A realization, concept, or takeaway.
- "Vocab": A new or notable word the user encountered. Must extract the word, its meaning, and an example.
- "Quote": An exact or near-exact quote. Keep exact wording. Attribution ONLY if stated by user (NEVER invent author/speaker).
- "Question": An open query, wonder, or dilemma raised.
- "Note": General observation, commentary, or summary.

### Context Resolution Rules (STRICT):
1. The user may currently be viewing an active source/chapter:
   - Current Active Source: ${activeSource ? `"${activeSource.title}" (ID: ${activeSource.id})` : "None"}
   - Current Active Chapter: ${activeChapter ? `"${activeChapter.title}" (ID: ${activeChapter.id})` : "None"}
2. Default context is the active source & chapter.
3. If the user explicitly mentions another book or chapter by name in their speech (e.g. "In Sapiens chapter 2..."), check if it matches one of the user's cataloged sources/chapters below.
4. User's Existing Sources:
${sourcesContextStr}
5. User's Existing Chapters:
${chaptersContextStr}
6. NEVER INVENT, HALLUCINATE, OR CREATE A SOURCE OR CHAPTER ID that does not exist in the lists above. If the speech mentions an uncataloged book, set source_id and chapter_id to null and set requires_confirmation: true.

### Content Cleaning Rules:
1. Clean disfluencies (stutters, "um", "uh", "like", repeated words).
2. Fix minor punctuation and grammar for readability.
3. NEVER change the user's core meaning or intent.
4. Formulate a brief, elegant title (3-6 words).

### Output Schema (JSON only):
Return a JSON object conforming strictly to:
{
  "entry_type": "Idea" | "Vocab" | "Quote" | "Question" | "Note",
  "title": "Concise 3-6 word title",
  "cleaned_content": "Pristine cleaned note text",
  "source_id": "UUID from sources list or null",
  "chapter_id": "UUID from chapters list or null",
  "quote_attribution": "Spoken speaker/author or null",
  "vocab": { "word": "word", "meaning": "definition", "example": "sentence" } or null,
  "confidence": number between 0.0 and 1.0,
  "requires_confirmation": boolean,
  "confirmation_reason": "Explanation if confidence < 0.7 or context is ambiguous, else null"
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: AI_MODELS.CLASSIFICATION,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Spoken note transcription:\n"${state.transcription}"`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const rawJson = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(rawJson);
    const validated = ClassificationSchema.parse(parsed);

    // Confidence guardrail:
    const requiresConfirmation =
      validated.requires_confirmation ||
      validated.confidence < 0.7 ||
      (validated.entry_type === "Vocab" && !validated.vocab?.word);

    return {
      classification: {
        ...validated,
        requires_confirmation: requiresConfirmation,
      },
      status: requiresConfirmation ? "awaiting_confirmation" : "processing",
    };
  } catch (err: any) {
    // Retry once with fallback fast model if first model had issue
    try {
      const fallbackCompletion = await groq.chat.completions.create({
        model: AI_MODELS.CLASSIFICATION_FAST,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Spoken note transcription:\n"${state.transcription}"`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const rawJson = fallbackCompletion.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(rawJson);
      const validated = ClassificationSchema.parse(parsed);
      return {
        classification: validated,
        status: validated.requires_confirmation ? "awaiting_confirmation" : "processing",
      };
    } catch (fallbackErr: any) {
      return {
        status: "failed",
        error: `Classification error: ${err.message || fallbackErr.message}`,
      };
    }
  }
}

// Build LangGraph Pipeline
export function createCaptureGraph() {
  const workflow = new StateGraph(CaptureAnnotation)
    .addNode("validate_audio", validateAudio)
    .addNode("transcribe_audio", transcribeAudio)
    .addNode("resolve_and_classify", resolveAndClassify)
    .addEdge(START, "validate_audio")
    .addEdge("validate_audio", "transcribe_audio")
    .addEdge("transcribe_audio", "resolve_and_classify")
    .addEdge("resolve_and_classify", END);

  return workflow.compile();
}
