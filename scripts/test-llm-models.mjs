import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey });

async function testCandidate(model) {
  try {
    const res = await groq.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are a JSON extractor. Output valid JSON with key 'status'.",
        },
        {
          role: "user",
          content: "Hello! Respond with valid JSON.",
        },
      ],
      response_format: { type: "json_object" },
    });
    console.log(`Model ${model} SUCCESS:`, res.choices[0]?.message?.content);
    return true;
  } catch (err) {
    console.log(`Model ${model} FAILED:`, err.message);
    return false;
  }
}

async function run() {
  console.log("Testing qwen/qwen3.8-27b...");
  await testCandidate("qwen/qwen3.8-27b");

  console.log("Testing openai/gpt-oss-120b...");
  await testCandidate("openai/gpt-oss-120b");

  console.log("Testing openai/gpt-oss-20b...");
  await testCandidate("openai/gpt-oss-20b");
}

run();

