import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const RATE_LIMITS: Record<string, { max: number; windowSeconds: number }> = {
  "/api/chat": { max: 20, windowSeconds: 3600 },
  "/api/contact": { max: 5, windowSeconds: 3600 },
  "/api/views": { max: 60, windowSeconds: 3600 },
};

const DEFAULT_LIMIT = { max: 30, windowSeconds: 3600 };

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

function matchRoute(pathname: string): { max: number; windowSeconds: number } {
  for (const [route, limit] of Object.entries(RATE_LIMITS)) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      return limit;
    }
  }
  return DEFAULT_LIMIT;
}

export async function proxy(req: NextRequest) {
  const ip = getClientIp(req);
  const pathname = req.nextUrl.pathname;
  const { max, windowSeconds } = matchRoute(pathname);

  // Determine the base route for the rate limit key
  const routeSegments = pathname.split("/").slice(0, 3); // e.g. ["", "api", "chat"]
  const routeKey = routeSegments.join("/");
  const redisKey = `ratelimit:${routeKey}:${ip}`;

  try {
    const current = await redis.incr(redisKey);

    // Set expiry only on the first request in the window
    if (current === 1) {
      await redis.expire(redisKey, windowSeconds);
    }

    const remaining = Math.max(0, max - current);

    if (current > max) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "Retry-After": String(windowSeconds),
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  } catch {
    // Graceful degradation: if Redis is unavailable, allow the request through
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/api/:path*",
};
