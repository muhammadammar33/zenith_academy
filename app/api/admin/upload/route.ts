import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../lib/auth";
import {
  deleteMediaAsset,
  uploadFile,
} from "../../../../lib/media";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folderValue = formData.get("folder");
  const folder =
    folderValue === "domain-images" ? "domain-images" : "course-images";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }

  if (!IMAGE_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Upload a JPG, PNG, or WebP image no larger than 10MB." },
      { status: 400 }
    );
  }

  try {
    const result = await uploadFile(file, folder);
    const asset = await prisma.mediaAsset.create({
      data: {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        resourceType: result.resource_type,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        altText: String(formData.get("altText") ?? "").trim() || null,
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
      { error: "Replace this image on every course or domain before deleting it." },
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
          error instanceof Error ? error.message : "The media asset could not be deleted.",
      },
      { status: 500 }
    );
  }
}
