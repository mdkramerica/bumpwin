# Stripe Integration Setup

## ✅ Created via Stripe MCP:
- **Product:** BumpWin Legal Pack (`prod_TSqRXZokov4YXF`)
- **Price:** $19.00 (`price_1SVuknIDN5m54fYYyo5eun4o`)

## Required Environment Variables:

Add to `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_1SVuknIDN5m54fYYyo5eun4o
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Webhook Setup:

Run this command in a separate terminal:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` secret it prints and add to `.env.local`.
