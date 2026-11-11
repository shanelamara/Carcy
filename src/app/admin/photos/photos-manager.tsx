"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import type { ProductPhoto } from "@/modules/catalog";

type PhotoFormState = ProductPhoto & { id: string };
type PhotosManagerProps = { initialPhotos: ProductPhoto[] };

const emptyPhoto: PhotoFormState = {
  id: "",
  src: "/images/products/",
  alt: "",
  width: 1200,
  height: 1600,
  order: 0,
};

export default function PhotosManager({ initialPhotos }: PhotosManagerProps) {
  const [photos, setPhotos] = useState<ProductPhoto[]>(initialPhotos);
  const [form, setForm] = useState<PhotoFormState>(emptyPhoto);
  const [status, setStatus] = useState(
    initialPhotos.length > 0 ? "Photos loaded." : "No photos yet. Add the first one.",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const hasEditingId = useMemo(() => Boolean(form.id), [form.id]);

  const loadPhotos = async () => {
    try {
      const response = await fetch("/api/admin/photos");
      const nextPhotos = (await response.json()) as ProductPhoto[];
      setPhotos(nextPhotos);
      setStatus(nextPhotos.length > 0 ? "Photos loaded." : "No photos yet. Add the first one.");
    } catch {
      setStatus("Could not load photos.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...form,
        id: form.id || `photo-${Date.now()}`,
        width: Number(form.width) || 1200,
        height: Number(form.height) || 1600,
      };

      const response = await fetch("/api/admin/photos", {
        method: hasEditingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as ProductPhoto[] | { error?: string };

      if (!response.ok) {
        throw new Error((result as { error?: string }).error ?? "Unable to save the photo.");
      }

      setPhotos(Array.isArray(result) ? result : photos);
      setForm(emptyPhoto);
      setStatus(hasEditingId ? "Photo updated." : "Photo added.");
      await loadPhotos();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save the photo.";
      setStatus(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", form.alt || file.name);
      formData.append("id", form.id || `photo-${Date.now()}`);
      formData.append("width", String(form.width || 1200));
      formData.append("height", String(form.height || 1600));
      formData.append("order", String(form.order || 0));

      const response = await fetch("/api/admin/photos", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as ProductPhoto[] | { error?: string };

      if (!response.ok) {
        throw new Error((result as { error?: string }).error ?? "Unable to upload the image.");
      }

      setForm(emptyPhoto);
      setStatus("Image uploaded successfully.");
      await loadPhotos();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to upload the image.";
      setStatus(message);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleEdit = (photo: ProductPhoto) => {
    setForm({ ...photo, id: photo.id });
    setStatus(`Editing ${photo.alt}`);
  };

  const handleDelete = async (photoId: string) => {
    try {
      const response = await fetch("/api/admin/photos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: photoId }),
      });

      if (!response.ok) {
        throw new Error("Unable to delete the photo.");
      }

      await loadPhotos();
      setStatus("Photo removed.");
      if (form.id === photoId) {
        setForm(emptyPhoto);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete the photo.";
      setStatus(message);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f3ee] p-6 text-[#161616]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b3800]">Admin</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">Product photo manager</h1>
          <p className="mt-3 text-sm text-[#595959]">
            Use a local image path like /images/products/photo-xx.jpg, then save to update the storefront.
          </p>
        </header>

        <section className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1.45fr]">
          <form
            onSubmit={handleSubmit}
            className="min-w-0 rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">
              {hasEditingId ? "Edit photo" : "Add a photo"}
            </h2>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#161616]">Upload an image</label>
                <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#d7d1ca] bg-white px-4 py-2 text-sm font-medium text-[#161616] transition hover:border-[#FF6500]">
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  {isUploading ? "Uploading..." : "Choose photo to upload"}
                </label>
              </div>

              <label className="block text-sm font-medium text-[#161616]">
                Image path
                <input
                  value={form.src}
                  onChange={(event) => setForm((current) => ({ ...current, src: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-[#d7d1ca] bg-[#fff] p-3 text-sm outline-none ring-0 transition focus:border-[#FF6500]"
                  placeholder="/images/products/photo-17.jpg"
                />
              </label>

              <label className="block text-sm font-medium text-[#161616]">
                Alt text
                <input
                  value={form.alt}
                  onChange={(event) => setForm((current) => ({ ...current, alt: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-[#d7d1ca] bg-[#fff] p-3 text-sm outline-none transition focus:border-[#FF6500]"
                  placeholder="Purple personalized keychain shown in a studio shot"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[#161616]">
                  Width
                  <input
                    type="number"
                    value={form.width}
                    onChange={(event) => setForm((current) => ({ ...current, width: Number(event.target.value) || 1200 }))}
                    className="mt-1 w-full rounded-md border border-[#d7d1ca] bg-[#fff] p-3 text-sm outline-none transition focus:border-[#FF6500]"
                  />
                </label>

                <label className="block text-sm font-medium text-[#161616]">
                  Height
                  <input
                    type="number"
                    value={form.height}
                    onChange={(event) => setForm((current) => ({ ...current, height: Number(event.target.value) || 1600 }))}
                    className="mt-1 w-full rounded-md border border-[#d7d1ca] bg-[#fff] p-3 text-sm outline-none transition focus:border-[#FF6500]"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-full bg-[#FF6500] px-5 py-3 text-sm font-medium text-[#161616] transition hover:bg-[#F58A2E] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? "Saving..." : hasEditingId ? "Save changes" : "Add photo"}
              </button>

              {hasEditingId && (
                <button
                  type="button"
                  onClick={() => setForm(emptyPhoto)}
                  className="inline-flex items-center justify-center rounded-full border border-[#d7d1ca] bg-white px-5 py-3 text-sm font-medium text-[#161616] transition hover:border-[#FF6500]"
                >
                  Cancel
                </button>
              )}
            </div>

            <p className="mt-4 text-sm text-[#595959]">{status}</p>
          </form>

          <section className="min-w-0 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">Current photos</h2>

            <div className="mt-6 space-y-4">
              {photos.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[#d7d1ca] p-6 text-sm text-[#595959]">
                  No photos saved yet.
                </p>
              ) : (
                photos.map((photo) => (
                  <div key={photo.id} className="flex gap-4 rounded-xl border border-[#d7d1ca] p-3">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={96}
                      height={96}
                      className="h-24 w-24 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#161616]">{photo.alt}</p>
                      <p className="mt-1 break-all text-xs text-[#595959]">{photo.src}</p>
                      <p className="mt-1 text-xs text-[#595959]">
                        {photo.width} × {photo.height}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(photo)}
                        className="rounded-full border border-[#d7d1ca] px-3 py-2 text-xs font-medium text-[#161616] transition hover:border-[#FF6500]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(photo.id)}
                        className="rounded-full border border-[#d7d1ca] px-3 py-2 text-xs font-medium text-[#cf4d00] transition hover:border-[#cf4d00]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
