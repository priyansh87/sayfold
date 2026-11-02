import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!;

const randomId = Math.random().toString(36).substring(2, 8);
const testEmail = `sayfold.vault.test.${randomId}@gmail.com`;
const testPassword = `TestPass123!_${randomId}`;

async function testVaultAndSearch() {
  console.log("=== SAYFOLD MILESTONE 4: VAULT & SEARCH INTEGRATION TEST ===");
  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Register test user
  console.log("\n1. Registering test user:", testEmail);
  const { data: auth, error: authErr } = await client.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: { data: { display_name: "Vault Tester" } },
  });

  if (authErr || !auth.user) {
    console.error("Signup failed:", authErr?.message);
    process.exit(1);
  }
  const userId = auth.user.id;
  console.log("User registered! UID:", userId);

  // 2. Insert entries of varied types
  console.log("\n2. Inserting Idea, Vocab, and Quote entries...");
  const { data: ideaEntry } = await client
    .from("knowledge_entries")
    .insert({
      user_id: userId,
      entry_type: "Idea",
      title: "Habit Stacking Mechanics",
      original_transcription: "Habit stacking connects a new behavior to an already existing ritual.",
      cleaned_content: "Habit stacking connects a new behavior to an already existing daily ritual.",
      tags: ["habits", "productivity"],
    })
    .select()
    .single();

  const { data: vocabEntry } = await client
    .from("knowledge_entries")
    .insert({
      user_id: userId,
      entry_type: "Vocab",
      title: "Serendipity Definition",
      original_transcription: "The word serendipity means an aptitude for making desirable discoveries by accident.",
      cleaned_content: "The word serendipity means an aptitude for making desirable discoveries by accident.",
      metadata: {
        vocab: {
          word: "Serendipity",
          meaning: "An aptitude for making desirable discoveries by accident.",
          example: "Finding that antique bookstore was pure serendipity.",
        },
      },
    })
    .select()
    .single();

  const { data: quoteEntry } = await client
    .from("knowledge_entries")
    .insert({
      user_id: userId,
      entry_type: "Quote",
      title: "The Obstacle Is The Way",
      original_transcription: "What stands in the way becomes the way.",
      cleaned_content: "What stands in the way becomes the way.",
      metadata: {
        quote_attribution: "Marcus Aurelius",
      },
    })
    .select()
    .single();

  console.log("Entries created:");
  console.log("- Idea ID:", ideaEntry?.id);
  console.log("- Vocab ID:", vocabEntry?.id);
  console.log("- Quote ID:", quoteEntry?.id);

  // 3. Test filtering by entry_type
  console.log("\n3. Testing Vault Filtering by Entry Type...");
  const { data: ideasOnly } = await client
    .from("knowledge_entries")
    .select("*")
    .eq("entry_type", "Idea");

  const { data: quotesOnly } = await client
    .from("knowledge_entries")
    .select("*")
    .eq("entry_type", "Quote");

  console.log(`Ideas count: ${ideasOnly?.length} (verified: ${ideasOnly?.some((e) => e.id === ideaEntry?.id)})`);
  console.log(`Quotes count: ${quotesOnly?.length} (verified: ${quotesOnly?.some((e) => e.id === quoteEntry?.id)})`);

  // 4. Test Postgres Full-Text Search on fts column
  console.log("\n4. Testing Postgres FTS Search on tsvector...");
  const { data: searchResults, error: searchErr } = await client
    .from("knowledge_entries")
    .select("id, title, cleaned_content, entry_type")
    .textSearch("fts", "serendipity");

  if (searchErr) {
    console.error("FTS search query error:", searchErr);
    process.exit(1);
  }

  console.log(`FTS query for 'serendipity' returned ${searchResults?.length} matches.`);
  if (!searchResults?.some((e) => e.id === vocabEntry?.id)) {
    console.error("FTS search failed to find the vocab entry!");
    process.exit(1);
  }
  console.log("FTS Match verified:", searchResults[0].title);

  // 5. Test Update Entry
  console.log("\n5. Testing Entry Edit...");
  const { data: updatedIdea, error: updateErr } = await client
    .from("knowledge_entries")
    .update({
      title: "Updated Title: Habit Stacking Mastery",
      cleaned_content: "Updated content for habit stacking routines.",
    })
    .eq("id", ideaEntry!.id)
    .select()
    .single();

  if (updateErr || updatedIdea.title !== "Updated Title: Habit Stacking Mastery") {
    console.error("Entry update failed:", updateErr);
    process.exit(1);
  }
  console.log("Entry updated successfully! New Title:", updatedIdea.title);

  // 6. Test Toggle Favourite (Star)
  console.log("\n6. Testing Toggle Favourite...");
  const { data: favResult, error: favErr } = await client
    .from("knowledge_entries")
    .update({ is_favourite: true })
    .eq("id", quoteEntry!.id)
    .select()
    .single();

  if (favErr || !favResult.is_favourite) {
    console.error("Toggle favourite failed:", favErr);
    process.exit(1);
  }
  console.log("Starred as favourite successfully! Status:", favResult.is_favourite);

  // 7. Test Delete Entry
  console.log("\n7. Testing Delete Entry...");
  const { error: delErr } = await client
    .from("knowledge_entries")
    .delete()
    .eq("id", ideaEntry!.id);

  if (delErr) {
    console.error("Delete entry failed:", delErr);
    process.exit(1);
  }

  const { data: remaining } = await client
    .from("knowledge_entries")
    .select("id")
    .eq("id", ideaEntry!.id);

  if (remaining && remaining.length > 0) {
    console.error("Delete failed! Entry still exists.");
    process.exit(1);
  }
  console.log("Entry deleted successfully!");

  console.log("\n=== ALL MILESTONE 4 VAULT & SEARCH CHECKS PASSED SUCCESSFULLY ===");
}

testVaultAndSearch().catch((err) => {
  console.error("Vault test failed with exception:", err);
  process.exit(1);
});
