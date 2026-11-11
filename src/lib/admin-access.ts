import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_ACCESS_COOKIE = "carcy-admin-access";

const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function getAdminAccessCode(): string {
  const accessCode = process.env.ADMIN_ACCESS_CODE;

  if (!accessCode || accessCode.length < 16) {
    throw new Error("Set ADMIN_ACCESS_CODE to a secret of at least 16 characters.");
  }

  return accessCode;
}

function signSession(expiresAt: number, accessCode: string): string {
  return createHmac("sha256", accessCode).update(`carcy-admin:${expiresAt}`).digest("hex");
}

function matchesConstantTime(actual: string, expected: string): boolean {
  if (actual.length !== expected.length) {
    return false;
  }

  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  return (
    actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function verifyAdminAccessCode(candidate: unknown): boolean {
  const accessCode = getAdminAccessCode();

  return typeof candidate === "string" && matchesConstantTime(candidate, accessCode);
}

export async function hasAdminAccess(): Promise<boolean> {
  const accessCode = getAdminAccessCode();
  const token = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  const [expiresAtValue, signature, extra] = token?.split(".") ?? [];

  if (!expiresAtValue || !signature || extra !== undefined || !/^\d+$/.test(expiresAtValue)) {
    return false;
  }

  const expiresAt = Number(expiresAtValue);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  return matchesConstantTime(signature, signSession(expiresAt, accessCode));
}

export async function createAdminSession(): Promise<void> {
  const accessCode = getAdminAccessCode();
  const expiresAt = Date.now() + SESSION_DURATION_SECONDS * 1000;
  const cookieStore = await cookies();

  cookieStore.set(
    ADMIN_ACCESS_COOKIE,
    `${expiresAt}.${signSession(expiresAt, accessCode)}`,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    },
  );
}

export async function clearAdminSession(): Promise<void> {
  (await cookies()).delete(ADMIN_ACCESS_COOKIE);
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    return false;
  }

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
