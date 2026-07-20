import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../../lib/auth";
import { sendRegistrationStatusEmail } from "../../../../../lib/mail";
import { prisma } from "../../../../../lib/prisma";
import { registrationStatusSchema } from "../../../../../lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = registrationStatusSchema.safeParse(
    await request.json().catch(() => null)
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Choose a valid status and keep notes under 5,000 characters." },
      { status: 400 }
    );
  }

  try {
    const current = await prisma.registration.findUnique({
      where: { id: params.id },
    });

    if (!current) {
      return NextResponse.json(
        { error: "Registration not found." },
        { status: 404 }
      );
    }

    const registration = await prisma.registration.update({
      where: { id: params.id },
      data: parsed.data,
    });

    if (
      current.status !== registration.status &&
      registration.status !== "PENDING"
    ) {
      await sendRegistrationStatusEmail({
        email: registration.email,
        fullName: registration.fullName,
        courseTitle: current.courseTitle,
        status: registration.status,
      });
    }

    revalidatePath("/admin");
    return NextResponse.json({ registration });
  } catch {
    return NextResponse.json(
      { error: "The registration could not be updated." },
      { status: 404 }
    );
  }
}
