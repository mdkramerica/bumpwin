import { NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { claimId } = await req.json();

  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  // Create the Checkout Session
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: STRIPE_CONFIG.PRICE_ID, quantity: 1 }],
    mode: 'payment',
    success_url: STRIPE_CONFIG.SUCCESS_URL,
    cancel_url: STRIPE_CONFIG.CANCEL_URL,
    metadata: {
      userId: user.id,
      claimId: claimId, // Passed to Webhook to unlock DB
    },
  });

  return NextResponse.json({ url: session.url });
}
