import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const randomId = Math.random().toString(36).substring(2, 8);
const testEmail = `sayfold.library.test.${randomId}@gmail.com`;
const testPassword = `TestPass123!_${randomId}`;

async function testLibrary() {
  console.log("=== SAYFOLD MILESTONE 2: LIBRARY CRUD TEST ===");
  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Register test user
  console.log("\n1. Registering test user:", testEmail);
  const { data: auth, error: authErr } = await client.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: { data: { display_name: "Library Tester" } },
  });

  if (authErr || !auth.user) {
    console.error("User registration failed:", authErr?.message);
    process.exit(1);
  }
  const userId = auth.user.id;
  console.log("User registered! UID:", userId);

  // 2. Create Source
  console.log("\n2. Creating Book: Sapiens...");
  const { data: source, error: createSourceErr } = await client
    .from("sources")
    .insert({
      user_id: userId,
      title: "Sapiens: A Brief History of Humankind",
      source_type: "book",
      creator: "Yuval Noah Harari",
      description: "A narrative of humanity's creation and evolution.",
      status: "active",
    })
    .select()
    .single();

  if (createSourceErr || !source) {
    console.error("Create source failed:", createSourceErr);
    process.exit(1);
  }
  console.log("Source created successfully with ID:", source.id);

  // 3. Update Source
  console.log("\n3. Updating Book details...");
  const { data: updatedSource, error: updateSourceErr } = await client
    .from("sources")
    .update({
      description: "Updated description for test verification.",
    })
    .eq("id", source.id)
    .select()
    .single();

  if (updateSourceErr || updatedSource.description !== "Updated description for test verification.") {
    console.error("Update source failed:", updateSourceErr);
    process.exit(1);
  }
  console.log("Source updated successfully! New description verified.");

  // 4. Create Chapters
  console.log("\n4. Creating Chapter 1 and Chapter 2...");
  const { data: ch1, error: ch1Err } = await client
    .from("chapters")
    .insert({
      source_id: source.id,
      user_id: userId,
      title: "An Animal of No Significance",
      chapter_number: 1,
    })
    .select()
    .single();

  const { data: ch2, error: ch2Err } = await client
    .from("chapters")
    .insert({
      source_id: source.id,
      user_id: userId,
      title: "The Tree of Knowledge",
      chapter_number: 2,
    })
    .select()
    .single();

  if (ch1Err || ch2Err) {
    console.error("Chapter creation failed:", ch1Err || ch2Err);
    process.exit(1);
  }
  console.log("Chapter 1 created (ID:", ch1.id, ") and Chapter 2 created (ID:", ch2.id, ")");

  // 5. Query chapters ordered by chapter_number
  console.log("\n5. Querying chapters for source...");
  const { data: chapters, error: listChErr } = await client
    .from("chapters")
    .select("*")
    .eq("source_id", source.id)
    .order("chapter_number", { ascending: true });

  if (listChErr || chapters.length !== 2) {
    console.error("Listing chapters failed:", listChErr, "Count:", chapters?.length);
    process.exit(1);
  }
  console.log("Found 2 chapters correctly ordered:", chapters.map((c) => `Ch.${c.chapter_number} ${c.title}`).join(" | "));

  // 6. Update Chapter 1 title
  console.log("\n6. Renaming Chapter 1...");
  const { data: updatedCh1, error: updateChErr } = await client
    .from("chapters")
    .update({ title: "Renamed Chapter 1: Beginnings" })
    .eq("id", ch1.id)
    .select()
    .single();

  if (updateChErr || updatedCh1.title !== "Renamed Chapter 1: Beginnings") {
    console.error("Rename chapter failed:", updateChErr);
    process.exit(1);
  }
  console.log("Chapter 1 renamed successfully to:", updatedCh1.title);

  // 7. Delete Chapter 2
  console.log("\n7. Deleting Chapter 2...");
  const { error: delChErr } = await client
    .from("chapters")
    .delete()
    .eq("id", ch2.id);

  if (delChErr) {
    console.error("Delete chapter failed:", delChErr);
    process.exit(1);
  }

  const { data: remainingChapters } = await client
    .from("chapters")
    .select("*")
    .eq("source_id", source.id);

  if (remainingChapters.length !== 1) {
    console.error("Delete verification failed! Expected 1 chapter, got:", remainingChapters.length);
    process.exit(1);
  }
  console.log("Chapter 2 deleted successfully. 1 chapter remains.");

  // 8. Delete Source and verify Cascade Delete
  console.log("\n8. Deleting source and verifying cascade delete of chapters...");
  const { error: delSourceErr } = await client
    .from("sources")
    .delete()
    .eq("id", source.id);

  if (delSourceErr) {
    console.error("Delete source failed:", delSourceErr);
    process.exit(1);
  }

  const { data: orphanedChapters } = await client
    .from("chapters")
    .select("*")
    .eq("source_id", source.id);

  if (orphanedChapters.length !== 0) {
    console.error("Cascade delete failed! Chapters still exist:", orphanedChapters);
    process.exit(1);
  }
  console.log("Source deleted and all cascaded chapters cleanly purged!");

  console.log("\n=== ALL MILESTONE 2 LIBRARY CRUD CHECKS PASSED SUCCESSFULLY ===");
}

testLibrary().catch((err) => {
  console.error("Test failed with exception:", err);
  process.exit(1);
});

