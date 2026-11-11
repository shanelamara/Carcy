import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { hasAdminAccess } from "@/lib/admin-access";
import {
  getProductPhotos,
  isProductPhotoStorageConfigured,
} from "@/modules/catalog/server";
import PhotosManager from "./photos-manager";

export const instant = false;

export default function AdminPhotosPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f5f3ee] p-6 text-[#161616]">
          <p role="status" className="mx-auto max-w-6xl text-sm text-[#595959]">
            Checking admin access...
          </p>
        </main>
      }
    >
      <AdminPhotosContent />
    </Suspense>
  );
}

async function AdminPhotosContent() {
  await connection();

  if (!(await hasAdminAccess())) {
    redirect("/admin");
  }

  if (!isProductPhotoStorageConfigured()) {
    return (
      <main className="min-h-screen bg-[#f5f3ee] p-6 text-[#161616]">
        <section className="mx-auto mt-12 max-w-2xl rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-[-0.05em]">
            Photo storage isn’t connected
          </h1>
          <p className="mt-4 text-base text-[#595959]">
            In Vercel, open this project’s Storage tab, create and connect a public Blob store, then
            redeploy. The deployment needs BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN in its environment.
          </p>
        </section>
      </main>
    );
  }

  const photos = await getProductPhotos();

  return <PhotosManager initialPhotos={photos} />;
}
