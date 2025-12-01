-- ============================================
-- Flight Monitoring Cron Job Setup
-- ============================================
-- Run this in your Supabase SQL Editor
-- Replace the placeholders before running!
-- ============================================

-- Step 1: Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Step 2: Create the cron job
-- ⚠️ REPLACE THESE VALUES:
--   - YOUR_PROJECT_REF: Your Supabase project reference (from project URL)
--   - YOUR_ANON_KEY: Your anon/public key (from Project Settings → API)

SELECT cron.schedule(
  'check-flight-status',
  '*/30 * * * *',  -- Every 30 minutes
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-flight-status',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_ANON_KEY'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- Step 3: Verify the job was created
SELECT jobid, jobname, schedule, command FROM cron.job WHERE jobname = 'check-flight-status';
