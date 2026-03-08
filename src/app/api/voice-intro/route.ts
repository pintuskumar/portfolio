import { NextResponse } from "next/server";
import { redis } from "../../../lib/redis";

const INTRO_TEXT = `Hi there! I'm Pintu Kumar, a Full Stack Software Developer with over 3 years of experience. I specialize in React, Node.js, TypeScript, and cloud technologies. Feel free to explore my portfolio and reach out if you'd like to collaborate!`;

const CACHE_KEY = "voice-intro:audio";
const CACHE_TTL = 86400; // 24 hours

export async function GET() {
  try {
    // Check cache first
    try {
      const cached = await redis.get<string>(CACHE_KEY);
      if (cached) {
        const buffer = Buffer.from(cached, "base64");
        return new Response(buffer, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    } catch {
      // Redis unavailable, skip cache
    }

    // Generate from ElevenLabs
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: INTRO_TEXT,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(audioBuffer).toString("base64");

    // Cache in Redis (non-blocking)
    redis.set(CACHE_KEY, base64, { ex: CACHE_TTL }).catch(() => {});

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Voice intro error:", error);
    return NextResponse.json(
      { error: "Failed to generate voice intro" },
      { status: 500 }
    );
  }
}
