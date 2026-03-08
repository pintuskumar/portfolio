import { NextRequest } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "../../../lib/rate-limit";

const openai = new OpenAI({
  apiKey: process.env.FASTROUTER_API_KEY,
  baseURL: process.env.FASTROUTER_API_URL?.replace("/chat/completions", ""),
});

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const { success } = await rateLimit(`voice-chat:${ip}`, 10, 3600);
    if (!success) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | null;
    if (!audioFile) {
      return new Response(JSON.stringify({ error: "No audio provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Step 1: Transcribe with Deepgram
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const dgResponse = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": audioFile.type || "audio/webm",
        },
        body: audioBuffer,
      }
    );

    if (!dgResponse.ok) {
      return new Response(JSON.stringify({ error: "Transcription failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const dgData = await dgResponse.json();
    const transcript =
      dgData.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

    if (!transcript.trim()) {
      return new Response(
        JSON.stringify({ error: "Could not understand audio", transcript: "" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 2: Get AI response
    const completion = await openai.chat.completions.create({
      model: process.env.FASTROUTER_MODEL || "openai/gpt-5.2",
      messages: [
        {
          role: "system",
          content:
            "You are Pintu Kumar's AI voice assistant on his portfolio website. Keep answers short (1-2 sentences) and conversational. Answer about his skills, experience, projects, and education. If asked something unrelated, briefly redirect to his portfolio.",
        },
        { role: "user", content: transcript },
      ],
      max_tokens: 150,
    });

    const aiText =
      completion.choices[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    // Step 3: Convert to speech with ElevenLabs
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL";
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: aiText,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!ttsResponse.ok) {
      // Fallback: return text only if TTS fails
      return new Response(
        JSON.stringify({ transcript, response: aiText, audioAvailable: false }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const audioResponse = await ttsResponse.arrayBuffer();

    return new Response(
      JSON.stringify({
        transcript,
        response: aiText,
        audio: Buffer.from(audioResponse).toString("base64"),
        audioAvailable: true,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Voice chat error:", error);
    return new Response(
      JSON.stringify({ error: "Voice processing failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
