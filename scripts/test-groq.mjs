import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
console.log("Testing Groq API with key present:", Boolean(apiKey));

const groq = new Groq({ apiKey });

async function testGroq() {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Respond with the single word: OK",
        },
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 10,
    });
    console.log("Groq LLM response:", chatCompletion.choices[0]?.message?.content);
  } catch (err) {
    console.error("Groq test error:", err);
  }
}

testGroq();

