---
name: nextjs-conventions
description: Implement, review, or refactor Carcy Shop's modular-monolith Next.js app using explicit feature-module boundaries, component-first development, Tailwind, customized shadcn primitives, validation, and code standards. Use for architecture, routes, UI, forms, product data, admin access, and server/client boundaries in this repository.
---

# Next.js conventions for Carcy Shop

Apply this skill when making relevant code changes in this repository. It describes the
intended architecture for a public product website and an admin portal that
manages the products displayed publicly. Apply these conventions as features are
built; the planned folders and backend capabilities below do not all exist yet.

Before making changes, read [the architecture](../../../docs/architecture.md) and
[the folder structure](../../../docs/folder-structure.md). Those documents own the
system boundaries, data flow, and file placement decisions; this skill owns the
implementation conventions. Resolve paths relative to this skill's directory.

For UI work, read [DESIGN.md](../../../DESIGN.md) and
[branding](../../../docs/branding.md). Use [PRODUCT.md](../../../PRODUCT.md) for
the confirmed audience and product scope. Keep shared visual changes in the theme
tokens and local shadcn primitives. When implementing UI, verify affected screens
in both themes; the design system is maintained as configuration and documentation.

## Project baseline

- Use Next.js App Router, TypeScript in strict mode, Tailwind CSS, and pnpm.
- Check `package.json`, `next.config.ts`, `tsconfig.json`, and `components.json` before relying on version-specific behavior. The current setup uses Next.js 16, React 19, Tailwind 4, Cache Components, and React Compiler.
- Use `@/` imports for shared source modules. Keep existing conventions within files being edited.
- Keep changes scoped to the requested feature. Do not add a database, authentication provider, state library, or alternate UI framework just to prepare for future work.

## Component-first development

- Keep business UI, contracts, and operations in their owning `src/modules/<module>` directory. Routes compose public module APIs; shared code never depends on modules. Follow the architecture's allowed dependency graph and keep it acyclic.
- Cross-module imports use `@/modules/<module>` for client-safe public exports, `/server` for guarded server APIs, and future `/actions` for callable actions. Use explicit named exports and relative imports for private files inside the owning module. Do not deep-import another module's internals or call local HTTP endpoints to bypass its API.
- Build pages by composing focused components. Keep route modules responsible for routing, server data loading, metadata, and composition; put substantial UI and interaction logic in components.
- Inspect existing components before creating new ones. Extend or reuse an existing component when its responsibility matches the need.
- Separate reusable UI primitives, business components, and route-specific composition. Avoid both large page components and trivial wrappers that add no meaningful behavior or reuse.
- Keep product display and product management components separate while sharing the product types, validation rules, and UI primitives they depend on.
- Use explicit, typed props and small public interfaces. Prefer composition over many boolean props that produce unrelated behaviors.
- Start with local state. Lift state only to the nearest common owner; introduce global state only for a demonstrated cross-route need.

## shadcn is the component foundation

- The local shadcn components in `src/components/ui` are the single source of truth for reusable UI primitives across the storefront and admin portal.
- Reuse these primitives for buttons, fields, dialogs, menus, tables, feedback, and similar controls. Do not build a parallel button/input/modal system or introduce a competing component library.
- If a needed primitive is missing, add the appropriate shadcn component using the existing `components.json` configuration, then customize its local source. Add only components required by the current task.
- This project uses the `base-nova` style with Base UI primitives and Lucide icons. Inspect the local component API before using examples; do not assume Radix-specific APIs such as `asChild` apply.
- Business components import from `@/components/ui/*`; keep direct Base UI usage inside the UI layer when extending primitives. Plain semantic HTML remains appropriate for structure, text, and native elements within composed components.
- Keep UI primitives independent of product data, authentication, database access, and route-specific business logic.
- Preserve accessibility semantics, keyboard behavior, focus management, disabled states, and the underlying primitive's composition API when customizing components.
- Do not blindly regenerate or overwrite customized shadcn files during updates. Review upstream changes and merge them with the website's design system intentionally.

## The website design system overrides shadcn defaults

The design hierarchy is: website theme tokens -> customized local shadcn
primitives -> composed business components -> page layouts. shadcn provides the
foundation; the website's design decisions control its final appearance.

- Define shared colors, typography, radii, and other theme tokens centrally in `src/app/globals.css`, using the existing CSS variables and Tailwind 4 `@theme inline` mapping.
- Prefer semantic utilities such as `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, and `border-border` over repeated hardcoded brand colors.
- Apply app-wide visual changes through tokens first. Change the local shadcn component's base styles or typed variants when the change belongs to a primitive.
- Use `class-variance-authority` for reusable component variants where appropriate and the existing `cn` utility for conditional classes. Reuse `@/lib/utils` rather than adding another class-merging implementation.
- Use Tailwind utilities for layout, spacing, responsive behavior, and component styling. Keep custom CSS for shared tokens, base styles, or cases utilities cannot express clearly; avoid parallel CSS-in-JS or inline-style systems. Dynamic inline values are acceptable when genuinely data-driven.
- Keep page-level `className` overrides for local layout needs. Repeated overrides of the same primitive's color, shape, or interaction style belong in the primitive or a shared variant.
- Storefront and admin may have different compositions and density while sharing the same tokens and primitive implementation. Use explicit variants or scoped tokens for intentional differences.
- Build responsive layouts and retain readable contrast, visible focus indicators, labels, and usable touch targets. Account for pending, empty, error, success, and disabled states.

## Folder and routing direction

Use [the folder structure document](../../../docs/folder-structure.md) to decide
where routes, components, schemas, and server functions belong. Create folders as
features need them, and keep that document updated when placement decisions change.

## File naming

- Use kebab-case for ordinary source files and folders: `product-card.tsx`, `product-form.tsx`, and `product-validation.ts`. Use `.tsx` for JSX and `.ts` for non-JSX code.
- Keep Next.js reserved names and syntax unchanged, including `page.tsx`, `layout.tsx`, `route.ts`, `not-found.tsx`, `[slug]`, route groups, and private folders. Preserve filenames required by tools and generators.
- Name React components and their prop types in PascalCase, such as `ProductCard` and `ProductCardProps`. Use camelCase for functions, variables, and object properties; use descriptive boolean names such as `isPending`, `hasErrors`, and `canEdit`.
- Name custom hooks with a `use` prefix and matching kebab-case files: `useProductFilters` in `use-product-filters.ts`. Call hooks only from React components or other hooks.
- Use descriptive domain names for helpers, schemas, and server operations, such as `product-schema.ts`, `productSchema`, and `updateProduct`. Keep names consistent with established modules rather than adding competing conventions.
- Prefer direct relative file imports inside a module. Use small explicit public entry points across module boundaries; keep client-safe `index.ts`, server-only `server.ts`, and future `actions.ts` separate.
- When tests are needed, use the existing runner's conventions and descriptive names such as `product-validation.test.ts` or `product-form.test.tsx`. Avoid renaming unrelated existing files merely to enforce naming rules.

## Code conventions

- Use function components and explicit TypeScript prop types. Prefer named exports for shared components and utilities; retain default exports where Next.js requires them or an existing integration expects them.
- Prefer `const`; use `let` only for reassigned values. Keep functions focused, use early returns for guard conditions, and choose names that explain business intent.
- Use `unknown` at untrusted boundaries and narrow or validate it before use. Avoid broad `any`, unchecked casts, non-null assertions, and error suppressions as substitutes for correct types and validation.
- Reuse domain types and infer validation input/output types from schemas when supported. Distinguish raw form input, validated mutation input, persisted records, and public product data when their shapes differ.
- Group imports consistently: framework/external modules, shared `@/` modules, then relative modules. Keep required side-effect imports in their intended order. Use type-only imports for types and avoid circular dependencies.
- Keep derived values out of state when they can be computed during rendering. Use effects for external synchronization, clean up subscriptions, and handle asynchronous failures explicitly.
- Handle expected validation and business errors with typed results. Keep unexpected errors in server logs and return safe, actionable messages to users; do not leak stack traces or database details.
- Use stable domain identifiers for list keys. Keep comments focused on constraints and reasons rather than restating the code; remove temporary logging and dead code introduced during the task.
- Follow configured ESLint rules and any existing formatter configuration. Until a formatter is configured, match the edited file's formatting. Do not introduce formatting tools, competing styles, or broad formatting-only changes incidentally.

## Form validation

- Keep reusable domain validation schemas in client-safe files inside the owning module, such as `src/modules/catalog/schemas/product-schema.ts`. Server-only database and authorization code must not be imported by those files.
- Reuse the same field rules on the client and server where practical. Reuse an existing schema library; if none exists and schema validation is needed, prefer Zod. Add dependencies only when implementing a feature that needs them.
- Treat all submitted data as untrusted. Parse and validate it again inside every Server Action or Route Handler before writing data, even when client validation already succeeded. Validation does not replace authorization.
- Explicitly map allowed input fields rather than spreading raw form data into a database update. Reject or discard protected fields such as roles, ownership, and internal status according to the operation's contract.
- Normalize and parse input deliberately: trim text where appropriate, distinguish missing values from empty strings, parse checkbox values explicitly, and reject invalid or non-finite numbers. Do not coerce an empty price to zero or the string `"false"` to `true` accidentally.
- Validate lengths, formats, ranges, enum values, and cross-field rules relevant to the operation. Enforce uniqueness and other integrity constraints in persistence as well as application checks, and map conflicts to useful errors.
- Compose forms from the local shadcn field, label, input, select, and feedback primitives. Use native form semantics and constraints where useful. For simple forms, prefer existing React/Next.js mechanisms; use an existing form library or React Hook Form when complex client state warrants it, without creating two competing owners of field state.
- Associate labels, descriptions, and errors with controls using stable IDs, `aria-describedby`, and `aria-invalid` as appropriate. Show specific field errors near their controls and form-level failures in a visible summary or status area. Do not rely on toasts alone for validation feedback.
- Show errors after a relevant interaction or attempted submission, and help users recover by focusing the first invalid field or an accessible error summary. Keep error timing consistent across forms.
- Preserve entered values on failure, expose pending state, and prevent duplicate submissions while pending. Reset, navigate, or show success only after the server confirms success. Use server-side idempotency when duplicate writes would have material consequences.
- Return consistent, typed validation results with field errors and a form-level message where needed. Keep framework redirects and not-found control flow outside catch blocks that would convert them into generic failures.
- When implementing meaningful validation, verify invalid input sent directly to the server, boundary values, cross-field failures, and successful submission. Include authorization rejection and persistence conflicts where applicable.

## Server and client boundaries

- Default to Server Components for layouts, pages, and data-driven UI. Add `"use client"` at the smallest practical boundary that needs state, events, effects, or browser APIs.
- Pass only data suitable for serialization and public exposure into Client Components. Keep credentials, database clients, and private fields in server-only modules; mark those modules with `import "server-only"` where appropriate.
- Fetch data directly through shared server functions in Server Components. Do not call the app's own HTTP endpoints for server rendering.
- Use Server Actions for UI-driven mutations when appropriate and Route Handlers for integrations or HTTP APIs. Validate and authorize at either entry point.
- Await request APIs and promise-based route props as required by the installed Next.js version. Prefer generated route prop types when available.
- With Cache Components enabled, explicitly distinguish shared cached data from request-specific work. Consult installed-version docs before choosing cache directives, invalidation APIs, or route configuration.
- Keep cookies, headers, sessions, and private admin data outside shared cache scopes. Place request-time work behind suitable `Suspense` boundaries when required.
- Use `next/link`, `next/image`, and `next/font` where appropriate. Export metadata from server route modules. Add manual memoization only for a demonstrated need with React Compiler enabled.

## Product management and public visibility

- Use one persistent product source for both the admin portal and storefront. Share server data access and validation rules; do not maintain separate production product arrays or treat browser localStorage as the product database.
- Keep database details behind server data access functions. Until persistence is selected, clearly identify fixtures and mock behavior without presenting them as working persistence.
- The catalog module owns product rules, persistence, and both public/admin product capabilities. Other modules consume its public APIs instead of querying its tables or creating a second product domain. Shared infrastructure may supply SDK clients, but domain repositories remain private to their owning module.
- Model publication/visibility explicitly when product management is implemented. Public queries must filter to publicly visible products, and direct product URLs must enforce the same visibility rule as product listings.
- Select only public fields for storefront responses. Keep drafts, internal notes, and other admin-only fields out of public payloads and client props.
- Validate product input on the server. When applicable, check names, unique slugs, image references, status transitions, and numeric constraints. Client validation improves feedback but does not replace server validation.
- If pricing is added, use a deliberate monetary representation such as integer minor units with a currency or a suitable decimal type; do not calculate persisted monetary values using floating-point arithmetic casually.
- After successful create, update, publish, unpublish, or delete operations, refresh or invalidate all affected public views, including lists and detail pages. Handle stale slugs and removed or unpublished products explicitly.
- Admin forms should preserve input on failure, show actionable field errors, prevent accidental duplicate submissions, and confirm destructive operations. Avoid optimistic publication or deletion unless failure recovery is implemented.

## Admin access

- Require authentication and authorization on the server for admin reads, mutations, and uploads. A hidden navigation item, client redirect, protected layout, or proxy alone does not secure an operation.
- Recheck permissions inside every Server Action, Route Handler, or shared server entry point that accesses protected data. Never trust a submitted role, user ID, or client-side permission flag.
- When uploads are implemented, validate file type and size server-side and restrict storage writes to authorized users. Do not expose storage credentials to the browser.
- Keep private environment variables server-side; use `NEXT_PUBLIC_` only for intentionally public values.

## Workflow and verification

- When the task includes committing, follow [commit conventions](../../../docs/commit-conventions.md) for the `action: message` format, action selection, and staging workflow.
- Before editing, inspect the affected route, existing UI primitives, theme tokens, and relevant server functions. Prefer the smallest change that fits this architecture.
- For application changes, run `pnpm lint` and `pnpm build` when the environment permits. Use existing relevant tests; add focused tests for meaningful behavior such as authorization, validation, and product visibility when those features are implemented.
- For UI changes, inspect desktop and mobile layouts and exercise keyboard navigation and changed interactions. When shared primitives or tokens change, check representative storefront and admin usages.
- For product management changes, verify persistence, unauthorized access rejection, draft exclusion from public lists and direct URLs, and public updates after admin mutations as applicable.
- Report what changed, checks actually performed, and material blockers. Documentation-only changes need link/content verification rather than an application build.
- Keep this guide aligned with architecture decisions as the project develops. It guides future code changes and does not authorize implementing unrelated planned features.

## Version-sensitive references

Prefer documentation bundled with the installed framework when available; otherwise
consult official documentation matching the installed version:

- [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js server and client components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js caching](https://nextjs.org/docs/app/getting-started/caching)
- [shadcn theming](https://ui.shadcn.com/docs/theming)
- [shadcn components](https://ui.shadcn.com/docs/components)
