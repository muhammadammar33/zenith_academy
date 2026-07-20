import AdminDashboard from "../../components/admin/AdminDashboard";
import { requireAdmin } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireAdmin();

  try {
    const [courses, domains, registrations, media, settings, emailLogs] =
      await Promise.all([
        prisma.course.findMany({
          include: { domain: { select: { name: true } } },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        }),
        prisma.domain.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        }),
        prisma.registration.findMany({
          orderBy: { createdAt: "desc" },
          take: 200,
        }),
        prisma.mediaAsset.findMany({
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
        prisma.siteSetting.findMany(),
        prisma.emailLog.findMany({
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
      ]);

    return (
      <AdminDashboard
        adminEmail={session.email}
        courses={courses.map((course) => ({
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          about: course.about,
          takeaway: course.takeaway,
          audience: course.audience,
          duration: course.duration,
          mode: course.mode,
          status: course.status,
          fee: course.fee,
          seats: course.seats,
          imageUrl: course.imageUrl,
          imageAlt: course.imageAlt,
          prerequisites: course.prerequisites,
          sessions: course.sessions,
          sortOrder: course.sortOrder,
          isPublished: course.isPublished,
          domainId: course.domainId,
          domainName: course.domain.name,
        }))}
        domains={domains.map((domain) => ({
          id: domain.id,
          name: domain.name,
          slug: domain.slug,
          line: domain.line,
          about: domain.about,
          outcome: domain.outcome,
          imageUrl: domain.imageUrl,
          imageAlt: domain.imageAlt,
          themes: domain.themes,
          sortOrder: domain.sortOrder,
          isPublished: domain.isPublished,
        }))}
        registrations={registrations.map((registration) => ({
          id: registration.id,
          fullName: registration.fullName,
          email: registration.email,
          phone: registration.phone,
          educationLevel: registration.educationLevel,
          institution: registration.institution,
          degreeProgram: registration.degreeProgram,
          studyYear: registration.studyYear,
          courseTitle: registration.courseTitle,
          paymentMethod: registration.paymentMethod,
          receiptUrl: registration.receiptUrl,
          status: registration.status,
          adminNotes: registration.adminNotes ?? "",
          createdAt: registration.createdAt.toISOString(),
        }))}
        media={media.map((asset) => ({
          ...asset,
          createdAt: asset.createdAt.toISOString(),
        }))}
        emailLogs={emailLogs.map((log) => ({
          id: log.id,
          recipient: log.recipient,
          subject: log.subject,
          status: log.status,
          createdAt: log.createdAt.toISOString(),
        }))}
        settings={Object.fromEntries(
          settings.map((setting) => [setting.key, setting.value])
        )}
      />
    );
  } catch (error) {
    return (
      <AdminDashboard
        adminEmail={session.email}
        courses={[]}
        domains={[]}
        registrations={[]}
        media={[]}
        emailLogs={[]}
        settings={{}}
        databaseError={
          error instanceof Error ? error.message : "Could not connect to PostgreSQL."
        }
      />
    );
  }
}
