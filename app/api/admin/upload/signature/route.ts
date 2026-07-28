import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../../lib/auth";
import {
  createSignedAdminImageUpload,
  type AdminImageFolder,
} from "../../../../../lib/media";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let folder: AdminImageFolder = "course-images";
  try {
    const body = (await request.json()) as { folder?: string };
    if (body.folder === "domain-images") {
      folder = "domain-images";
    }
  } catch {
    // Default to course-images when body is empty/invalid.
  }

  try {
    return NextResponse.json(createSignedAdminImageUpload(folder));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Image uploads are not configured.",
      },
      { status: 500 }
    );
  }
}
