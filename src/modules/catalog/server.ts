import "server-only";

import { del, list, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import { defaultProductPhotos } from "./data/product-photos";
import type { ProductPhoto } from "./types/product-types";

const PRODUCT_PHOTOS_PATH = path.join(process.cwd(), "admin", ".data", "photos.json");
const PRODUCT_IMAGE_DIRECTORY = path.join(process.cwd(), "public", "images", "products");
const PRODUCT_BLOB_PREFIX = "carcy/";
const PRODUCT_PHOTOS_BLOB_PREFIX = `${PRODUCT_BLOB_PREFIX}metadata/product-photos-`;
const PRODUCT_IMAGES_BLOB_PREFIX = `${PRODUCT_BLOB_PREFIX}products/`;
const MAX_PRODUCT_IMAGE_SIZE = 4 * 1024 * 1024;
const IMAGE_TYPES = {
  "image/jpeg": { extension: "jpg", signature: [0xff, 0xd8, 0xff] },
  "image/png": { extension: "png", signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  "image/webp": { extension: "webp", signature: [0x52, 0x49, 0x46, 0x46] },
} as const;

export class ProductPhotoStorageUnavailableError extends Error {
  constructor() {
    super("Connect a Vercel Blob store to this deployment to manage product photos.");
    this.name = "ProductPhotoStorageUnavailableError";
  }
}

export class ProductPhotoInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductPhotoInputError";
  }
}

function isBlobStorageConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN),
  );
}

export function isProductPhotoStorageConfigured(): boolean {
  return !process.env.VERCEL || isBlobStorageConfigured();
}

function shouldUseBlobStorage(): boolean {
  if (isBlobStorageConfigured()) {
    return true;
  }

  if (process.env.VERCEL) {
    throw new ProductPhotoStorageUnavailableError();
  }

  return false;
}

function isFileNotFound(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

function parseProductPhotos(parsed: unknown): ProductPhoto[] {
  if (!Array.isArray(parsed)) {
    throw new Error("Product photo data must be an array.");
  }

  return parsed.map((photo: unknown, index) => {
    if (typeof photo !== "object" || photo === null || Array.isArray(photo)) {
      throw new Error(`Product photo ${index + 1} must be an object.`);
    }

    const storedPhoto = photo as Record<string, unknown>;
    if (
      typeof storedPhoto.id !== "string" ||
      typeof storedPhoto.src !== "string" ||
      typeof storedPhoto.alt !== "string" ||
      !storedPhoto.src.trim() ||
      !storedPhoto.alt.trim()
    ) {
      throw new Error(`Product photo ${index + 1} is missing required fields.`);
    }

    const width = Number(storedPhoto.width);
    const height = Number(storedPhoto.height);
    const order = Number(storedPhoto.order ?? index);

    return {
      id: storedPhoto.id,
      src: storedPhoto.src,
      alt: storedPhoto.alt,
      width: Number.isFinite(width) && width > 0 ? width : 1200,
      height: Number.isFinite(height) && height > 0 ? height : 1600,
      order: Number.isFinite(order) ? order : index,
    };
  });
}

async function getBlobProductPhotos(): Promise<ProductPhoto[]> {
  const { blobs } = await list({ prefix: PRODUCT_PHOTOS_BLOB_PREFIX, limit: 1000 });
  const metadataBlob = blobs
    .filter((blob) => blob.pathname.startsWith(PRODUCT_PHOTOS_BLOB_PREFIX))
    .sort((left, right) => right.uploadedAt.getTime() - left.uploadedAt.getTime())[0];

  if (!metadataBlob) {
    return getLocalProductPhotos();
  }

  const response = await fetch(metadataBlob.url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to read product photo data from Vercel Blob.");
  }

  return parseProductPhotos(await response.json());
}

async function getLocalProductPhotos(): Promise<ProductPhoto[]> {
  let file: string;

  try {
    file = await fs.readFile(PRODUCT_PHOTOS_PATH, "utf8");
  } catch (error) {
    if (isFileNotFound(error)) {
      return defaultProductPhotos;
    }

    throw error;
  }

  return parseProductPhotos(JSON.parse(file) as unknown);
}

export async function getProductPhotos(): Promise<ProductPhoto[]> {
  if (isBlobStorageConfigured()) {
    return getBlobProductPhotos();
  }

  return getLocalProductPhotos();
}

export async function saveProductPhotos(photos: ProductPhoto[]): Promise<ProductPhoto[]> {
  const normalized = photos.map((photo, index) => ({
    ...photo,
    id: photo.id || `photo-${index + 1}`,
    order: photo.order ?? index,
    width: Number(photo.width) || 1200,
    height: Number(photo.height) || 1600,
  }));
  const serialized = JSON.stringify(normalized, null, 2);

  if (shouldUseBlobStorage()) {
    const { blobs } = await list({ prefix: PRODUCT_PHOTOS_BLOB_PREFIX, limit: 1000 });
    await put(`${PRODUCT_PHOTOS_BLOB_PREFIX}${randomUUID()}.json`, serialized, {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });

    const previousMetadata = blobs
      .filter((blob) => blob.pathname.startsWith(PRODUCT_PHOTOS_BLOB_PREFIX))
      .map((blob) => blob.url);
    if (previousMetadata.length > 0) {
      try {
        await del(previousMetadata);
      } catch (error) {
        console.error("Unable to clean up older product photo metadata blobs.", error);
      }
    }
  } else {
    await fs.mkdir(path.dirname(PRODUCT_PHOTOS_PATH), { recursive: true });
    await fs.writeFile(PRODUCT_PHOTOS_PATH, serialized, "utf8");
  }

  return normalized;
}

function isValidImageSignature(file: File, bytes: Buffer): boolean {
  const imageType = IMAGE_TYPES[file.type as keyof typeof IMAGE_TYPES];
  if (!imageType || !imageType.signature.every((byte, index) => bytes[index] === byte)) {
    return false;
  }

  return file.type !== "image/webp" || bytes.toString("ascii", 8, 12) === "WEBP";
}

export async function uploadProductPhotoImage(file: File): Promise<string> {
  if (file.size === 0 || file.size > MAX_PRODUCT_IMAGE_SIZE) {
    throw new ProductPhotoInputError("Choose an image no larger than 4 MB.");
  }

  const imageType = IMAGE_TYPES[file.type as keyof typeof IMAGE_TYPES];
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!imageType || !isValidImageSignature(file, bytes)) {
    throw new ProductPhotoInputError("Choose a valid JPEG, PNG, or WebP image.");
  }

  const fileName = `upload-${randomUUID()}.${imageType.extension}`;
  if (shouldUseBlobStorage()) {
    const blob = await put(`${PRODUCT_IMAGES_BLOB_PREFIX}${fileName}`, bytes, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });
    return blob.url;
  }

  await fs.mkdir(PRODUCT_IMAGE_DIRECTORY, { recursive: true });
  await fs.writeFile(path.join(PRODUCT_IMAGE_DIRECTORY, fileName), bytes);
  return `/images/products/${fileName}`;
}

export async function deleteProductPhotoImage(src: string): Promise<void> {
  if (shouldUseBlobStorage()) {
    let url: URL;
    try {
      url = new URL(src);
    } catch {
      return;
    }

    const isManagedBlob =
      url.protocol === "https:" &&
      url.hostname.endsWith(".public.blob.vercel-storage.com") &&
      url.pathname.startsWith(`/${PRODUCT_IMAGES_BLOB_PREFIX}upload-`);

    if (isManagedBlob) {
      await del(url.toString());
    }
    return;
  }

  const localImagePattern = /^\/images\/products\/upload-[0-9a-f-]{36}\.(jpg|png|webp)$/i;
  if (!localImagePattern.test(src)) {
    return;
  }

  try {
    await fs.unlink(path.join(process.cwd(), "public", src.slice(1)));
  } catch (error) {
    if (!isFileNotFound(error)) {
      throw error;
    }
  }
}

export { conceptProducts } from "./data/concept-products";
