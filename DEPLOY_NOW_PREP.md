# IONOS Deploy Now Launch Prep

This runbook prepares the current app for first production launch using IONOS Deploy Now.

## 1) Preflight (Before IONOS Hookup)

- Confirm static export is enabled in `next.config.mjs` (`output: 'export'`).
- Confirm local quality checks pass:
  - `npm test`
  - `npm run build`
- Confirm production metadata:
  - `NEXT_PUBLIC_SITE_URL` points to production domain in deployment environment.
- Confirm public assets and social links are final:
  - logo files in `public/`
  - header/social links in `src/lib/site-content.ts`
- Contact form launch safety:
  - `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` is intentionally empty right now.
  - Before go-live, set it to the real Formspree endpoint (must be `https://formspree.io/...`).

## 2) Hook Up IONOS Deploy Now (Day of Setup)

1. In your dad's IONOS Deploy Now account, connect GitHub and select this repository.
2. Set `main` as production branch.
3. Use static build settings:
   - Build command: `npm ci && npm run build`
   - Publish directory: `out`
4. Allow Deploy Now to generate workflow/config files in this repo.
5. Commit generated files to `main`.
6. Connect production domain and enable TLS.

## 2a) Security Header Verification (IONOS Capability Check)

Because this site is statically exported, response security headers must be set in IONOS hosting config (not Next.js runtime).

1. Add a temporary debug header in IONOS project config:
   - `X-Debug-Security-Headers: 1`
2. Deploy and validate with:
   - `curl -I https://your-domain`
3. If the debug header appears, configure and enforce these production headers at hosting edge:
   - `Content-Security-Policy` (restrict script/frame/connect/form origins)
   - `Strict-Transport-Security`
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy` (disable unused browser features)
4. If headers are not configurable in IONOS:
   - Keep in-app URL allowlists and embed sandbox restrictions enabled.
   - Record residual risk: true response-header hardening is hosting-limited.
5. Run the local checker against production after deploy:
   - `./scripts/verify-security-headers.sh https://your-domain`

## 3) CI Requirement Before Deployment

A `main` branch CI workflow is in this repo:

- `.github/workflows/ci-main.yml`
- Runs on push to `main`
- Steps: install deps, Playwright install, tests, production build

After Deploy Now generates its workflow files:

- Edit the generated Deploy Now workflow so deployment runs only after quality checks succeed in that same workflow run.
- Keep direct pushes to `main` allowed for now (no PR protection yet).

## 4) First Production Smoke Checklist

Run on live domain after first successful deploy:

- Core pages load:
  - `/`
  - `/about/`
  - `/find-us/`
  - `/sell/`
  - `/contact/`
  - `/reviews/`
  - `/delivery-returns/`
  - `/privacy/`
- Integrations and key UX:
  - contact form submits to real Formspree endpoint and inbox receives message
  - Formspree anti-abuse controls are enabled (rate limiting and spam protection/captcha in provider dashboard)
  - footer opening times visible
  - phone/email links work
  - map embed loads
  - reviews widget loads
  - Beehiiv newsletter embed loads
- SEO/system endpoints:
  - `/robots.txt`
  - `/sitemap.xml`

## 5) Rollback Plan

If production is broken after deploy:

1. Revert the bad commit on `main`.
2. Push revert commit.
3. Let Deploy Now auto-deploy reverted state.
4. Re-run smoke checklist.
