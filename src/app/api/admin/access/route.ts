import { NextResponse } from "next/server";

import {
  clearAdminSession,
  createAdminSession,
  isAdminAccessConfigured,
  isSameOriginRequest,
  verifyAdminAccessCode,
} from "@/lib/admin-access";

export async function POST(request: Request) {
  if (!isAdminAccessConfigured()) {
    return NextResponse.json(
      { error: "Admin access is not configured on this deployment." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter the admin access code." }, { status: 400 });
  }

  const candidate =
    typeof payload === "object" && payload !== null && "code" in payload
      ? payload.code
      : undefined;

  if (!verifyAdminAccessCode(candidate)) {
    return NextResponse.json({ error: "That access code is not correct." }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  await clearAdminSession();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
