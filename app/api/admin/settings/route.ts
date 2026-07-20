import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { siteSettingsSchema } from "../../../../lib/validation";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = siteSettingsSchema.safeParse(
    await request.json().catch(() => null)
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "The settings payload is invalid." },
      { status: 400 }
    );
  }

  await Promise.all(
    Object.entries(parsed.data).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  revalidatePath("/");
  revalidatePath("/registration");
  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
