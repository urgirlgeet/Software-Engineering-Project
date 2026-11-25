# GATED deployment guide

This guide prepares GATED for a static web host. It does not claim that a
public deployment has already been published. The project is configured for
Expo SDK 57 and static web output.

## Requirements

- Node.js and npm compatible with the lockfile
- Access to the intended Supabase project
- An account with a static web host for publishing
- A current checkout of this repository

## 1. Prepare Supabase

Use the Supabase SQL Editor or the team's migration workflow to apply, in
order:

1. `supabase/migrations/20261028132900_signup_profiles.sql`
2. `supabase/migrations/20261124120000_apartment_services.sql`
3. `supabase/seed.sql` for demo societies and apartment numbers, if needed

Replace sample society and apartment data with verified registry data before
real residents use the system. Review the policies on every table, including
the complaints and maintenance-request tables created outside the checked-in
migrations. Confirm email settings, the Auth site URL and redirect allowlist
for the deployment domain.

The app's Supabase URL and publishable key are configured in
`src/lib/supabase.ts`. Confirm they point to the intended project. A
publishable key is expected to be visible in a client app; it is not a
substitute for database security. Never add a Supabase `service_role` key or
other private credential to the source, browser bundle or public host.

## 2. Build the web app

From the repository root, run:

```powershell
npm ci
npx expo export --platform web
```

The static site is written to `dist/`. Inspect the build output and test it
locally before uploading it. If the host's default behavior does not serve
Expo Router's generated route files on refresh, configure the host's
documented static-route fallback and retest direct links.

## 3. Publish

Create a site in the chosen static host and publish the contents of `dist/`.
For Netlify, use the manual deploy/Drop flow with the generated `dist`
directory, or connect the Git repository and configure:

- Build command: `npm ci && npx expo export --platform web`
- Publish directory: `dist`

After the host assigns a domain, add it to Supabase Auth's site URL and
redirect allowlist. Do not copy deployment secrets into a public repository.

## 4. Smoke-test the hosted app

Use test accounts and non-production data. At minimum, verify:

- Sign up, email confirmation if enabled, sign-in, sign-out and role routing
- Resident apartment lookup and invalid apartment rejection
- Complaint submission, admin assignment and staff status updates
- Society-scoped notice visibility
- Booking overlap rejection, including a second resident's overlapping slot
- Bill creation, resident visibility and simulated payment status
- Refreshing a deep route and opening the app on a mobile browser
- RLS denies cross-society and unauthorized writes when called through the
  authenticated client

Keep actual test results in [the test-case document](./test-cases.md). Do not
mark a case as passed merely because the build succeeds.

## Current release blockers and limits

- This repository has no recorded public deployment URL or host configuration.
- A live deployment requires the project owner to apply migrations, configure
  Supabase Auth and publish the build using an authorized hosting account.
- The visitor form is in-memory only; it is not persistent guard entry/exit
  logging.
- Bill payment changes application status only and does not transfer money.
- Admin approval described in the SRS is not enforced by the current signup
  flow.
- Before real use, review database policies and verify that the Supabase
  project, society registry and access roles are configured correctly.

## Android distribution

The repository does not currently include an EAS configuration or Android
package identifier. Android store distribution therefore needs a separately
configured application ID, signing credentials and an EAS/build workflow.
Do not treat the web export as an Android installation package.
