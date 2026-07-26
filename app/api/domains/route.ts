import { NextResponse } from "next/server";
import { getPublicDomains } from "../../../lib/public-data";

export async function GET() {
  const domains = await getPublicDomains();

  return NextResponse.json({
    domains: domains.map((domain) => ({
      id: domain.id,
      name: domain.name,
      slug: domain.slug,
      line: domain.line,
    })),
  });
}
