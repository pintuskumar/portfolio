import { NextRequest, NextResponse } from "next/server";
import { redis } from "../../../../lib/redis";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { action } = await request.json();

    if (action !== "view" && action !== "download") {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    const total = await redis.incr(`resume:${action}:total`);

    const dedupeKey = `resume:${action}:${ip}`;
    const alreadyCounted = await redis.get(dedupeKey);

    let unique: number;

    if (!alreadyCounted) {
      await redis.set(dedupeKey, "1", { ex: 86400 });
      unique = await redis.incr(`resume:${action}:unique`);
    } else {
      unique = Number((await redis.get(`resume:${action}:unique`)) || 0);
    }

    return NextResponse.json({ success: true, total, unique });
  } catch {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [viewTotal, viewUnique, downloadTotal, downloadUnique] =
      await Promise.all([
        redis.get("resume:view:total"),
        redis.get("resume:view:unique"),
        redis.get("resume:download:total"),
        redis.get("resume:download:unique"),
      ]);

    return NextResponse.json({
      views: {
        total: Number(viewTotal || 0),
        unique: Number(viewUnique || 0),
      },
      downloads: {
        total: Number(downloadTotal || 0),
        unique: Number(downloadUnique || 0),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
