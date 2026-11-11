import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f5f3ee] p-6 text-[#161616]">
      <div className="mx-auto max-w-4xl rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b3800]">
          Admin
        </p>
        <h1 className="text-4xl font-semibold tracking-[-0.06em]">CarCy photo manager</h1>
        <p className="mt-4 max-w-xl text-base text-[#595959]">
          Update the product images shown on the storefront without building a full dashboard.
        </p>

        <div className="mt-8">
          <Link
            href="/admin/photos"
            className="inline-flex items-center justify-center rounded-full bg-[#FF6500] px-5 py-3 text-sm font-medium text-[#161616] transition hover:bg-[#F58A2E]"
          >
            Manage product photos
          </Link>
        </div>
      </div>
    </main>
  );
}
