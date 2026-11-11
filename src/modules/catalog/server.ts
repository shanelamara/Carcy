import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { defaultProductPhotos } from "./data/product-photos";
import type { ProductPhoto } from "./types/product-types";

const PRODUCT_PHOTOS_PATH = path.join(process.cwd(), "admin", ".data", "photos.json");

function isFileNotFound(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

export async function getProductPhotos(): Promise<ProductPhoto[]> {
  let file: string;

  try {
    file = await fs.readFile(PRODUCT_PHOTOS_PATH, "utf8");
  } catch (error) {
    if (!isFileNotFound(error)) {
      throw error;
    }

    await fs.mkdir(path.dirname(PRODUCT_PHOTOS_PATH), { recursive: true });
    await fs.writeFile(PRODUCT_PHOTOS_PATH, JSON.stringify(defaultProductPhotos, null, 2), "utf8");
    return defaultProductPhotos;
  }

  const parsed: unknown = JSON.parse(file);
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

export async function saveProductPhotos(photos: ProductPhoto[]) {
  const normalized = photos.map((photo, index) => ({
    ...photo,
    id: photo.id || `photo-${index + 1}`,
    order: photo.order ?? index,
    width: Number(photo.width) || 1200,
    height: Number(photo.height) || 1600,
  }));

  await fs.mkdir(path.dirname(PRODUCT_PHOTOS_PATH), { recursive: true });
  await fs.writeFile(PRODUCT_PHOTOS_PATH, JSON.stringify(normalized, null, 2), "utf8");

  return normalized;
}

export { conceptProducts } from "./data/concept-products";
