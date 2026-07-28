import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../lib/auth";
import {
  deleteMediaAsset,
  verifyAdminImageUpload,
  type AdminImageFolder,
} from "../../../../lib/media";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: {
    publicId?: string;
    folder?: string;
    altText?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Invalid upload payload." },
      { status: 400 }
    );
  }

  const publicId = body.publicId?.trim() ?? "";
  const folder: AdminImageFolder =
    body.folder === "domain-images" ? "domain-images" : "course-images";

  if (!publicId) {
    return NextResponse.json(
      { error: "Uploaded image public ID is required." },
      { status: 400 }
    );
  }

  try {
    const verified = await verifyAdminImageUpload(publicId, folder);
    const asset = await prisma.mediaAsset.create({
      data: {
        publicId: verified.publicId,
        secureUrl: verified.secureUrl,
        resourceType: verified.resourceType,
        format: verified.format,
        width: verified.width,
        height: verified.height,
        bytes: verified.bytes,
        altText: body.altText?.trim() || null,
      },
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "The image upload failed.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Media ID is required." }, { status: 400 });
  }

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });

  if (!asset) {
    return NextResponse.json({ error: "Media asset not found." }, { status: 404 });
  }

  const [courseUses, domainUses] = await Promise.all([
    prisma.course.count({ where: { imageUrl: asset.secureUrl } }),
    prisma.domain.count({ where: { imageUrl: asset.secureUrl } }),
  ]);

  if (courseUses + domainUses > 0) {
    return NextResponse.json(
      {
        error:
          "Replace this image on every course or domain before deleting it.",
      },
      { status: 409 }
    );
  }

  try {
    await deleteMediaAsset(asset.publicId);
    await prisma.mediaAsset.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The media asset could not be deleted.",
      },
      { status: 500 }
    );
  }
}
