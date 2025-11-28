import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const claimId = session.metadata?.claimId;
    const userId = session.metadata?.userId;

    console.log(`[WEBHOOK] Processing Event: ${event.type} for Session: ${session.id}`);
    console.log(`[WEBHOOK] Metadata:`, session.metadata);

    if (!claimId || !userId) {
        console.error("[WEBHOOK ERROR] Missing metadata (claimId or userId)");
        return new NextResponse("Missing metadata", { status: 400 });
    }

    console.log(`[WEBHOOK] 💰 Payment confirmed for Claim: ${claimId}`);

    // Unlock the Claim in Supabase
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from("claims")
      .update({ 
        is_unlocked: true, 
        status: "PAID_UNLOCK",
        stripe_session_id: session.id 
      })
      .eq("id", claimId)
      .select();
    
    if (error) {
      console.error("[WEBHOOK ERROR] Supabase Update Failed:", error);
      return new NextResponse("Database Error", { status: 500 });
    }
    
    if (!data || data.length === 0) {
         console.error("[WEBHOOK ERROR] Update succeeded but no rows returned. Claim ID might be wrong or deleted.");
         // This helps debug if RLS or ID mismatch is the issue
    } else {
         console.log("[WEBHOOK] ✅ Claim unlocked successfully:", data);
    }
  }

  return new NextResponse(null, { status: 200 });
}

// Helper to create Admin Client
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function createAdminClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, // Requires this new ENV var
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
}

