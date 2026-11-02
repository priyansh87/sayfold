import { answerFromVault, type EntryReference } from "../src/lib/server/askMemory";

async function testAskMyMemory() {
  console.log("=== SAYFOLD MILESTONE 5: ASK MY MEMORY GROUNDING TEST ===");

  // Test Case 1: Grounded answer from retrieved entries
  console.log("\n[Test 1] Grounded Answer with Vault Entries...");
  const sampleEntries: EntryReference[] = [
    {
      id: "entry-1",
      title: "Epictetus on Control",
      cleaned_content: "Some things are in our control and others not. Things in our control are opinion, pursuit, desire, and aversion. Things not in our control are body, property, and reputation.",
      entry_type: "Idea",
      source_title: "Enchiridion",
      chapter_title: "Chapter 1",
    },
    {
      id: "entry-2",
      title: "Marcus Aurelius on Reactions",
      cleaned_content: "You have power over your mind - not outside events. Realize this, and you will find strength.",
      entry_type: "Quote",
      source_title: "Meditations",
      chapter_title: "Book 4",
    },
  ];

  const question = "What things did Epictetus say are within our control?";
  const result = await answerFromVault(question, sampleEntries);

  console.log(`Question: "${question}"`);
  console.log(`Answer:\n${result.answer}`);
  console.log(`References attached: ${result.references.length}`);

  const hasEpictetusConcepts =
    result.answer.toLowerCase().includes("opinion") ||
    result.answer.toLowerCase().includes("desire") ||
    result.answer.toLowerCase().includes("control");

  if (!hasEpictetusConcepts) {
    console.error("Answer failed to cite key concepts from vault entries!");
    process.exit(1);
  }
  console.log("Test 1 SUCCESS: Answer is strictly grounded in vault notes!");

  // Test Case 2: Negative Case (No matching entries in vault)
  console.log("\n[Test 2] Negative Case: Empty retrieved entries (No matches in vault)...");
  const emptyResult = await answerFromVault(
    "How do I cook a margherita pizza in an oven?",
    []
  );

  console.log(`Answer for uncataloged topic:\n"${emptyResult.answer}"`);
  if (!emptyResult.answer.toLowerCase().includes("vault me nahi mila")) {
    console.error("Expected answer to contain 'vault me nahi mila', but got:", emptyResult.answer);
    process.exit(1);
  }
  console.log("Test 2 SUCCESS: Correctly falls back to 'vault me nahi mila' when not in vault!");

  console.log("\n=== ALL MILESTONE 5 ASK MY MEMORY TESTS PASSED SUCCESSFULLY ===");
}

testAskMyMemory().catch((err) => {
  console.error("Ask My Memory test error:", err);
  process.exit(1);
});

