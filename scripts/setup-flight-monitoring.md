# Flight Monitoring Setup Guide

This guide sets up automatic flight status monitoring using your existing AviationStack API (free tier: 500 requests/month).

## How It Works

```
User adds flight → Status: UPCOMING
         ↓
Cron runs every 30 min (uses ~1 API call per flight)
         ↓
Flight lands → Status: COMPLETED (saved to DB)
         ↓
User views dashboard → Shows correct status (no API call needed)
```

---

## Step 1: Deploy the Edge Function

Run this from your project root:

```bash
# Login to Supabase CLI (if not already)
npx supabase login

# Link to your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Set the API key secret
npx supabase secrets set AVIATIONSTACK_API_KEY=your_api_key_here

# Deploy the edge function
npx supabase functions deploy check-flight-status
```

---

## Step 2: Enable pg_cron Extension

In your Supabase Dashboard:

1. Go to **Database** → **Extensions**
2. Search for `pg_cron`
3. Click **Enable**

---

## Step 3: Create the Cron Job

Go to **SQL Editor** in Supabase Dashboard and run:

```sql
-- Enable the pg_net extension (for HTTP requests)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the cron job to check flights every 30 minutes
SELECT cron.schedule(
  'check-flight-status',           -- Job name
  '*/30 * * * *',                  -- Every 30 minutes
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-flight-status',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SUPABASE_ANON_KEY'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
```

**Replace:**
- `YOUR_PROJECT_REF` with your Supabase project reference (e.g., `abcdefghijklmnop`)
- `YOUR_SUPABASE_ANON_KEY` with your anon/public key from Project Settings → API

---

## Step 4: Verify It's Working

Check if the cron job is scheduled:

```sql
SELECT * FROM cron.job;
```

Check recent job runs:

```sql
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

---

## Step 5: Test Manually

You can test the edge function manually:

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-flight-status' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json'
```

Expected response:
```json
{
  "success": true,
  "checked": 2,
  "alerts_sent": 0,
  "completed": 1,
  "delays": 0,
  "cancellations": 0,
  "errors": 0,
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

---

## API Usage Estimate

With 500 free requests/month:

| Flights Tracked | Check Frequency | Monthly API Calls |
|-----------------|-----------------|-------------------|
| 1 flight        | Every 30 min    | ~48 calls/day per active flight |
| 5 active flights| Every 30 min    | ~240 calls/day |
| 10 active flights| Every 30 min   | ~480 calls/day |

**Tip:** Flights are only checked within 48 hours of departure, so most months you'll use far fewer calls.

---

## Troubleshooting

### Cron not running?
```sql
-- Check if cron extension is enabled
SELECT * FROM pg_extension WHERE extname = 'pg_cron';

-- Check job status
SELECT * FROM cron.job;
```

### Edge function errors?
Check logs in Supabase Dashboard → Edge Functions → check-flight-status → Logs

### API key not working?
```bash
# Verify secret is set
npx supabase secrets list
```

---

## Uninstall

To remove the cron job:

```sql
SELECT cron.unschedule('check-flight-status');
```
