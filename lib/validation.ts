import { z } from "zod";
import {
  COLLEGE_CLASSES,
  EDUCATION_LEVELS,
  POSTGRAD_PROGRAM_TYPES,
  POSTGRAD_STUDY_YEARS,
  SCHOOL_CLASSES,
  UNIVERSITY_STUDY_YEARS,
  formatPostgradProgram,
  isSchoolOrCollege,
} from "./education";

const requiredText = z.string().trim().min(1).max(500);
const longText = z.string().trim().min(1).max(10_000);

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(200),
});

export const registrationSchema = z
  .object({
    fullName: requiredText.max(120),
    cnic: z
      .string()
      .trim()
      .regex(/^\d{5}-\d{7}-\d$/, "Use CNIC format 00000-0000000-0."),
    dateOfBirth: z.coerce.date(),
    gender: z.enum(["Male", "Female"]),
    phone: z.string().trim().min(10).max(30),
    email: z.string().trim().email(),
    educationLevel: z.enum(EDUCATION_LEVELS),
    institution: requiredText.max(200),
    degreeProgram: z.string().trim().max(200).optional().nullable(),
    programType: z.string().trim().max(80).optional().nullable(),
    studyYear: requiredText.max(50),
    courseId: z.string().cuid(),
    paymentMethod: z.enum(["Bank transfer", "JazzCash", "EasyPaisa"]),
  })
  .superRefine((data, context) => {
    if (isSchoolOrCollege(data.educationLevel)) {
      const allowed =
        data.educationLevel === "School"
          ? (SCHOOL_CLASSES as readonly string[])
          : (COLLEGE_CLASSES as readonly string[]);

      if (!allowed.includes(data.studyYear)) {
        context.addIssue({
          code: "custom",
          path: ["studyYear"],
          message: "Choose a valid class for the selected education level.",
        });
      }

      return;
    }

    if (data.educationLevel === "Graduation") {
      if (!data.degreeProgram?.trim()) {
        context.addIssue({
          code: "custom",
          path: ["degreeProgram"],
          message: "Enter the degree program.",
        });
      }

      if (!(UNIVERSITY_STUDY_YEARS as readonly string[]).includes(data.studyYear)) {
        context.addIssue({
          code: "custom",
          path: ["studyYear"],
          message: "Choose a semester from 1st to 10th, or Graduation.",
        });
      }

      return;
    }

    if (data.educationLevel === "Post Graduation") {
      if (
        !(POSTGRAD_PROGRAM_TYPES as readonly string[]).includes(
          data.programType ?? ""
        )
      ) {
        context.addIssue({
          code: "custom",
          path: ["programType"],
          message: "Choose a postgraduate program such as MS or PhD.",
        });
      }

      if (!data.degreeProgram?.trim()) {
        context.addIssue({
          code: "custom",
          path: ["degreeProgram"],
          message: "Enter the field or specialization.",
        });
      }

      if (!(POSTGRAD_STUDY_YEARS as readonly string[]).includes(data.studyYear)) {
        context.addIssue({
          code: "custom",
          path: ["studyYear"],
          message: "Choose the current postgraduate stage.",
        });
      }
    }
  })
  .transform((data) => {
    if (isSchoolOrCollege(data.educationLevel)) {
      const { programType: _programType, ...rest } = data;
      return { ...rest, degreeProgram: null };
    }

    if (data.educationLevel === "Post Graduation") {
      const { programType, ...rest } = data;
      return {
        ...rest,
        degreeProgram: formatPostgradProgram(
          programType ?? "",
          data.degreeProgram ?? ""
        ),
      };
    }

    const { programType: _programType, ...rest } = data;
    return {
      ...rest,
      degreeProgram: data.degreeProgram?.trim() || null,
    };
  });

export const receiptReferenceSchema = z.object({
  publicId: z.string().trim().min(1).max(500),
  resourceType: z.enum(["image", "raw"]),
});

export const domainSchema = z.object({
  id: z.string().cuid().optional(),
  name: requiredText.max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  line: requiredText,
  about: longText,
  outcome: longText,
  imageUrl: z.string().url(),
  imageAlt: requiredText.max(200),
  themes: z.array(requiredText.max(120)).min(1).max(20),
  sortOrder: z.coerce.number().int().min(0).max(10_000).default(0),
  isPublished: z.boolean().default(true),
});

export const courseSchema = z.object({
  id: z.string().cuid().optional(),
  title: requiredText.max(150),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  domainId: z.string().cuid(),
  description: longText,
  about: longText,
  takeaway: longText,
  audience: longText,
  duration: requiredText.max(80),
  mode: requiredText.max(80),
  status: requiredText.max(80),
  fee: z.coerce.number().int().min(0).max(10_000_000),
  seats: requiredText.max(80),
  imageUrl: z.string().url(),
  imageAlt: requiredText.max(200),
  prerequisites: z.array(requiredText.max(160)).max(30),
  sessions: z.array(requiredText.max(200)).min(1).max(30),
  sortOrder: z.coerce.number().int().min(0).max(10_000).default(0),
  isPublished: z.boolean().default(true),
});

export const registrationStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "REJECTED"]),
  adminNotes: z.string().trim().max(5_000).optional().nullable(),
});

export const siteSettingsSchema = z.object({
  registration: z
    .object({
      isOpen: z.boolean(),
      paymentInstructions: z.string().trim().max(10_000),
    })
    .optional(),
});
