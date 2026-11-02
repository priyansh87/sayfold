import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const ConfirmSchema = z.object({
  entry_type: z.enum(["Idea", "Vocab", "Quote", "Question", "Note"]),
  title: z.string().min(1),
  original_transcription: z.string().min(1),
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
  tags: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = ConfirmSchema.parse(body);

    const { data: savedEntry, error: insertError } = await supabase
      .from("knowledge_entries")
      .insert({
        user_id: user.id,
        source_id: validated.source_id || null,
        chapter_id: validated.chapter_id || null,
        entry_type: validated.entry_type,
        title: validated.title,
        original_transcription: validated.original_transcription,
        cleaned_content: validated.cleaned_content,
        tags: validated.tags || [],
        metadata: {
          quote_attribution: validated.quote_attribution || null,
          vocab: validated.vocab || null,
          user_confirmed: true,
        },
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: `Failed to save entry: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "saved",
      entry: savedEntry,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to confirm entry" },
      { status: 400 }
    );
  }
}
