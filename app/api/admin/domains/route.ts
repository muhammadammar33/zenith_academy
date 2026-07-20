import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { domainSchema } from "../../../../lib/validation";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = domainSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Review the domain fields and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id, ...data } = parsed.data;

  try {
    const domain = id
      ? await prisma.domain.update({ where: { id }, data })
      : await prisma.domain.create({ data });

    revalidatePath("/");
    revalidatePath("/domains");
    revalidatePath("/admin");
    return NextResponse.json({ domain }, { status: id ? 200 : 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The domain could not be saved.",
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
    return NextResponse.json({ error: "Domain ID is required." }, { status: 400 });
  }

  try {
    await prisma.domain.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/domains");
    revalidatePath("/admin");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Remove or reassign this domain’s courses before deleting it." },
      { status: 409 }
    );
  }
}
