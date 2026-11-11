import { promises as fs } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

import { hasAdminAccess, isSameOriginRequest } from "@/lib/admin-access";
import { getProductPhotos, saveProductPhotos } from "@/modules/catalog/server";
import type { ProductPhoto } from "@/modules/catalog";

const PUBLIC_PRODUCTS_DIR = path.join(process.cwd(), "public", "images", "products");

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Enter the admin access code to continue." },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}

function normalizePhoto(input: Partial<ProductPhoto>): ProductPhoto {
  const src = typeof input.src === "string" ? input.src.trim() : "";
  const alt = typeof input.alt === "string" ? input.alt.trim() : "";

  if (!src || !alt) {
    throw new Error("A photo needs both a source and alt text.");
  }

  return {
    id: typeof input.id === "string" && input.id ? input.id : `photo-${Date.now()}`,
    src,
    alt,
    width: Number(input.width) || 1200,
    height: Number(input.height) || 1600,
    order: Number(input.order) || 0,
  };
}

async function handleUpload(formData: FormData): Promise<ProductPhoto> {
  const fileEntry = formData.get("file");
  const alt = String(formData.get("alt") ?? "").trim();
  const id = String(formData.get("id") ?? `photo-${Date.now()}`);

  if (!(fileEntry instanceof File) || fileEntry.size === 0) {
    throw new Error("Please choose an image file to upload.");
  }

  const extension = fileEntry.name.includes(".") ? path.extname(fileEntry.name) : ".png";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  const uploadPath = path.join(PUBLIC_PRODUCTS_DIR, fileName);

  await fs.mkdir(PUBLIC_PRODUCTS_DIR, { recursive: true });
  const buffer = Buffer.from(await fileEntry.arrayBuffer());
  await fs.writeFile(uploadPath, buffer);

  return normalizePhoto({
    id,
    src: `/images/products/${fileName}`,
    alt: alt || fileEntry.name,
    width: Number(formData.get("width")) || 1200,
    height: Number(formData.get("height")) || 1600,
    order: Number(formData.get("order")) || 0,
  });
}

export async function GET() {
  if (!(await hasAdminAccess())) {
    return unauthorizedResponse();
  }

  const photos = await getProductPhotos();
  return NextResponse.json(photos, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!(await hasAdminAccess())) {
    return unauthorizedResponse();
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const photo = await handleUpload(formData);
      const photos = await getProductPhotos();
      const nextPhotos = [...photos, photo];
      const savedPhotos = await saveProductPhotos(nextPhotos);
      return NextResponse.json(savedPhotos);
    }

    const payload = (await request.json()) as Partial<ProductPhoto>;
    const photos = await getProductPhotos();
    const nextPhotos = [...photos, normalizePhoto(payload)];
    const savedPhotos = await saveProductPhotos(nextPhotos);

    return NextResponse.json(savedPhotos);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save the photo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  if (!(await hasAdminAccess())) {
    return unauthorizedResponse();
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  try {
    const payload = (await request.json()) as Partial<ProductPhoto>;
    const photos = await getProductPhotos();
    const normalized = normalizePhoto(payload);
    const nextPhotos = photos.some((photo) => photo.id === normalized.id)
      ? photos.map((photo) => (photo.id === normalized.id ? normalized : photo))
      : [...photos, normalized];

    const savedPhotos = await saveProductPhotos(nextPhotos);
    return NextResponse.json(savedPhotos);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update the photo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await hasAdminAccess())) {
    return unauthorizedResponse();
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  try {
    const payload = (await request.json()) as { id?: string };
    const photoId = payload.id;

    if (!photoId) {
      return NextResponse.json({ error: "Missing photo id." }, { status: 400 });
    }

    const photos = await getProductPhotos();
    const nextPhotos = photos.filter((photo) => photo.id !== photoId);
    const savedPhotos = await saveProductPhotos(nextPhotos);

    return NextResponse.json(savedPhotos);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete the photo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
