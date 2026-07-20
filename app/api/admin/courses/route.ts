import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { courseSchema } from "../../../../lib/validation";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = courseSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Review the course fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id, ...data } = parsed.data;

  try {
    const course = id
      ? await prisma.course.update({ where: { id }, data })
      : await prisma.course.create({ data });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/domains");
    revalidatePath("/registration");
    revalidatePath("/admin");
    return NextResponse.json({ course }, { status: id ? 200 : 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The course could not be saved.",
      },
      { status: 409 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Course ID is required." }, { status: 400 });
  }

  try {
    await prisma.course.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/domains");
    revalidatePath("/registration");
    revalidatePath("/admin");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "A course with registrations cannot be deleted. Unpublish it instead." },
      { status: 409 }
    );
  }
}
