import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCaptureGraph } from "@/lib/pipeline/captureGraph";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob | null;
    const activeSourceId = (formData.get("source_id") as string) || null;
    const activeChapterId = (formData.get("chapter_id") as string) || null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio recording file is required." },
        { status: 400 }
      );
    }

    const audioArrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(audioArrayBuffer);
    const mimeType = audioFile.type || "audio/webm";

    // Fetch user sources and chapters for context resolution
    const { data: rawSources } = await supabase
      .from("sources")
      .select("id, title, source_type")
      .eq("user_id", user.id);

    const { data: rawChapters } = await supabase
      .from("chapters")
      .select("id, source_id, title, chapter_number")
      .eq("user_id", user.id);

    const userSources = (rawSources || []).map((s: any) => ({
      id: String(s.id),
      title: String(s.title),
      source_type: String(s.source_type),
    }));

    const userChapters = (rawChapters || []).map((c: any) => ({
      id: String(c.id),
      source_id: String(c.source_id),
      title: String(c.title),
      chapter_number: Number(c.chapter_number) || 1,
    }));

    // Run LangGraph Capture Pipeline
    const captureGraph = createCaptureGraph();
    const result = await captureGraph.invoke({
      audioBuffer,
      audioMimeType: mimeType,
      userId: user.id,
      activeSourceId,
      activeChapterId,
      userSources,
      userChapters,
      status: "processing",
    });

    if (result.status === "failed") {
      return NextResponse.json(
        { error: result.error || "Capture pipeline failed." },
        { status: 400 }
      );
    }

    const classification = result.classification!;
    const transcription = result.transcription!;

    // If confirmation is required, return classified data for user review
    if (classification.requires_confirmation) {
      return NextResponse.json({
        status: "awaiting_confirmation",
        transcription,
        classification,
      });
    }

    // High confidence: save directly to Supabase
    const { data: savedEntry, error: insertError } = await supabase
      .from("knowledge_entries")
      .insert({
        user_id: user.id,
        source_id: classification.source_id || activeSourceId || null,
        chapter_id: classification.chapter_id || activeChapterId || null,
        entry_type: classification.entry_type,
        title: classification.title,
        original_transcription: transcription,
        cleaned_content: classification.cleaned_content,
        metadata: {
          confidence: classification.confidence,
          quote_attribution: classification.quote_attribution || null,
          vocab: classification.vocab || null,
        },
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: `Database save failed: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "saved",
      transcription,
      classification,
      entry: savedEntry,
    });
  } catch (err: any) {
    console.error("Capture API Error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during capture." },
      { status: 500 }
    );
  }
}
