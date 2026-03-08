import { NextRequest, NextResponse } from "next/server";
import { redis } from "../../../../lib/redis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const views = (await redis.get<number>(`views:${slug}`)) || 0;
    return NextResponse.json({ views });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Deduplicate by IP — each IP only counts once per slug per 24h
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    // Atomic deduplication — setnx returns true only if key was newly set
    const dedupeKey = `views-seen:${slug}:${ip}`;
    const isNew = await redis.set(dedupeKey, 1, { ex: 86400, nx: true });

    if (isNew) {
      await redis.incr(`views:${slug}`);
    }

    const views = (await redis.get<number>(`views:${slug}`)) || 0;
    return NextResponse.json({ views });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}
