# Product Requirements Document: BumpWin

## 1. Brand Identity
* **App Name:** BumpWin
* **Domain:** BumpWin.com
* **Social Handle:** @GetBumpedWin
* **Motto:** "Get Bumped. Win."
* **Mission:** Turn travel disasters into financial victories.
* **Visual Identity:** * Background: Deep Slate (`bg-slate-900`)
    * Accent: Neon Lime (`text-lime-400`) - The color of Money/Winning.

## 2. Business Model (The "Keeper" Model)
* **Strategy:** We do not take a percentage. We charge a flat fee to unlock the legal work.
* **Tier 1 (Free - The Hook):** Flight Tracking, "Misery Meter" (Delay visualization), Eligibility Calculation.
* **Tier 2 ($19 One-Time - The Product):** "Unlock Claim." Generates the PDF Demand Letter + Filing Instructions.
* **Tier 3 (Viral - The Growth):** "Bounty Hunter" Program. Get $20 for every person you refer who files a claim.

## 3. Core User Journey
1.  **Ingest:** User adds flight (e.g., UA 249).
2.  **Monitor:** "Misery Meter" tracks delay intensity.
3.  **Trigger:** Delay > 3 hrs OR Cancellation -> Meter hits **"WINNER"** state.
4.  **The "Aha" Moment:** App displays: "YOU WON $600."
5.  **The Paywall:** User clicks "Claim". Screen shows: "Pay $19 to unlock your $600 claim documents."
6.  **Conversion:** Stripe Checkout.
7.  **Viral Loop:** Success screen prompts: "Share this link with seat 14B. If they win, you get $20."

## 4. Functional Requirements
* **Authentication:** Supabase Auth (Email/Social).
* **Database:** Supabase (PostgreSQL).
* **Payments:** Stripe Checkout (Mode: Payment).
* **Logic:** US DOT (14 CFR Part 250) & EU261 Rules Engine.
