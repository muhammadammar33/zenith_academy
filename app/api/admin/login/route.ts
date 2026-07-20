import { NextResponse } from "next/server";
import { createAdminSession, verifyAdminCredentials } from "../../../../lib/auth";
import { loginSchema } from "../../../../lib/validation";

export const runtime = "nodejs";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const current = attempts.get(ip);

  if (current && current.resetAt > now && current.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  try {
    const valid = await verifyAdminCredentials(
      parsed.data.email,
      parsed.data.password
    );

    if (!valid) {
      attempts.set(ip, {
        count: (current?.resetAt ?? 0) > now ? (current?.count ?? 0) + 1 : 1,
        resetAt: (current?.resetAt ?? 0) > now ? current!.resetAt : now + WINDOW_MS,
      });

      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    attempts.delete(ip);
    await createAdminSession(parsed.data.email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Admin sign-in is not configured.",
      },
      { status: 500 }
    );
  }
}
