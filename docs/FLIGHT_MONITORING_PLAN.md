# BumpWin Flight Monitoring & Email Alert System

## Overview

This document outlines the architecture and setup for BumpWin's flight monitoring system, which tracks user flights and sends email alerts when flights become eligible for compensation.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User adds     │     │  Cron Job runs  │     │  Email sent to  │
│   future flight │────▶│  every 15 min   │────▶│  user via       │
│   to track      │     │  checks status  │     │  Resend API     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  trips table    │     │  FlightAware or │     │  flight_alerts  │
│  (status:       │     │  AviationStack  │     │  table logs     │
│   UPCOMING)     │     │  API            │     │  sent alerts    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Components

### 1. Database Tables

#### `trips` table
- Stores flight information
- `status` field: `UPCOMING`, `COMPLETED`, or `CANCELED`
- Upcoming flights are monitored by the cron job

#### `flight_alerts` table
- Logs all sent alerts to prevent duplicates
- Fields: `trip_id`, `user_id`, `alert_type`, `sent_at`, `email_id`

#### `claims` table
- Auto-created when a flight issue is detected
- `claim_type`: `bumping`, `delay`, or `cancellation`

### 2. Supabase Edge Functions

#### `check-flight-status`
**Purpose:** Cron job that checks all upcoming flights for status changes

**Trigger:** Run every 15-30 minutes via Supabase cron

**Logic:**
1. Query all trips with `status = 'UPCOMING'` within monitoring window (past 24h to future 48h)
2. For each trip, call flight status API
3. If significant change detected (3+ hour delay, cancellation, overbooking):
   - Update trip status in database
   - Create a claim if one doesn't exist
   - Trigger `send-flight-alert` function

**Environment Variables:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FLIGHTAWARE_API_KEY` (optional, for real flight data)

#### `send-flight-alert`
**Purpose:** Sends email alerts to users

**Trigger:** Called by `check-flight-status` or manually

**Payload:**
```json
{
  "tripId": "uuid",
  "alertType": "DELAY" | "CANCELLATION" | "BUMPING" | "TRACKING_CONFIRMATION",
  "delayMinutes": 200
}
```

**Environment Variables:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

### 3. Email Templates

Located in `lib/email-templates.ts`:

| Template | Trigger | Key Info |
|----------|---------|----------|
| Delay Alert | 3+ hour delay detected | No cash compensation (US), request vouchers |
| Cancellation Alert | Flight cancelled | Right to refund |
| Bumping Alert | Overbooking detected | Up to $1,550 compensation |
| Tracking Confirmation | User adds flight | What we monitor |

## Setup Instructions

### Step 1: Configure Environment Variables

In Supabase Dashboard → Settings → Edge Functions:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxx
FLIGHTAWARE_API_KEY=xxxxxxxxxx  # Optional
```

### Step 2: Deploy Edge Functions

```bash
# Deploy both functions
supabase functions deploy send-flight-alert
supabase functions deploy check-flight-status
```

### Step 3: Set Up Cron Job

In Supabase Dashboard → SQL Editor, run:

```sql
-- Create cron extension if not exists
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule flight status check every 15 minutes
SELECT cron.schedule(
  'check-flight-status',
  '*/15 * * * *',  -- Every 15 minutes
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-flight-status',
      headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
      body := '{}'::jsonb
    ) AS request_id;
  $$
);
```

### Step 4: Configure Email Domain (Resend)

1. Go to [Resend.com](https://resend.com) → Domains
2. Add `bumpwin.com` domain
3. Add DNS records as instructed
4. Verify domain
5. Update `from` address in edge function to `alerts@bumpwin.com`

## Flight Status API Options

### Option 1: FlightAware AeroAPI (Recommended)
- **Pricing:** $0.008 per API call (~$350/month for 1.5M calls)
- **Coverage:** Comprehensive US/International
- **Docs:** https://flightaware.com/aeroapi/

### Option 2: AviationStack
- **Pricing:** Free tier available (500 calls/month)
- **Coverage:** Good for basic status
- **Docs:** https://aviationstack.com/documentation

### Option 3: Cirium (Enterprise)
- **Pricing:** Custom enterprise pricing
- **Coverage:** Industry standard, most comprehensive
- **Docs:** https://developer.cirium.com/

### MVP Approach (Current)
For MVP, the system uses mock data with realistic probabilities:
- 70% on time
- 20% delayed (30 min - 5 hours)
- 8% cancelled
- 2% overbooked

## Alert Logic

### When to Send Alerts

| Condition | Alert Type | Compensation Info |
|-----------|------------|-------------------|
| Delay ≥ 3 hours | DELAY | No US cash comp, request vouchers |
| Flight cancelled | CANCELLATION | Right to full refund |
| Overbooking detected | BUMPING | 200-400% of fare (up to $1,550) |

### Preventing Duplicate Alerts

The system checks `flight_alerts` table before sending:
- Only one DELAY alert per trip
- Only one CANCELLATION alert per trip
- Only one BUMPING alert per trip

## User Flow

1. **User adds upcoming flight**
   - Form accepts future dates
   - Status set to `UPCOMING`
   - Optional: Send tracking confirmation email

2. **Cron job monitors flight**
   - Runs every 15 minutes
   - Checks flights within 48-hour window
   - Updates status if changed

3. **Issue detected**
   - Trip status updated
   - Claim auto-created
   - Alert email sent to user

4. **User receives email**
   - Clear explanation of rights
   - CTA to view dashboard
   - Link to file claim

## Testing

### Manual Test Alert

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-flight-alert' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"tripId": "uuid-here", "alertType": "DELAY", "delayMinutes": 200}'
```

### Manual Status Check

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-flight-status' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

## Monitoring & Logging

- Edge function logs available in Supabase Dashboard → Logs → Edge Functions
- Alert history in `flight_alerts` table
- Consider adding error tracking (Sentry) for production

## Cost Estimation

| Component | Monthly Cost |
|-----------|--------------|
| Supabase (Pro) | $25 |
| Resend (10k emails) | Free |
| FlightAware (10k calls) | ~$80 |
| **Total** | ~$105/month |

## Future Enhancements

1. **Real-time flight tracking** - WebSocket connection for live updates
2. **SMS alerts** - Twilio integration for urgent alerts
3. **Push notifications** - PWA support for mobile
4. **Multiple flights** - Track entire itineraries
5. **Price drop alerts** - Notify if flight gets cheaper
6. **Gate change alerts** - Real-time gate updates


