import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !anonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const randomId = Math.random().toString(36).substring(2, 8);
const userAEmail = `sayfold.tester.a.${randomId}@gmail.com`;
const userBEmail = `sayfold.tester.b.${randomId}@gmail.com`;
const testPassword = `TestPass123!_${randomId}`;

async function runRlsVerification() {
  console.log("=== SAYFOLD RLS VERIFICATION TEST ===");
  console.log(`Connecting to: ${url}`);
  console.log(`User A: ${userAEmail}`);
  console.log(`User B: ${userBEmail}`);

  // Create isolated Supabase clients for User A and User B
  const clientA = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const clientB = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Step 1: Sign up User A
  console.log("\n1. Registering User A...");
  const { data: authA, error: errA } = await clientA.auth.signUp({
    email: userAEmail,
    password: testPassword,
    options: { data: { display_name: "User A" } },
  });

  if (errA || !authA.user) {
    console.error("Failed to register User A:", errA?.message);
    return;
  }
  const userAId = authA.user.id;
  console.log("User A registered. UID:", userAId);

  // If email confirmation is required on Supabase, sign in might require confirmed session,
  // but if session is returned from signUp, clientA will have session:
  if (!authA.session) {
    const { error: signInErr } = await clientA.auth.signInWithPassword({
      email: userAEmail,
      password: testPassword,
    });
    if (signInErr) {
      console.warn("User A sign-in note:", signInErr.message);
    }
  }

  // Step 2: User A creates a source
  console.log("\n2. User A creates a Source...");
  const { data: sourceA, error: sourceErr } = await clientA
    .from("sources")
    .insert({
      user_id: userAId,
      title: "User A Private Journal",
      source_type: "book",
      creator: "Author A",
      description: "Confidential reading notes",
    })
    .select()
    .single();

  if (sourceErr) {
    console.error("Failed to insert source for User A:", sourceErr);
    return;
  }
  console.log("User A source created with ID:", sourceA.id);

  // Step 3: User A creates a chapter
  console.log("\n3. User A creates a Chapter...");
  const { data: chapterA, error: chapterErr } = await clientA
    .from("chapters")
    .insert({
      source_id: sourceA.id,
      user_id: userAId,
      title: "Secret Chapter 1",
      chapter_number: 1,
    })
    .select()
    .single();

  if (chapterErr) {
    console.error("Failed to insert chapter for User A:", chapterErr);
    return;
  }
  console.log("User A chapter created with ID:", chapterA.id);

  // Step 4: User A creates a knowledge entry
  console.log("\n4. User A creates a Knowledge Entry...");
  const { data: entryA, error: entryErr } = await clientA
    .from("knowledge_entries")
    .insert({
      user_id: userAId,
      source_id: sourceA.id,
      chapter_id: chapterA.id,
      entry_type: "Idea",
      title: "Private Revelation",
      original_transcription: "This is a strictly private note recorded by user A.",
      cleaned_content: "This is a strictly private note recorded by user A.",
      tags: ["confidential"],
    })
    .select()
    .single();

  if (entryErr) {
    console.error("Failed to insert knowledge entry for User A:", entryErr);
    return;
  }
  console.log("User A entry created with ID:", entryA.id);

  // Step 5: Sign up User B
  console.log("\n5. Registering User B...");
  const { data: authB, error: errB } = await clientB.auth.signUp({
    email: userBEmail,
    password: testPassword,
    options: { data: { display_name: "User B" } },
  });

  if (errB || !authB.user) {
    console.error("Failed to register User B:", errB?.message);
    return;
  }
  const userBId = authB.user.id;
  console.log("User B registered. UID:", userBId);

  if (!authB.session) {
    await clientB.auth.signInWithPassword({
      email: userBEmail,
      password: testPassword,
    });
  }

  // Step 6: User B attempts to query sources
  console.log("\n6. User B selects all sources...");
  const { data: sourcesForB, error: errReadSources } = await clientB
    .from("sources")
    .select("*");

  console.log(`Sources visible to User B: ${sourcesForB?.length ?? 0}`);
  const leakedSources = sourcesForB?.filter((s) => s.user_id === userAId) ?? [];
  if (leakedSources.length > 0) {
    console.error("RLS VIOLATION: User B can see User A sources!", leakedSources);
    process.exit(1);
  }

  // Step 7: User B attempts to read User A's specific source by ID
  console.log("\n7. User B queries User A's specific source by ID...");
  const { data: specificSourceForB } = await clientB
    .from("sources")
    .select("*")
    .eq("id", sourceA.id);

  if (specificSourceForB && specificSourceForB.length > 0) {
    console.error("RLS VIOLATION: User B accessed User A's source by ID!", specificSourceForB);
    process.exit(1);
  }
  console.log("Confirmed: User B cannot fetch User A source by ID (0 rows returned).");

  // Step 8: User B attempts to query chapters
  console.log("\n8. User B selects all chapters...");
  const { data: chaptersForB } = await clientB.from("chapters").select("*");
  const leakedChapters = chaptersForB?.filter((c) => c.user_id === userAId) ?? [];
  if (leakedChapters.length > 0) {
    console.error("RLS VIOLATION: User B can see User A chapters!", leakedChapters);
    process.exit(1);
  }
  console.log("Confirmed: User B cannot see any User A chapters.");

  // Step 9: User B attempts to query knowledge entries
  console.log("\n9. User B selects all knowledge entries...");
  const { data: entriesForB } = await clientB.from("knowledge_entries").select("*");
  const leakedEntries = entriesForB?.filter((e) => e.user_id === userAId) ?? [];
  if (leakedEntries.length > 0) {
    console.error("RLS VIOLATION: User B can see User A entries!", leakedEntries);
    process.exit(1);
  }
  console.log("Confirmed: User B cannot see any User A knowledge entries.");

  // Step 10: User B attempts to inject a record pretending to be User A
  console.log("\n10. User B attempts spoofing insert with user_id = User A...");
  const { error: spoofErr } = await clientB
    .from("sources")
    .insert({
      user_id: userAId, // Attempting to write into User A's space
      title: "Spoofed Source by Malicious User B",
      source_type: "book",
    });

  if (!spoofErr) {
    console.error("RLS VIOLATION: User B was able to insert with User A user_id!");
    process.exit(1);
  }
  console.log("Confirmed: Spoofed insert blocked by RLS:", spoofErr.message);

  console.log("\n=== ALL RLS INTEGRITY CHECKS PASSED SUCCESSFULLY ===");
}

runRlsVerification().catch((err) => {
  console.error("Verification failed with exception:", err);
  process.exit(1);
});
