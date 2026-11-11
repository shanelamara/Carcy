import "server-only";

import { ProductPhotoGallery } from "@/modules/catalog";
import { productPhotos } from "@/modules/catalog/server";
import { PersonalizationSection } from "./personalization-section";
import { ScrollToTop } from "./scroll-to-top";
import { StorefrontFooter } from "./storefront-footer";
import { StorefrontHeader } from "./storefront-header";
import { StorefrontHero } from "./storefront-hero";
import { StorefrontMotionProvider } from "./storefront-motion-provider";
import { StorefrontStory } from "./storefront-story";

export function StorefrontPage() {
  return (
    <StorefrontMotionProvider>
      <StorefrontHeader />
      <main id="home">
        <StorefrontHero />
        <ProductPhotoGallery photos={productPhotos} />
        <PersonalizationSection />
        <StorefrontStory />
      </main>
      <StorefrontFooter />
      <ScrollToTop />
    </StorefrontMotionProvider>
  );
}
