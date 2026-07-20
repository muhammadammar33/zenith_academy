import { NextResponse } from "next/server";
import { createSignedReceiptUpload } from "../../../../lib/media";
import { getRegistrationSetting } from "../../../../lib/public-data";

export const runtime = "nodejs";

const requests = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 10;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const current = requests.get(ip);

  if (current && current.resetAt > now && current.count >= MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Too many upload requests. Try again later." },
      { status: 429 }
    );
  }

  if (!(await getRegistrationSetting()).isOpen) {
    return NextResponse.json(
      { error: "Registration is currently closed." },
      { status: 403 }
    );
  }

  try {
    requests.set(ip, {
      count: current && current.resetAt > now ? current.count + 1 : 1,
      resetAt: current && current.resetAt > now ? current.resetAt : now + WINDOW_MS,
    });
    return NextResponse.json(createSignedReceiptUpload());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Receipt uploads are not configured.",
      },
      { status: 500 }
    );
  }
}
