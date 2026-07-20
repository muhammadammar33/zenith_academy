import "server-only";

import { compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "zenith_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type AdminSession = {
  email: string;
  role: "admin";
};

function getSessionSecret() {
  const value = process.env.ADMIN_SESSION_SECRET;

  if (!value && process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET is required in production.");
  }

  return new TextEncoder().encode(
    value ?? "development-only-secret-change-before-production"
  );
}

/**
 * Next.js and Vercel treat `$` as env interpolation.
 * Store hashes with `$$` on Vercel, or `\$` in local `.env.local`.
 * This restores a normal bcrypt string before compare().
 */
function normalizePasswordHash(raw: string) {
  let hash = raw.trim().replace(/^["']|["']$/g, "");
  hash = hash.replace(/\\\$/g, "$");
  hash = hash.replace(/\$\$/g, "$");
  return hash;
}

export async function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH
    ? normalizePasswordHash(process.env.ADMIN_PASSWORD_HASH)
    : undefined;

  if (!adminEmail || !passwordHash) {
    throw new Error("Admin credentials are not configured.");
  }

  if (!/^\$2[aby]\$\d{2}\$/.test(passwordHash)) {
    throw new Error(
      "ADMIN_PASSWORD_HASH is invalid. On Vercel, escape each $ as $$ (e.g. $$2b$$12$$...)."
    );
  }

  const emailMatches = email.trim().toLowerCase() === adminEmail;
  const passwordMatches = await compare(password, passwordHash);

  return emailMatches && passwordMatches;
}

export async function createAdminSession(email: string) {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email.trim().toLowerCase())
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecret());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export function clearAdminSession() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const token = cookies().get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSessionSecret());

    if (
      payload.role !== "admin" ||
      typeof payload.sub !== "string" ||
      payload.sub !== process.env.ADMIN_EMAIL?.trim().toLowerCase()
    ) {
      return null;
    }

    return { email: payload.sub, role: "admin" };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
