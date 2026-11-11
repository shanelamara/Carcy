# Folder structure

The repository uses a [modular monolith](architecture.md). Next.js owns routing;
feature modules own their UI, contracts, data, and future business operations.
Shared shadcn primitives remain in their configured location. Follow the
[Next.js conventions skill](../.agents/skills/nextjs-conventions/SKILL.md) for
naming, validation, styling, and code standards.

## Current structure

```text
src/
  app/
    page.tsx                       # Thin route importing storefront/server
    layout.tsx                     # Root document, fonts, metadata
    globals.css                    # Shared tokens and storefront styles
    favicon.ico                    # Small, brand-colored browser favicon
    icon.svg                       # Editable vector source for the favicon
    admin/
      page.tsx                     # Shared access-code gate
      admin-access-panel.tsx       # Login and sign-out controls
      photos/
        page.tsx                   # Loads initial photo data
        photos-manager.tsx         # Route-specific photo editing UI
    api/
      admin/access/route.ts        # Access-code session endpoint
      admin/photos/route.ts        # Photo manager API
  modules/
    catalog/
      index.ts                     # Public client-safe UI and types
      server.ts                    # Catalog reads and persistent photo storage
      components/
        product-catalog.tsx
        product-card.tsx
        product-photo-gallery.tsx
      config/
        collection-filters.ts      # Client-safe collection options
      data/
        concept-products.ts        # Private guarded concept fixtures
        product-photos.ts          # Private guarded photo gallery data
      types/
        product-types.ts
    storefront/
      server.ts                    # Public server page composition
      components/
        storefront-page.tsx        # Composes catalog via its public APIs
        storefront-header.tsx
        storefront-hero.tsx
        storefront-footer.tsx
        scroll-to-top.tsx          # Floating back-to-top button
        storefront-story.tsx
        storefront-motion-provider.tsx
        personalization-section.tsx
        organizer-preview.tsx
      config/
        navigation.ts              # Private storefront navigation
  components/
    ui/                            # Shared customized shadcn primitives
    shared/
      facebook-link.tsx             # Shared contact composition
      motion-provider.tsx           # Reduced motion, document visibility
      motion-effects.tsx            # Reusable entrance and parallax effects
  config/
    site.ts                        # Site-wide contact destination
  lib/
    utils.ts                       # Generic class utility
    admin-access.ts                # Shared-code session and origin checks
  assets/logos/                    # Original and prototype logos
public/images/                     # Public prototype illustrations and product photos
```

Root configuration includes `.env.example` (admin access-code and Blob setup),
`package.json`, `pnpm-lock.yaml`, `components.json`,
`next.config.ts`, `tsconfig.json`, and `eslint.config.mjs`. `AGENTS.md` points agents
to architecture, placement, design, product, and commit conventions. The redesign
selection is recorded in `.taste-skill/plan.md`; DESIGN.md remains the ongoing
visual authority rather than the deal-history files.

## Placement rules

| If adding... | Place it in... |
| --- | --- |
| A URL, layout, or Route Handler | The appropriate `src/app` route segment; delegate business behavior to a module |
| Product UI for storefront or admin | `src/modules/catalog/components`, grouping by audience when useful |
| A storefront-specific presentation component | `src/modules/storefront/components` |
| Product schemas or pure types | `src/modules/catalog/schemas` or `types`, with no server imports |
| A catalog use case or query service | `src/modules/catalog/application`, when introduced |
| Product business rules or value objects | `src/modules/catalog/domain`, when introduced |
| Product persistence queries or repository | `src/modules/catalog/infrastructure`, when introduced |
| A reusable styled primitive | `src/components/ui`, using the existing shadcn setup |
| A reusable non-domain composition | `src/components/shared` |
| Application-wide constants | `src/config`; feature-only constants stay in their module |
| Generic technical helpers | `src/lib`; business helpers stay in their module |
| Shared SDK clients/connections | `src/infrastructure`, after selecting actual infrastructure |
| A feature hook or behavior test | Colocated inside its owning module |

Create application/domain/infrastructure folders only as real responsibilities
appear. A small module may use focused files; it does not need empty layers,
repositories, dependency injection containers, or an event bus.

## Module imports

```tsx
// Route -> public server composition
import { StorefrontPage } from "@/modules/storefront/server";

// Storefront -> explicitly allowed catalog APIs
import { ProductPhotoGallery } from "@/modules/catalog";
import { productPhotos } from "@/modules/catalog/server";

// Inside catalog -> private internal file, using a relative path
import type { ConceptProduct } from "../types/product-types";

// Any module -> shared primitive
import { Button } from "@/components/ui/button";
```

Do not import `@/modules/catalog/components/product-card` from another module or
route. Do not reach into another module with `../../catalog/...`. Shared code must
not depend on modules or `src/app`. Allowed module dependencies are recorded in
`eslint.config.mjs`; new modules start with none. See [architecture](architecture.md)
for the ownership graph and the limits of static import enforcement.

Use `index.ts` only as a small explicit client-safe public API. Put guarded server
exports in `server.ts`, and future callable actions in a separate `actions.ts` with
`"use server"`. Never combine these into one barrel. A module with only server
consumers needs no `index.ts`; `storefront` currently follows that pattern.

## Planned routes and capabilities

As features are authorized, a `(storefront)` route group can contain public home,
product listing, and `[slug]` detail routes; `(admin)/admin` can contain the admin
shell and product management routes. Route groups add no URL segment; the explicit
`admin` directory establishes `/admin`. Move the starter home route when grouping
it, rather than creating two pages that resolve to `/`.

The admin routes compose catalog management APIs and the future identity module;
they do not own a separate product repository. Authentication and media modules
are created only when their actual features are implemented. No such modules,
admin endpoints, or database are currently scaffolded.

Keep Next.js reserved files (`page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`,
`error.tsx`, `not-found.tsx`) in `src/app`. One-route composition helpers may use
private `_components` there, but reusable business UI belongs to its module.
Preserve kebab-case source filenames, PascalCase components, and `use-*.ts` hooks.
Never store private admin media in `public`.

See [prototype implementation](prototype-implementation.md) for asset provenance
and the concept-data limitation. Update this document with actual file placement
changes instead of maintaining a second folder tree in the skill.
