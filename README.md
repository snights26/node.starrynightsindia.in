# Starry Nights public site (Node target)

This is the migration target for `dev.starrynightsindia.in`. It is a Vite/React single-page application that calls the Node API below `/api`.

## Local development

1. Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` plus any public Google client values.
2. Run `npm install` followed by `npm run dev`.

## Vercel staging

Vercel builds the SPA with `npm run build` and serves `dist`. Set this public,
build-time value in the Vercel staging environment:

```text
VITE_API_BASE_URL=https://node-api-starrynightsindia-in.vercel.app/api
```

Use a separate Vercel Production environment value for the approved production
API. The application has one API base for every request, including the chatbot.
See `.env.staging.example` and `.env.production.example`; never commit local
`.env` files or place credentials in `VITE_*` variables.
