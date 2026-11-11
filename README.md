This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin access code

The admin photo manager requires `ADMIN_ACCESS_CODE`. A private local value is
configured in `.env.local`; do not commit that file. For another environment,
copy `.env.example` to `.env.local` and set a unique random code of at least 16
characters. Generate one with:

```bash
node -e "console.log(require('node:crypto').randomBytes(24).toString('base64url'))"
```

Set the same variable in your deployment's secret environment configuration.
The shared code is a basic gate, not individual accounts or rate-limited
authentication.

## Product photo storage

Vercel deployments need persistent storage for admin photo uploads and edits.
In the Vercel project, open **Storage**, create a **public Blob** store, and
connect it to the project’s Production environment. Ensure the connection
provides `BLOB_READ_WRITE_TOKEN`, then redeploy. Connect Preview as well if you
manage photos from preview deployments. The token must remain private.

Local development continues to use `admin/.data/photos.json` and
`public/images/products`; those filesystem writes are for local development
only. Vercel Blob stores uploaded images and the photo list in production.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
