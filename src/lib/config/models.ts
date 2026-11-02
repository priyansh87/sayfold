/**
 * Central configuration for AI models across Sayfold.
 * Strictly referenced across all server-side pipelines.
 */
export const AI_MODELS = {
  // Voice transcription model via Groq Whisper API
  TRANSCRIPTION: "whisper-large-v3-turbo",

  // Core classification & extraction model (JSON mode / structured output)
  // Tested and verified on Groq API
  CLASSIFICATION: "openai/gpt-oss-120b",

  // Fast fallback classification model
  CLASSIFICATION_FAST: "qwen/qwen3.8-27b",

  // Grounded search & Q&A model for Ask My Memory
  ASK_MEMORY: "openai/gpt-oss-120b",
} as const;

export type AIModelType = typeof AI_MODELS[keyof typeof AI_MODELS];
