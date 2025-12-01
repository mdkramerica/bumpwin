#!/bin/bash

# ============================================
# Deploy Flight Monitoring Edge Function
# ============================================

set -e

echo "🛫 BumpWin Flight Monitoring Setup"
echo "=================================="
echo ""

# Check if supabase CLI is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js first."
    exit 1
fi

# Get project reference
echo "Enter your Supabase project reference (from your project URL):"
echo "Example: If URL is https://abcdef123.supabase.co, enter: abcdef123"
read -p "Project Ref: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project reference is required"
    exit 1
fi

# Get API key
echo ""
echo "Enter your AviationStack API key:"
read -p "API Key: " AVIATION_API_KEY

if [ -z "$AVIATION_API_KEY" ]; then
    echo "❌ AviationStack API key is required"
    exit 1
fi

echo ""
echo "📦 Linking to Supabase project..."
npx supabase link --project-ref "$PROJECT_REF"

echo ""
echo "🔐 Setting API key secret..."
npx supabase secrets set AVIATIONSTACK_API_KEY="$AVIATION_API_KEY"

echo ""
echo "🚀 Deploying edge function..."
npx supabase functions deploy check-flight-status

echo ""
echo "✅ Edge function deployed!"
echo ""
echo "=================================="
echo "NEXT STEPS:"
echo "=================================="
echo ""
echo "1. Go to Supabase Dashboard → Database → Extensions"
echo "   Enable: pg_cron and pg_net"
echo ""
echo "2. Go to SQL Editor and run this (replace YOUR_ANON_KEY):"
echo ""
echo "   SELECT cron.schedule("
echo "     'check-flight-status',"
echo "     '*/30 * * * *',"
echo "     \$\$"
echo "     SELECT net.http_post("
echo "       url := 'https://${PROJECT_REF}.supabase.co/functions/v1/check-flight-status',"
echo "       headers := jsonb_build_object("
echo "         'Content-Type', 'application/json',"
echo "         'Authorization', 'Bearer YOUR_ANON_KEY'"
echo "       ),"
echo "       body := '{}'::jsonb"
echo "     ) AS request_id;"
echo "     \$\$"
echo "   );"
echo ""
echo "3. Test it manually:"
echo "   curl -X POST 'https://${PROJECT_REF}.supabase.co/functions/v1/check-flight-status' \\"
echo "     -H 'Authorization: Bearer YOUR_ANON_KEY'"
echo ""
