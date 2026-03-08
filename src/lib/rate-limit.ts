import { redis } from "./redis";

export async function rateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining: number }> {
  try {
    const key = `rate-limit:${identifier}`;

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }

    if (count > limit) {
      return { success: false, remaining: 0 };
    }

    return { success: true, remaining: limit - count };
  } catch {
    // If Redis is unavailable, allow the request
    return { success: true, remaining: limit };
  }
}
