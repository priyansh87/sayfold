import Groq from "groq-sdk";
import fs from "fs";

const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey });

function createDummyWav() {
  const sampleRate = 16000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = sampleRate * 1; // 1 second of audio
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF identifier
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  // Format chunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28); // ByteRate
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32); // BlockAlign
  buffer.writeUInt16LE(bitsPerSample, 34);

  // Data chunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

async function testWhisper() {
  const wavBuffer = createDummyWav();
  const file = new File([wavBuffer], "test.wav", { type: "audio/wav" });

  try {
    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3-turbo",
      language: "en",
    });
    console.log("Whisper transcription SUCCESS! Result:", transcription.text);
  } catch (err) {
    console.error("Whisper transcription test error:", err.message);
  }
}

testWhisper();

