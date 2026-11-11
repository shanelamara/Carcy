# Storefront prototype implementation

Visual source: [the owner-supplied CarCy prototype](https://carcy-3d-shop-creative.lavishmast1.chatgpt.site/).
The prototype supplied the initial assets and inquiry interactions. The owner later
requested animation-heavy Framer Motion and then asked for a close visual match to
the same prototype. DESIGN.md governs the current appearance and adapts that
reference to the existing Next.js components and interactions.

## Implemented scope

The home page composes fixed navigation, orange product-stage hero, concept collection,
gray personalization preview, original-logo story, and contact footer. Contact actions use the
prototype's `https://www.facebook.com/CarCyPrinting` destination. No message is
automatically sent.

| Interaction | Local implementation |
| --- | --- |
| Collection filters | Selected category combines with the search query |
| Search | Case-insensitive collection/description matching |
| Sorting | Featured order, name ascending, name descending |
| Empty results | Explanation and clear-filters action |
| Details | Shared shadcn Dialog with keyboard focus management |
| Concept colors | Orange, white, and black views exported from the prototype |
| Motion | Framer Motion entrances, parallax, layout/filter transitions, color transitions, loops, and reading progress; reduced motion |
| Mobile navigation | Shared dialog; section links close it |

## Assets and data

`public/images` contains concept SVG illustrations and organizer color renders
exported from the supplied prototype. Selected owner-supplied Drive photos are
stored in `public/images/products` and displayed in the storefront's moving
vertical gallery; they do not confirm product details, prices, or stock.
Character/brand-themed photos and a personal portrait were left out pending
permission and consent. The prototype logo is retained in
`src/assets/logos/prototype-logo.png`; the original
`logo.png` is unchanged and now appears in the brand section. Navigation uses text.

The live organizer is a procedural Three.js recreation with the original SVG as
its no-WebGL fallback. Geometry, lighting, and motion are recreated rather than
imported from the original renderer, so animation frames are not pixel-identical.

`src/modules/catalog/data/concept-products.ts` retains explicitly labeled
fixtures, but the public storefront now displays the selected product photos
instead. A future admin/data integration must replace fixture boundaries with
authorized server reads and public visibility filtering. This storefront adds
no database, authentication, checkout, or order submission.

## Future changes

Use [DESIGN.md](../DESIGN.md) for the updated visual system and
[the folder structure](folder-structure.md) for placement. Preserve the current design system and honest concept qualifiers. Changes in commercial claims or offerings need
confirmed product information.
