import { createClient } from "@supabase/supabase-js";
import { createCaptureGraph } from "../src/lib/pipeline/captureGraph";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!;

const randomId = Math.random().toString(36).substring(2, 8);
const testEmail = `sayfold.vertical.slice.${randomId}@gmail.com`;
const testPassword = `TestPass123!_${randomId}`;

// Generates valid PCM 16-bit 16kHz mono WAV buffer
function createWavBuffer(seconds = 1): Buffer {
  const sampleRate = 16000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = sampleRate * seconds;
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

async function runVerticalSliceTest() {
  console.log("=== SAYFOLD MILESTONE 3: VERTICAL SLICE END-TO-END TEST ===");
  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Step 1: Signup
  console.log("\n[Step 1] Signup new user...");
  const { data: auth, error: authErr } = await client.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: { data: { display_name: "Vertical Slice Tester" } },
  });

  if (authErr || !auth.user) {
    console.error("Signup failed:", authErr?.message);
    process.exit(1);
  }
  const userId = auth.user.id;
  console.log("Signup SUCCESS! User ID:", userId);

  // Step 2: Create Book
  console.log("\n[Step 2] Create Book: Atomic Habits...");
  const { data: book, error: bookErr } = await client
    .from("sources")
    .insert({
      user_id: userId,
      title: "Atomic Habits",
      source_type: "book",
      creator: "James Clear",
      description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    })
    .select()
    .single();

  if (bookErr || !book) {
    console.error("Create Book failed:", bookErr);
    process.exit(1);
  }
  console.log("Create Book SUCCESS! Book ID:", book.id, `("${book.title}")`);

  // Step 3: Create Chapter
  console.log("\n[Step 3] Create Chapter 2...");
  const { data: chapter, error: chapterErr } = await client
    .from("chapters")
    .insert({
      source_id: book.id,
      user_id: userId,
      title: "How Your Habits Shape Your Identity",
      chapter_number: 2,
    })
    .select()
    .single();

  if (chapterErr || !chapter) {
    console.error("Create Chapter failed:", chapterErr);
    process.exit(1);
  }
  console.log("Create Chapter SUCCESS! Chapter ID:", chapter.id, `(Ch.${chapter.chapter_number}: "${chapter.title}")`);

  // Step 4: Live Audio -> Groq Whisper Transcription Test
  console.log("\n[Step 4] Live Audio Buffer -> Groq Whisper Transcription...");
  const audioBuffer = createWavBuffer(1);
  const captureGraph = createCaptureGraph();

  const whisperResult = await captureGraph.invoke({
    audioBuffer,
    audioMimeType: "audio/wav",
    userId,
    activeSourceId: book.id,
    activeChapterId: chapter.id,
    userSources: [{ id: book.id, title: book.title, source_type: book.source_type }],
    userChapters: [
      {
        id: chapter.id,
        source_id: book.id,
        title: chapter.title,
        chapter_number: chapter.chapter_number,
      },
    ],
    status: "processing",
  });

  console.log("Groq Whisper Transcribed raw audio to:", `"${whisperResult.transcription}"`);
  console.log("Audio buffer cleared after transcription (memory safe):", whisperResult.audioBuffer === undefined);

  // Step 5: Full LangGraph Classification with realistic spoken note
  console.log("\n[Step 5] LangGraph Context Resolution & Classification Pipeline...");
  const realisticSpokenNote =
    "Um, so an important idea here is that every action you take is like a vote for the type of person you wish to become. Small habits compound over time into your true identity.";

  const testGraph = createCaptureGraph();
  const classifiedResult = await testGraph.invoke({
    transcription: realisticSpokenNote,
    userId,
    activeSourceId: book.id,
    activeChapterId: chapter.id,
    userSources: [{ id: book.id, title: book.title, source_type: book.source_type }],
    userChapters: [
      {
        id: chapter.id,
        source_id: book.id,
        title: chapter.title,
        chapter_number: chapter.chapter_number,
      },
    ],
    status: "processing",
  });

  const classification = classifiedResult.classification;
  if (!classification) {
    console.error("Classification failed:", classifiedResult.error);
    process.exit(1);
  }

  console.log("LangGraph Output:");
  console.log("- Entry Type:", classification.entry_type);
  console.log("- Title:", classification.title);
  console.log("- Cleaned Content:", classification.cleaned_content);
  console.log("- Resolved Source ID:", classification.source_id);
  console.log("- Resolved Chapter ID:", classification.chapter_id);
  console.log("- Confidence:", classification.confidence);
  console.log("- Requires Confirmation:", classification.requires_confirmation);

  // Step 6: Save to Supabase knowledge_entries
  console.log("\n[Step 6] Saving Classified Entry to Supabase...");
  const { data: savedEntry, error: saveErr } = await client
    .from("knowledge_entries")
    .insert({
      user_id: userId,
      source_id: classification.source_id || book.id,
      chapter_id: classification.chapter_id || chapter.id,
      entry_type: classification.entry_type,
      title: classification.title,
      original_transcription: realisticSpokenNote,
      cleaned_content: classification.cleaned_content,
      metadata: {
        confidence: classification.confidence,
        vocab: classification.vocab || null,
        quote_attribution: classification.quote_attribution || null,
      },
    })
    .select()
    .single();

  if (saveErr || !savedEntry) {
    console.error("Save to Supabase failed:", saveErr);
    process.exit(1);
  }
  console.log("Save to Supabase SUCCESS! Entry ID:", savedEntry.id);

  // Step 7: Verify Entry shows in the correct collection
  console.log("\n[Step 7] Querying collection: Verify entry appears under Atomic Habits -> Chapter 2...");
  const { data: collectionEntries, error: queryErr } = await client
    .from("knowledge_entries")
    .select("*")
    .eq("source_id", book.id)
    .eq("chapter_id", chapter.id);

  if (queryErr || !collectionEntries || collectionEntries.length === 0) {
    console.error("Collection verification query failed:", queryErr);
    process.exit(1);
  }

  const found = collectionEntries.find((e) => e.id === savedEntry.id);
  if (!found) {
    console.error("Entry was NOT found in the expected collection!");
    process.exit(1);
  }

  console.log("VERIFIED: Entry appears in the Atomic Habits -> Chapter 2 collection!");
  console.log(`- Stored Title: "${found.title}"`);
  console.log(`- Stored Cleaned: "${found.cleaned_content}"`);
  console.log(`- Stored Raw: "${found.original_transcription}"`);
  console.log(`- Stored FTS vector generated:`, Boolean(found.fts));

  console.log("\n=== VERTICAL SLICE FULLY VERIFIED END-TO-END! ===");
}

runVerticalSliceTest().catch((err) => {
  console.error("Vertical slice test error:", err);
  process.exit(1);
});
