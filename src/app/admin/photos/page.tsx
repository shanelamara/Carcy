import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { hasAdminAccess } from "@/lib/admin-access";
import { getProductPhotos } from "@/modules/catalog/server";
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

  const photos = await getProductPhotos();

  return <PhotosManager initialPhotos={photos} />;
}
