import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey });

async function listModels() {
  try {
    const models = await groq.models.list();
    console.log("Available Groq models:");
    models.data.forEach((m) => console.log("- " + m.id));
  } catch (err) {
    console.error("List models error:", err);
  }
}

listModels();

