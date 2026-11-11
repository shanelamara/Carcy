import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], display: "swap" });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "CarCy 3D Shop — Personalized 3D-printed products",
  other: { "page-type": "product", "site-kind": "other" },
  description: "Personalized 3D-printed accessories, gifts and everyday essentials from CarCy 3D Shop. Contact us on Facebook to order.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-type="product" data-radius="soft" data-buttons="block" data-motion=""
      className={`${bricolage.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
