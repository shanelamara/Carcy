import { NextResponse } from "next/server";

import {
  hasAdminAccess,
  isAdminAccessConfigured,
  isSameOriginRequest,
} from "@/lib/admin-access";
import {
  deleteProductPhotoImage,
  getProductPhotos,
  isProductPhotoStorageConfigured,
  ProductPhotoInputError,
  ProductPhotoStorageUnavailableError,
  saveProductPhotos,
  uploadProductPhotoImage,
} from "@/modules/catalog/server";
import type { ProductPhoto } from "@/modules/catalog";

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Enter the admin access code to continue." },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}

function accessUnavailableResponse() {
  return NextResponse.json(
    { error: "Admin access is not configured on this deployment." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

async function hasConfiguredAdminSession(): Promise<boolean> {
  return isAdminAccessConfigured() && hasAdminAccess();
}

function photoStorageUnavailableResponse() {
  return NextResponse.json(
    { error: "Connect a Vercel Blob store to this deployment to manage product photos." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

function photoOperationError(error: unknown, fallback: string) {
  if (error instanceof ProductPhotoStorageUnavailableError) {
    return photoStorageUnavailableResponse();
  }
  if (error instanceof ProductPhotoInputError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  console.error(fallback, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

function normalizePhoto(input: unknown): ProductPhoto {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new ProductPhotoInputError("Photo details must be an object.");
  }

  const photo = input as Record<string, unknown>;
  const src = typeof photo.src === "string" ? photo.src.trim() : "";
  const alt = typeof photo.alt === "string" ? photo.alt.trim() : "";

  if (!src || !alt) {
    throw new ProductPhotoInputError("A photo needs both a source and alt text.");
  }

  const width = Number(photo.width);
  const height = Number(photo.height);
  const order = Number(photo.order);

  return {
    id: typeof photo.id === "string" && photo.id ? photo.id : `photo-${Date.now()}`,
    src,
    alt,
    width: Number.isFinite(width) && width > 0 ? width : 1200,
    height: Number.isFinite(height) && height > 0 ? height : 1600,
    order: Number.isFinite(order) ? order : 0,
  };
}

async function handleUpload(formData: FormData): Promise<ProductPhoto[]> {
  const fileEntry = formData.get("file");
  const alt = String(formData.get("alt") ?? "").trim();
  const id = String(formData.get("id") ?? `photo-${Date.now()}`);

  if (!(fileEntry instanceof File) || fileEntry.size === 0) {
    throw new ProductPhotoInputError("Please choose an image file to upload.");
  }

  const src = await uploadProductPhotoImage(fileEntry);
  try {
    const photo = normalizePhoto({
      id,
      src,
      alt: alt || fileEntry.name || "Uploaded product photo",
      width: Number(formData.get("width")) || 1200,
      height: Number(formData.get("height")) || 1600,
      order: Number(formData.get("order")) || 0,
    });
    const photos = await getProductPhotos();
    return await saveProductPhotos([...photos, photo]);
  } catch (error) {
    try {
      await deleteProductPhotoImage(src);
    } catch (cleanupError) {
      console.error("Unable to clean up an uploaded image after its metadata save failed.", cleanupError);
      throw new Error("Photo details could not be saved, and the uploaded image could not be cleaned up.");
    }

    throw error;
  }
}

export async function GET() {
  if (!(await hasConfiguredAdminSession())) {
    return isAdminAccessConfigured() ? unauthorizedResponse() : accessUnavailableResponse();
  }
  if (!isProductPhotoStorageConfigured()) {
    return photoStorageUnavailableResponse();
  }

  try {
    const photos = await getProductPhotos();
    return NextResponse.json(photos, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return photoOperationError(error, "Unable to load product photos.");
  }
}

export async function POST(request: Request) {
  if (!(await hasConfiguredAdminSession())) {
    return isAdminAccessConfigured() ? unauthorizedResponse() : accessUnavailableResponse();
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  if (!isProductPhotoStorageConfigured()) {
    return photoStorageUnavailableResponse();
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      return NextResponse.json(await handleUpload(formData));
    }

    const payload: unknown = await request.json();
    const photos = await getProductPhotos();
    const nextPhotos = [...photos, normalizePhoto(payload)];
    const savedPhotos = await saveProductPhotos(nextPhotos);

    return NextResponse.json(savedPhotos);
  } catch (error) {
    return photoOperationError(error, "Unable to save product photos.");
  }
}

export async function PUT(request: Request) {
  if (!(await hasConfiguredAdminSession())) {
    return isAdminAccessConfigured() ? unauthorizedResponse() : accessUnavailableResponse();
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  if (!isProductPhotoStorageConfigured()) {
    return photoStorageUnavailableResponse();
  }

  try {
    const payload: unknown = await request.json();
    const photos = await getProductPhotos();
    const normalized = normalizePhoto(payload);
    const nextPhotos = photos.some((photo) => photo.id === normalized.id)
      ? photos.map((photo) => (photo.id === normalized.id ? normalized : photo))
      : [...photos, normalized];

    const savedPhotos = await saveProductPhotos(nextPhotos);
    return NextResponse.json(savedPhotos);
  } catch (error) {
    return photoOperationError(error, "Unable to update product photos.");
  }
}

export async function DELETE(request: Request) {
  if (!(await hasConfiguredAdminSession())) {
    return isAdminAccessConfigured() ? unauthorizedResponse() : accessUnavailableResponse();
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  if (!isProductPhotoStorageConfigured()) {
    return photoStorageUnavailableResponse();
  }

  try {
    const payload: unknown = await request.json();
    const photoId =
      typeof payload === "object" && payload !== null && "id" in payload &&
      typeof payload.id === "string"
        ? payload.id
        : "";

    if (!photoId) {
      throw new ProductPhotoInputError("Missing photo id.");
    }

    const photos = await getProductPhotos();
    const photoToDelete = photos.find((photo) => photo.id === photoId);
    const nextPhotos = photos.filter((photo) => photo.id !== photoId);
    const savedPhotos = await saveProductPhotos(nextPhotos);

    if (photoToDelete) {
      try {
        await deleteProductPhotoImage(photoToDelete.src);
      } catch (error) {
        console.error("Photo was removed from the catalog, but its image could not be deleted.", error);
        return NextResponse.json({
          photos: savedPhotos,
          warning: "The photo was removed, but its stored image could not be deleted.",
        });
      }
    }

    return NextResponse.json(savedPhotos);
  } catch (error) {
    return photoOperationError(error, "Unable to delete product photos.");
  }
}
