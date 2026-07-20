import "server-only";

import nodemailer from "nodemailer";
import { prisma } from "./prisma";

type RegistrationMailData = {
  fullName: string;
  email: string;
  phone: string;
  courseTitle: string;
  paymentMethod: string;
  registrationId: string;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error("SMTP credentials are not configured.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character
  );
}

async function sendTrackedMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const log = await prisma.emailLog.create({
    data: { recipient: to, subject },
  });

  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_FROM ?? "Zenith Academy <noreply@example.com>",
      to,
      subject,
      text,
      html,
    });

    await prisma.emailLog.update({
      where: { id: log.id },
      data: { status: "SENT", sentAt: new Date() },
    });
  } catch (error) {
    await prisma.emailLog.update({
      where: { id: log.id },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown SMTP error",
      },
    });

    throw error;
  }
}

export async function sendRegistrationEmails(data: RegistrationMailData) {
  const safeName = escapeHtml(data.fullName);
  const safeCourse = escapeHtml(data.courseTitle);
  const adminRecipient =
    process.env.SMTP_ADMIN_TO ?? process.env.ADMIN_EMAIL ?? "";

  const studentMail = sendTrackedMail({
    to: data.email,
    subject: `Registration received — ${data.courseTitle}`,
    text: `Assalamu alaikum ${data.fullName},\n\nWe received your registration for ${data.courseTitle}. The Zenith Academy team will review your payment receipt and contact you with the next step.\n\nRegistration reference: ${data.registrationId}`,
    html: `<p>Assalamu alaikum ${safeName},</p><p>We received your registration for <strong>${safeCourse}</strong>. The Zenith Academy team will review your payment receipt and contact you with the next step.</p><p>Registration reference: <strong>${escapeHtml(data.registrationId)}</strong></p>`,
  });

  const adminMail = adminRecipient
    ? sendTrackedMail({
        to: adminRecipient,
        subject: `New registration — ${data.courseTitle}`,
        text: `${data.fullName} registered for ${data.courseTitle}.\nEmail: ${data.email}\nPhone: ${data.phone}\nPayment: ${data.paymentMethod}\nReference: ${data.registrationId}`,
        html: `<p><strong>${safeName}</strong> registered for <strong>${safeCourse}</strong>.</p><p>Email: ${escapeHtml(data.email)}<br>Phone: ${escapeHtml(data.phone)}<br>Payment: ${escapeHtml(data.paymentMethod)}<br>Reference: ${escapeHtml(data.registrationId)}</p>`,
      })
    : Promise.resolve();

  await Promise.allSettled([studentMail, adminMail]);
}

export async function sendRegistrationStatusEmail({
  email,
  fullName,
  courseTitle,
  status,
}: {
  email: string;
  fullName: string;
  courseTitle: string;
  status: "CONFIRMED" | "REJECTED";
}) {
  const confirmed = status === "CONFIRMED";
  const outcome = confirmed
    ? "Your registration is confirmed."
    : "Your registration could not be confirmed.";
  const nextStep = confirmed
    ? "The academy team will share the course schedule and joining details."
    : "Contact the academy team if you need help reviewing the payment or course details.";

  await sendTrackedMail({
    to: email,
    subject: `Registration ${status.toLowerCase()} — ${courseTitle}`,
    text: `Assalamu alaikum ${fullName},\n\n${outcome} ${nextStep}\n\nCourse: ${courseTitle}`,
    html: `<p>Assalamu alaikum ${escapeHtml(fullName)},</p><p><strong>${outcome}</strong> ${nextStep}</p><p>Course: ${escapeHtml(courseTitle)}</p>`,
  }).catch(() => undefined);
}
