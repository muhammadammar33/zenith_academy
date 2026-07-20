import "server-only";

import {
  courses as fallbackCourses,
  domains as fallbackDomains,
} from "../app/content";
import { prisma } from "./prisma";

const fallbackCourseData = fallbackCourses.map((course) => ({
  ...course,
  id: "",
}));

export async function getPublicDomains() {
  if (!process.env.DATABASE_URL) {
    return fallbackDomains;
  }

  try {
    const domains = await prisma.domain.findMany({
      where: { isPublished: true },
      include: {
        courses: {
          where: { isPublished: true },
          select: { title: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return domains.map((domain) => ({
      name: domain.name,
      slug: domain.slug,
      image: domain.imageUrl,
      imageAlt: domain.imageAlt,
      line: domain.line,
      about: domain.about,
      outcome: domain.outcome,
      themes: domain.themes,
      courses: domain.courses.map((course) => course.title),
    }));
  } catch {
    return fallbackDomains;
  }
}

export async function getPublicCourses() {
  if (!process.env.DATABASE_URL) {
    return fallbackCourseData;
  }

  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: { domain: { select: { name: true } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      domain: course.domain.name,
      image: course.imageUrl,
      imageAlt: course.imageAlt,
      duration: course.duration,
      mode: course.mode,
      status: course.status,
      description: course.description,
      about: course.about,
      takeaway: course.takeaway,
      audience: course.audience,
      prerequisites: course.prerequisites,
      sessions: course.sessions,
      fee: `PKR ${course.fee.toLocaleString("en-PK")}`,
      seats: course.seats,
    }));
  } catch {
    return fallbackCourseData;
  }
}

export async function getRegistrationSetting() {
  if (!process.env.DATABASE_URL) {
    return {
      isOpen: false,
      paymentInstructions:
        "Registration opens after the academy completes its enrollment setup.",
    };
  }

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "registration" },
    });

    if (
      setting?.value &&
      typeof setting.value === "object" &&
      !Array.isArray(setting.value)
    ) {
      const value = setting.value as Record<string, unknown>;
      return {
        isOpen: value.isOpen !== false,
        paymentInstructions:
          typeof value.paymentInstructions === "string"
            ? value.paymentInstructions
            : "Choose a payment method to view the active account details.",
      };
    }
  } catch {
    // Fall through to safe defaults when PostgreSQL is unavailable.
  }

  return {
    isOpen: false,
    paymentInstructions:
      "Registration is temporarily unavailable while the enrollment service reconnects.",
  };
}
