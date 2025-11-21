# BumpWin Master Build Guide

## Phase 0: Environment & Setup
1.  **Stripe:** Get API Keys (`sk_test_...`). Create Product "BumpWin Legal Pack" ($19). Get Price ID.
2.  **Env:** Add to `.env.local`:
    * `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    * `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_ID`
    * `NEXT_PUBLIC_URL` (e.g., http://localhost:3000)

## Phase 1: Foundation
1.  Init: `npx create-next-app@latest bumpwin --typescript --tailwind --eslint`
2.  Install: `npm install @supabase/supabase-js @supabase/ssr framer-motion lucide-react qrcode.react stripe clsx tailwind-merge`
3.  **DB:** Apply `supabase/schema.sql` to Supabase SQL Editor.
4.  **Types:** Generate `types/database.ts`.

## Phase 2: The "BumpWin" Brand UI
1.  **Hero:** Build `components/marketing/hero.tsx`.
    * *Animation:* "DON'T GET SCREWED. GET BUMPED. WIN."
2.  **Meter:** Build `components/dashboard/misery-meter.tsx`.
    * *Logic:* Delay > 180 mins = "WINNER" State.

## Phase 3: Monetization (The $19 Paywall)
1.  **Backend:** Create `lib/stripe.ts` and `app/api/checkout/route.ts`.
2.  **UI:** Build `components/dashboard/claim-lock.tsx`.
    * *Condition:* If `claim.is_unlocked` is FALSE, show the Paywall.
    * *Visual:* Highlight the "Profit" ($581).

## Phase 4: Viral Growth
1.  **Share:** Build `components/viral/social-share.tsx`.
    * *Copy:* "I just beat the airline with BumpWin. Check your flight: bumpwin.com"
2.  **Bounty:** Build `components/viral/bounty-card.tsx` (QR Code).

## Phase 5: Logic & Webhooks
1.  **Compensation:** Create `lib/compensation.ts` (Rules Engine).
2.  **Webhook:** Create `app/api/webhooks/stripe/route.ts`.
    * *Action:* When payment succeeds, set `claims.is_unlocked = true`.

**Cursor Command:** "Read @PRD.md and @BUILD_GUIDE.md. Let's start Phase 1."
