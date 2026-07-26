import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { communityInterestSchema } from "../../../lib/validation";

export const runtime = "nodejs";

const submissions = new Map<string, { count: number; resetAt: number }>();
const SUBMISSION_WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS = 8;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const current = submissions.get(ip);

  if (current && current.resetAt > now && current.count >= MAX_SUBMISSIONS) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = communityInterestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Review the community form and try again.",
        issues: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const domain = await prisma.domain.findFirst({
    where: { id: parsed.data.domainId, isPublished: true },
    select: { id: true, name: true },
  });

  if (!domain) {
    return NextResponse.json(
      { error: "The selected community domain is not available." },
      { status: 404 }
    );
  }

  try {
    const interest = await prisma.communityInterest.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        notes: parsed.data.notes?.trim() || null,
        domainId: domain.id,
        domainName: domain.name,
        source: "COMMUNITY_FORM",
      },
    });

    submissions.set(ip, {
      count: current && current.resetAt > now ? current.count + 1 : 1,
      resetAt:
        current && current.resetAt > now
          ? current.resetAt
          : now + SUBMISSION_WINDOW_MS,
    });

    return NextResponse.json(
      {
        ok: true,
        interestId: interest.id,
        message: `Interest recorded for the ${domain.name} community.`,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Community interest could not be submitted.",
      },
      { status: 500 }
    );
  }
}
