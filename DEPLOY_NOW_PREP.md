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
  - `integrationSettings.contactFormEndpoint` is intentionally empty right now.
  - Before go-live, set it to the real Formspree endpoint.

## 2) Hook Up IONOS Deploy Now (Day of Setup)

1. In your dad's IONOS Deploy Now account, connect GitHub and select this repository.
2. Set `main` as production branch.
3. Use static build settings:
   - Build command: `npm ci && npm run build`
   - Publish directory: `out`
4. Allow Deploy Now to generate workflow/config files in this repo.
5. Commit generated files to `main`.
6. Connect production domain and enable TLS.

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
