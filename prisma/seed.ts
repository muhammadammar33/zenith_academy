import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { PrismaClient } from "../app/generated/prisma/client";
import { courses, domains } from "../app/content";

config({ path: ".env.local" });
config();

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/zenith_academy",
});
const prisma = new PrismaClient({ adapter });

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const domainIds = new Map<string, string>();

  for (const [index, domain] of domains.entries()) {
    const record = await prisma.domain.upsert({
      where: { slug: domain.slug },
      update: {
        name: domain.name,
        line: domain.line,
        about: domain.about,
        outcome: domain.outcome,
        imageUrl: domain.image,
        imageAlt: domain.imageAlt,
        themes: domain.themes,
        sortOrder: index,
      },
      create: {
        name: domain.name,
        slug: domain.slug,
        line: domain.line,
        about: domain.about,
        outcome: domain.outcome,
        imageUrl: domain.image,
        imageAlt: domain.imageAlt,
        themes: domain.themes,
        sortOrder: index,
      },
    });

    domainIds.set(domain.name, record.id);
  }

  for (const [index, course] of courses.entries()) {
    const domainId = domainIds.get(course.domain);

    if (!domainId) {
      throw new Error(`No domain found for ${course.title}.`);
    }

    const data = {
      title: course.title,
      domainId,
      description: course.description,
      about: course.about,
      takeaway: course.takeaway,
      audience: course.audience,
      duration: course.duration,
      mode: course.mode,
      status: course.status,
      fee: Number(course.fee.replace(/\D/g, "")),
      seats: course.seats,
      imageUrl: course.image,
      imageAlt: course.imageAlt,
      prerequisites: course.prerequisites,
      sessions: course.sessions,
      sortOrder: index,
    };

    await prisma.course.upsert({
      where: { slug: slugify(course.title) },
      update: data,
      create: { ...data, slug: slugify(course.title) },
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: "registration" },
    update: {},
    create: {
      key: "registration",
      value: {
        isOpen: true,
        paymentInstructions:
          "Choose a payment method to view the active account details.",
      },
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
