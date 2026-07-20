import { NextResponse } from "next/server";
import {
  getPublicCourses,
  getRegistrationSetting,
} from "../../../lib/public-data";

export async function GET() {
  const [courses, registration] = await Promise.all([
    getPublicCourses(),
    getRegistrationSetting(),
  ]);

  return NextResponse.json({
    courses: courses.map((course) => ({
      id: course.id,
      title: course.title,
      domain: course.domain,
      fee: course.fee,
      mode: course.mode,
    })),
    registration,
  });
}
