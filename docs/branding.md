# CarCy 3D Shop branding

This is the working brand direction derived from the supplied logo. Product truth
lives in [PRODUCT.md](../PRODUCT.md); interface values and rules live in
[DESIGN.md](../DESIGN.md). The design system is maintained as theme configuration
and documentation, without an in-app showcase route or preview components.

## Storefront design update

The original prototype supplied the concept imagery and Facebook inquiry flow.
The owner requested a later close match to that prototype. [DESIGN.md](../DESIGN.md)
now governs appearance: Bricolage Grotesque and Figtree, an orange product hero,
a white collection, gray personalization section, charcoal story, and white close.
The original logo appears intact in the brand section; compact navigation uses a
plain-text identifier. Both original and prototype assets remain preserved.
The Taste Skill is available in the workspace for implementation guidance, while
the owner-selected CarCy reference remains the visual authority. The existing
animation-heavy Framer Motion requirement remains in force.

## Identity and audience

Write the full name **CarCy 3D Shop** and the short name **CarCy**, preserving the
capital C in the second syllable. The primary audience is shoppers buying ready-made
3D-printed products. The public website should help them understand the object,
inspect its details, and find available products.

The brand direction is **a friendly maker's workshop**: the printer supplies
precision, the mascot supplies approachability, and the vivid orange supplies
energy. Present finished objects clearly; avoid making the experience feel like
industrial procurement software or a speculative technology service.

## Brand personality

| Quality | How it appears |
| --- | --- |
| Approachable | Plain language, helpful explanations, warm neutral surfaces |
| Inventive | Product-led imagery and one vivid orange accent |
| Precise | Clear dimensions, material details, consistent layout and controls |
| Dependable | Honest availability and explicit feedback after actions |

These are creative intentions, not claims about certification, tolerances,
sustainability, material safety, or fulfillment performance.

## Voice and copy

Use short, concrete sentences. Name the product and explain its purpose before
describing its production technique. Explain unfamiliar material terms when the
information is available. Use a friendly tone without slang or baby talk.

Proposed brand line: **Small objects. Big personality.** This is editorial copy,
not an existing trademark or a claim about every future product category.

| Context | Example wording |
| --- | --- |
| Public catalog action | Browse products |
| Product detail action | View product |
| Unavailable catalog | No products to show yet. Check back soon. |
| Admin draft action | Save draft |
| Admin publication action | Publish product |
| Validation | Enter a product name. |
| Recoverable failure | We couldn't save your changes. Try again. |

Use purchase actions such as "Add to cart" only once the associated flow exists.
Do not add "custom orders," "food-safe," "eco-friendly," "premium quality,"
"in stock," shipping promises, or customer proof without supporting product data.

## Logo usage

The original is a 1254 x 1254 raster badge with a solid black background. It is
not a transparent cutout or a vector master. Keep the source square and
undistorted; do not apply CSS inversion, recoloring, or artificial drop shadows.
The owner-selected reference uses the unmodified badge at compact header/footer
sizes and a circular CSS mask in the larger story treatment; preserve those
reference-specific compositions without editing the source image.

- Use the full badge on packaging, brand introductions, or generous identity areas.
- Use at least 128 CSS pixels in digital layouts as a starting minimum and inspect actual legibility. The selected reference's 64px navigation and 56px footer usages are compact exceptions paired with the plain-text brand name. Use about 256 pixels or larger when the small "3D SHOP" lettering must be read.
- Leave clear space of at least one eighth of the displayed badge width around it.
- Place it on black, or show its complete black square intentionally within a neutral layout. The background must not be removed with blend modes.
- Do not shrink the detailed badge into a 16–32 pixel favicon or tiny navigation icon.
- In compact navigation, a plain-text "CarCy 3D Shop" identifier is acceptable until a purpose-made compact mark is approved. It is a text label, not a recreated version of the sculpted wordmark.

A transparent master, vector master, simplified symbol, favicon, and independent
mascot assets remain future production work. The browser favicon is a simple
typographic "C" on the brand orange; it is a small-tab utility, not an approved
logo or compact identity mark. Keep the full logo intact, and do not extract or
approximate a symbol from the badge.

## Photography and visual language

Use actual product photography on warm gray or charcoal backgrounds. Show one
clear hero angle, useful scale, and detail views when available. Keep object color
accurate; the interface orange must not tint or replace the product's actual color.
Only show a visible printed-layer texture when it comes from the photographed object.

The logo is the expressive, dimensional asset. Keep interface controls flat and
precise rather than copying the badge's bevels, metallic gradients, or extrusion.
Use the mascot within the full logo until a separate asset exists. Future mascot
usage may support onboarding or empty states, while product photography remains primary.

## Brand governance

Use [DESIGN.md](../DESIGN.md) for colors, contrast, type, spacing, and component
recipes. Update this document when audience, naming, messaging, or logo usage is
intentionally changed. Brand expression can vary between storefront and admin;
the shared primitives and tokens remain the same.
