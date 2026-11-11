---
name: CarCy 3D Shop
description: A friendly, product-led storefront with expressive orange, clear product concepts, and the original CarCy identity.
colors:
  primary: "#FF6500"
  charcoal: "#161616"
  paper: "#FFFFFF"
  surface: "#F1F1F1"
  muted: "#595959"
  link: "#CF4D00"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(45px, 4.6vw, 72px)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.055em"
  heading:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(40px, 4.5vw, 68px)"
    fontWeight: 600
    lineHeight: 1.03
    letterSpacing: "-0.055em"
  body:
    fontFamily: "Figtree, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  control: "6px"
  image: "8px"
  dialog: "12px"
spacing:
  unit: "4px"
  small: "8px"
  medium: "16px"
  large: "24px"
  section: "128px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.control}"
    height: "48px"
---

## Direction

The user selected the [CarCy prototype](https://carcy-3d-shop-creative.lavishmast1.chatgpt.site/)
as the storefront's visual and copy reference and asked for a close match. This document
records that direction. The separately installed Taste Skill
([workspace skill](.agents/skills/design-taste-frontend/SKILL.md)) is used for
implementation discipline and browser checks; its generic, randomized art direction
does not replace this explicit reference.

Keep the current Next.js architecture, accessible local controls, product photos,
and Facebook inquiry flow. Do not copy the prototype as a flat HTML page or replace
color selection, reduced-motion behavior, or mobile navigation.

## Typography

Load Bricolage Grotesque for headings and Figtree for body copy with `next/font`.
Use the large, closely tracked display headings from the reference, with readable
16px body copy and a 20px lead. Section labels are compact but remain legible.
Minimum sizes at every breakpoint: 16px for form inputs (prevents iOS zoom), 14px
for reading text, links, and controls, and 12px for short labels only.
Avoid shrinking controls to fit; reflow them at narrow widths.

## Layout and color

- The fixed white navigation is 88px tall on desktop and 72px on phones. Show the
  circular logo beside the CarCy wordmark, section links, and
  Facebook contact action; use the accessible mobile dialog below 1024px.
- The full-height hero is vivid filament orange, with a large black-and-white
  headline, concise product introduction, dark Facebook action, and a centered
  3D organizer preview   on an open stage. Keep the small ground-level copy and cue to the product gallery.
- The white gallery section replaces the concept collection with actual,
  owner-supplied product photos in continuously moving vertical lanes. Use three
  lanes on desktop and two on phones, with reduced-motion support. A lane stops
  under the pointer or focus, and selecting a photo opens it large in a dialog.
- The personalization section uses a light-gray ground. Place its large heading
  on the left and the concept color preview plus three-step Facebook inquiry flow
  on the right. Stack the heading, image, then copy on phones.
- The maker story uses a charcoal ground, white title and copy, the intact original
  logo inside the orange orbit treatment, and the three brand values.
- The closing section returns to white, with a large inquiry headline, Facebook
  action, oversized orange CarCy 3D wordmark, and compact footer directory.

Use a 1440px maximum content width with 64px desktop gutters, 40px below 1200px,
and 24px below 640px. Main section headings, photography/illustrations, and
controls share aligned container edges. Desktop sections are approximately one
viewport tall; catalog and content sections may grow at responsive sizes to keep
all content usable.

## Product truth and imagery

Organizer renders remain concept previews. The storefront gallery uses selected
owner-supplied product photos; it must not imply confirmed inventory, pricing,
shipping, checkout, or personalization options. Keep product details clearly
subject to confirmation and preserve the Facebook inquiry destination.
Do not publish recognizable character/brand designs or personal portraits without
the needed rights and consent.

The owner-supplied product photos appear in a moving vertical carousel. Keep the
reduced-motion behavior.

Keep the supplied original logo intact and undistorted. Display it cropped to a
circle (the badge edge), never tinted or stretched. Product-category
illustrations and organizer renders remain
clearly illustrative until real product photography is supplied.

## Motion and accessibility

Retain the existing Framer Motion effects, including
reduced-motion and document-visibility handling. Keep motion short and
non-blocking. Preserve keyboard focus, accessible dialog focus handling, labels,
status announcements, touch targets, responsive image text alternatives, and
contrast across the orange, white, gray, and charcoal sections.
