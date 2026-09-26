# Vercel staging setup

Import this repository as a Vite project. Vercel should run `npm run build` and
publish `dist`; `vercel.json` already supplies the SPA fallback for client-side
routes.

Set this **Preview/staging** build variable in Vercel:

```text
VITE_API_BASE_URL=https://node-api-starrynightsindia-in.vercel.app/api
```

Optional public values should remain disabled until configured and verified:

```text
VITE_GOOGLE_AUTH_ENABLED=false
VITE_PUBLIC_BROWSER_CACHE_ENABLED=true
```

Set the production API base separately in Vercel's Production environment. Do
not reuse staging values for production and do not put secrets in `VITE_*`.
