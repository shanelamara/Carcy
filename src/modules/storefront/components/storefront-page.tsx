import "server-only";

import { connection } from "next/server";

import { ProductPhotoGallery } from "@/modules/catalog";
import { getProductPhotos } from "@/modules/catalog/server";
import { PersonalizationSection } from "./personalization-section";
import { ScrollToTop } from "./scroll-to-top";
import { StorefrontFooter } from "./storefront-footer";
import { StorefrontHeader } from "./storefront-header";
import { StorefrontHero } from "./storefront-hero";
import { StorefrontMotionProvider } from "./storefront-motion-provider";
import { StorefrontStory } from "./storefront-story";

export async function StorefrontPage() {
  // Blob reads need request-time OIDC credentials, so never prerender this at build.
  await connection();
  const photos = await getProductPhotos();

  return (
    <StorefrontMotionProvider>
      <StorefrontHeader />
      <main id="home">
        <StorefrontHero />
        <ProductPhotoGallery photos={photos} />
        <PersonalizationSection />
        <StorefrontStory />
      </main>
      <StorefrontFooter />
      <ScrollToTop />
    </StorefrontMotionProvider>
  );
}
