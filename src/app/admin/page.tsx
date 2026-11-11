import { Suspense } from "react";
import { connection } from "next/server";

import { hasAdminAccess } from "@/lib/admin-access";
import { AdminAccessPanel } from "./admin-access-panel";

export const instant = false;

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f5f3ee] p-6 text-[#161616]">
          <p role="status" className="mx-auto mt-12 max-w-lg text-sm text-[#595959]">
            Checking admin access...
          </p>
        </main>
      }
    >
      <AdminPageContent />
    </Suspense>
  );
}

async function AdminPageContent() {
  await connection();
  const hasAccess = await hasAdminAccess();

  return <AdminAccessPanel hasAccess={hasAccess} />;
}
