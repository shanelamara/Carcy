"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminAccessPanelProps = {
  hasAccess: boolean;
};

export function AdminAccessPanel({ hasAccess }: AdminAccessPanelProps) {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: accessCode }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setMessage(result.error ?? "Unable to verify the access code.");
        return;
      }

      router.push("/admin/photos");
    } catch {
      setMessage("Unable to reach the server. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/access", { method: "DELETE" });

      if (!response.ok) {
        setMessage("Unable to sign out. Try again.");
        return;
      }

      router.refresh();
    } catch {
      setMessage("Unable to reach the server. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f3ee] p-6 text-[#161616]">
      <section className="mx-auto mt-12 max-w-lg rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b3800]">
          Admin
        </p>
        <h1 className="text-4xl font-semibold tracking-[-0.06em]">
          {hasAccess ? "CarCy photo manager" : "Enter your access code"}
        </h1>
        <p className="mt-4 text-base text-[#595959]">
          {hasAccess
            ? "Manage the product photos shown on the storefront."
            : "Use the private admin access code to continue."}
        </p>

        {hasAccess ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/admin/photos"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#FF6500] px-5 py-3 text-sm font-medium text-[#161616] transition hover:bg-[#F58A2E]"
            >
              Manage product photos
            </Link>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSignOut}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d7d1ca] px-5 py-3 text-sm font-medium text-[#161616] transition hover:border-[#FF6500] disabled:opacity-60"
            >
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label htmlFor="admin-access-code" className="block text-sm font-medium">
              Access code
            </label>
            <input
              id="admin-access-code"
              type="password"
              autoComplete="current-password"
              required
              minLength={16}
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              className="w-full rounded-md border border-[#d7d1ca] bg-white p-3 text-base outline-none transition focus:border-[#FF6500] focus:ring-2 focus:ring-[#FF6500]/20"
              aria-describedby={message ? "admin-access-message" : undefined}
              aria-invalid={Boolean(message)}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#FF6500] px-5 py-3 text-sm font-medium text-[#161616] transition hover:bg-[#F58A2E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Checking..." : "Continue"}
            </button>
          </form>
        )}

        {message && (
          <p id="admin-access-message" role="status" className="mt-4 text-sm text-[#8b1e12]">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
