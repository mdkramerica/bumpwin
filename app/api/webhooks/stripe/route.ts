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

    if (!claimId || !userId) {
        console.error("Webhook missing metadata");
        return new NextResponse("Missing metadata", { status: 400 });
    }

    console.log(`💰 Payment received for Claim: ${claimId}`);

    // Unlock the Claim in Supabase
    // Note: We use the SERVICE ROLE key pattern implicitly if using a robust setup,
    // but here we are using the server client which uses cookies (User Context).
    // PROBLEM: The webhook does NOT have the user's cookies. It is a server-to-server call.
    // We need a Supabase Client with ADMIN privileges (Service Role) to update the DB 
    // without a logged-in user.
    
    // TEMPORARY FIX for MVP: 
    // We will define a createAdminClient helper inline or assume public access for now? 
    // No, that's insecure. 
    // Let's use the SUPABASE_SERVICE_ROLE_KEY directly here.
    
    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
      .from("claims")
      .update({ 
        is_unlocked: true, 
        status: "PAID_UNLOCK",
        stripe_session_id: session.id 
      })
      .eq("id", claimId);

    if (error) {
      console.error("Supabase Update Error:", error);
      return new NextResponse("Database Error", { status: 500 });
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

