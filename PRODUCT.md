# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary audience is shoppers buying ready-made 3D-printed products, confirmed
by the owner. Administrators manage the products shown on the public website.

## Product Purpose

Present CarCy 3D Shop's available products through a public storefront and support
product management through an admin portal.

## Capabilities and Constraints

The storefront builds on the supplied prototype with an owner-supplied product
photo gallery, color previews, a motion control, and Facebook contact links.
A basic photo manager prototype at `/admin/photos` stores metadata in a local
JSON file and uploaded images in the public product-image directory. It has no
authentication and is suitable only for trusted local use. Durable persistence,
admin authentication, and product publication are planned.
The repository is a modular monolith: one Next.js app with private feature modules
and explicit public APIs. The frontend approach is component-first, TypeScript, Tailwind, and local
shadcn primitives customized by the website's design system. The owner requested an
animation-heavy storefront using Framer Motion, with reduced-motion support.

Checkout, payments, shipping, currencies, product categories, and inventory rules
remain undecided. The owner requested the prototype's personalization messaging
and Facebook inquiry flow; actual options and prices are still to be confirmed.
Do not imply that ordering, stock management, or fulfillment already works.

## Brand Commitments

Use the existing CarCy 3D Shop name and logo as the identity foundation. Preserve
the original asset at `src/assets/logos/logo.png`. The owner requested a design
system and branding based on this logo, then selected the
[CarCy prototype](https://carcy-3d-shop-creative.lavishmast1.chatgpt.site/) as the
storefront's visual and content reference. Its separately retained logo asset is
retained without replacing the original. After a later redesign, the owner requested
a close visual match to that reference. DESIGN.md governs the current appearance,
and the Taste Skill is installed as an implementation aid rather than a replacement
for the selected reference direction.

## Evidence on Hand

The supplied logo depicts a 3D printer, an orange printed cube, a friendly suited
character, and the CarCy 3D Shop lettering. Product photos have been supplied by
the owner and selected images appear in the storefront gallery. Product details,
reviews, prices, material claims, certifications, and delivery promises remain
unconfirmed; do not invent those as commercial evidence.
