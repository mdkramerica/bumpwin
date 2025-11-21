#!/bin/bash
# Helper script to get Stripe webhook secret

echo "Starting Stripe webhook listener..."
echo "The webhook signing secret will be printed below:"
echo ""

# Kill any existing listeners
pkill -f "stripe listen" 2>/dev/null
sleep 1

# Start listener and capture first few lines (where secret is printed)
stripe listen --forward-to localhost:3000/api/webhooks/stripe 2>&1 | tee /tmp/stripe_webhook.log &
STRIPE_PID=$!

# Wait a moment for initialization
sleep 3

# Extract the webhook secret from the log
WEBHOOK_SECRET=$(grep -o "whsec_[a-zA-Z0-9]*" /tmp/stripe_webhook.log | head -1)

if [ -n "$WEBHOOK_SECRET" ]; then
    echo ""
    echo "✅ Webhook Secret Found:"
    echo "STRIPE_WEBHOOK_SECRET=$WEBHOOK_SECRET"
    echo ""
    echo "Add this to your .env.local file!"
else
    echo ""
    echo "⚠️  Could not auto-detect secret. Check the output above for 'whsec_...'"
    echo "Or check: tail -f /tmp/stripe_webhook.log"
fi

echo ""
echo "Webhook listener is running in background (PID: $STRIPE_PID)"
echo "Press Ctrl+C to stop it, or run: pkill -f 'stripe listen'"

