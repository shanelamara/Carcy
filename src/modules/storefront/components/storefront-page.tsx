import "server-only";

import { unstable_noStore as noStore } from "next/cache";

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
  noStore();
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
