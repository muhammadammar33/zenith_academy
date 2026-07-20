import { NextResponse } from "next/server";
import { verifyReceiptUpload } from "../../../lib/media";
import { sendRegistrationEmails } from "../../../lib/mail";
import { prisma } from "../../../lib/prisma";
import { getRegistrationSetting } from "../../../lib/public-data";
import {
  receiptReferenceSchema,
  registrationSchema,
} from "../../../lib/validation";

export const runtime = "nodejs";

const submissions = new Map<string, { count: number; resetAt: number }>();
const SUBMISSION_WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS = 5;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const current = submissions.get(ip);

  if (
    current &&
    current.resetAt > now &&
    current.count >= MAX_SUBMISSIONS
  ) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later." },
      { status: 429 }
    );
  }

  const registrationSetting = await getRegistrationSetting();

  if (!registrationSetting.isOpen) {
    return NextResponse.json(
      { error: "Registration is currently closed." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(body);
  const receipt = receiptReferenceSchema.safeParse(body?.receipt);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Review the registration fields and try again.",
        issues: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  if (!receipt.success) {
    return NextResponse.json(
      { error: "Upload a valid payment receipt before submitting." },
      { status: 400 }
    );
  }

  const course = await prisma.course.findFirst({
    where: { id: parsed.data.courseId, isPublished: true },
    select: { id: true, title: true, fee: true, mode: true },
  });

  if (!course) {
    return NextResponse.json(
      { error: "The selected course is not open for registration." },
      { status: 404 }
    );
  }

  try {
    const upload = await verifyReceiptUpload(
      receipt.data.publicId,
      receipt.data.resourceType
    );
    const registration = await prisma.registration.create({
      data: {
        ...parsed.data,
        courseId: course.id,
        courseTitle: course.title,
        courseFee: course.fee,
        courseMode: course.mode,
        receiptUrl: upload.secureUrl,
        receiptPublicId: upload.publicId,
      },
    });

    await sendRegistrationEmails({
      fullName: registration.fullName,
      email: registration.email,
      phone: registration.phone,
      courseTitle: course.title,
      paymentMethod: registration.paymentMethod,
      registrationId: registration.id,
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
        registrationId: registration.id,
        message:
          "Registration received. Check your email for the confirmation reference.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Registration could not be submitted.",
      },
      { status: 500 }
    );
  }
}
