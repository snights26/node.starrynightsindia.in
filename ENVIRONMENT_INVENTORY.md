# Public Web Environment Inventory

Source of truth: all `import.meta.env` reads in `src`, the safe `.env.*.example`
templates, and Docker build arguments. Every `VITE_*` value is baked
into the public JavaScript bundle: it must be safe to disclose and changing it
requires a new build/image.

| Variable | Classification / default | Development | Staging | Production | Purpose | Current status / test |
| --- | --- | --- | --- | --- | --- | --- |
| `VITE_API_BASE_URL` | **PUBLIC SAFE, REQUIRED BUILD-TIME**; no source default | `http://localhost:8080/api` example | `https://node-api-starrynightsindia-in.vercel.app/api` | approved production API URL ending `/api` | The single Axios base URL for every API call, including chatbot. The application throws immediately when absent. | `.env.staging.example` is ready; set the same value as a Vercel staging environment variable. |
| `VITE_GOOGLE_AUTH_ENABLED` | **PUBLIC SAFE, OPTIONAL BUILD-TIME**; source treats every value except literal `false` as enabled | `false` until a dev client exists | `true` only after staging Web client registration | `true` only after production Web client registration | Shows/enables browser Google login. | legacy configuration available; live token test pending. Explicit `false` is safer when client ID is absent. |
| `VITE_GOOGLE_CLIENT_ID` | **PUBLIC SAFE, REQUIRED BUILD-TIME when Google is enabled**; empty fallback | registered Web client ID | staging Web client ID | production Web client ID | Browser Google Identity Services client ID; must appear in API `GOOGLE_ALLOWED_CLIENT_IDS`. | legacy Web ID available; Node multi-audience deployment value and live sign-in pending. |
| `VITE_PUBLIC_BROWSER_CACHE_ENABLED` | **PUBLIC SAFE, OPTIONAL BUILD-TIME**; enabled unless literal `false` | normally `true` | normally `true` with API cache epoch | normally `true` with API cache epoch | Enables optional IndexedDB presentation cache; HTTP fallback remains available. | example enabled and build previously passed; staging API must set shared `PUBLIC_BROWSER_CACHE_EPOCH`. |

Do not put database URLs, JWT secrets, Google client secrets, SMTP credentials,
Cloudinary API secrets, Razorpay secrets, or webhook secrets in any `VITE_*`
value. The former Portainer deployment workflow has been removed from this
Vercel-targeted repository so a GitHub push cannot trigger a legacy deployment.
