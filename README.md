# SwipeClean

SwipeClean is an Android-first React Native app that helps people clean up photos and videos with quick left/right swipes. The monorepo also includes a Vercel-ready marketing and legal site plus Supabase schema assets.

## Apps

- `apps/mobile`: Expo React Native mobile app with mock media data.
- `apps/web`: Next.js site for landing, privacy policy, terms, and marketing pages.
- `supabase`: migrations and seed data for auth-backed app data.
- `docs`: product, app flow, and database planning docs.

## Getting Started

Install dependencies from the repository root:

```bash
npm install
```

Run the mobile app:

```bash
npm run mobile
```

Run the Android target:

```bash
npm run mobile:android
```

Run the web app:

```bash
npm run web
```

## Supabase

Copy `.env.example` to `.env.local` and fill in Supabase values when the project is created. The mobile app currently uses mock data, but `apps/mobile/src/services/supabase.ts` is ready for the client wiring.

## GitHub

Suggested repository name: `swipeclean-app`.
