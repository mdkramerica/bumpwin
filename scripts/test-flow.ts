import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load Environment
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Must be SERVICE ROLE to test as different users
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function runTest() {
  console.log("🧪 Starting Full Flow Test...\n");

  // 1. Setup: Create a temporary test user
  const email = `test-${Date.now()}@bumpwin.com`;
  console.log(`1️⃣ Creating Test User: ${email}`);
  
  const { data: user, error: userError } = await supabase.auth.admin.createUser({
    email,
    password: "password123",
    email_confirm: true,
  });

  if (userError || !user.user) {
    console.error("❌ Failed to create user:", userError);
    process.exit(1);
  }
  
  const userId = user.user.id;
  console.log("   ✅ User Created:", userId);

  // 2. Action: Add Flight (Simulating app/actions.ts logic)
  console.log("\n2️⃣ Simulating 'Add Flight' (UA 249 - Winner)...");
  
  // Logic from app/actions.ts
  const flightData = {
    airline: "UA",
    flightNum: "249",
    scheduled_departure: new Date().toISOString(),
    status: "COMPLETED",
    mock_delay_minutes: 200, // WINNER
  };

  // Create Trip
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .insert({
      user_id: userId,
      airline_code: flightData.airline,
      flight_number: flightData.flightNum,
      scheduled_departure: flightData.scheduled_departure,
      status: "UPCOMING",
    })
    .select()
    .single();

  if (tripError) {
    console.error("❌ Failed to create trip:", tripError);
    process.exit(1);
  }
  console.log("   ✅ Trip Created:", trip.id);

  // Create Claim (Logic: > 180 mins)
  const isWinner = flightData.mock_delay_minutes > 180;
  let claimId = "";

  if (isWinner) {
    const { data: claim, error: claimError } = await supabase
      .from("claims")
      .insert({
        trip_id: trip.id,
        user_id: userId,
        status: "DRAFT",
        estimated_payout: 600.00,
        is_unlocked: false, // LOCKED
      })
      .select()
      .single();
      
     if (claimError) {
         console.error("❌ Failed to create claim:", claimError);
         process.exit(1);
     }
     claimId = claim.id;
     console.log("   ✅ Locked Claim Created:", claimId);
  } else {
      console.error("❌ Logic Error: Should be a winner.");
      process.exit(1);
  }

  // 3. Verify Paywall State
  console.log("\n3️⃣ Verifying Paywall State...");
  const { data: lockedClaim } = await supabase.from("claims").select("*").eq("id", claimId).single();
  if (lockedClaim.is_unlocked === false) {
      console.log("   ✅ Claim is correctly LOCKED.");
  } else {
      console.error("❌ Claim should be LOCKED but is unlocked.");
  }

  // 4. Simulate Webhook (Unlock)
  console.log("\n4️⃣ Simulating Stripe Webhook (Payment Success)...");
  
  // We manually update to simulate the webhook's effect
  const { error: unlockError } = await supabase
      .from("claims")
      .update({ 
        is_unlocked: true, 
        status: "PAID_UNLOCK",
        stripe_session_id: "cs_test_mock_123" 
      })
      .eq("id", claimId);

  if (unlockError) {
      console.error("❌ Webhook Simulation Failed:", unlockError);
  } else {
      console.log("   ✅ Webhook Logic Executed.");
  }

  // 5. Final Verification
  console.log("\n5️⃣ Verifying Final State...");
  const { data: finalClaim } = await supabase.from("claims").select("*").eq("id", claimId).single();
  
  if (finalClaim.is_unlocked === true && finalClaim.status === "PAID_UNLOCK") {
      console.log("   🎉 SUCCESS: Claim is UNLOCKED. Flow Verified.");
  } else {
      console.error("❌ Final State Invalid:", finalClaim);
  }

  // Cleanup (Optional)
  await supabase.auth.admin.deleteUser(userId);
  console.log("\n🧹 Test User Cleaned Up.");
}

runTest();

