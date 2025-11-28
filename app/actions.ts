"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Mock Flight Data Lookup (Replace with real Aviation API later)
async function lookupFlight(airline: string, flightNumber: string) {
  // In a real app, fetch from AviationStack or similar.
  // For MVP, we simulate a "Winning" flight (Delayed 200 mins)
  return {
    scheduled_departure: new Date().toISOString(),
    status: "COMPLETED", // or DELAYED
    mock_delay_minutes: 200, // HARDCODED WINNER FOR DEMO
  };
}

export async function addFlight(formData: FormData) {
  const supabase = await createClient();
  
  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login?message=Please log in to track your flight.");
  }

  const airline = formData.get("airline") as string;
  const flightNum = formData.get("flightNum") as string;

  if (!airline || !flightNum) {
    redirect("/dashboard?error=Missing flight details.");
  }

  // 2. Ensure User Exists in public.users (Fix for FK Violation)
  const { error: userCheckError } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (userCheckError && userCheckError.code === 'PGRST116') {
    // User missing, insert them
    await supabase.from("users").insert({
      id: user.id,
      email: user.email || '',
    });
  }

  // 3. Lookup Flight Details
  const flightDetails = await lookupFlight(airline, flightNum);

  // 4. Save Trip to DB
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .insert({
      user_id: user.id,
      airline_code: airline,
      flight_number: flightNum,
      scheduled_departure: flightDetails.scheduled_departure,
      status: "UPCOMING", // Default
    })
    .select()
    .single();

  if (tripError) {
    console.error("Trip Error:", tripError);
    redirect("/dashboard?error=Failed to save trip.");
  }

  // 4. Logic Engine: Is this a WINNER?
  // Logic: > 180 mins delay = WINNER.
  const isWinner = flightDetails.mock_delay_minutes > 180;

  if (isWinner) {
    // Create a LOCKED Claim
    const { error: claimError } = await supabase
      .from("claims")
      .insert({
        trip_id: trip.id,
        user_id: user.id,
        status: "DRAFT",
        estimated_payout: 600.00, // The $600 Promise
        is_unlocked: false,       // THE PAYWALL
      });

    if (claimError) {
        console.error("Claim Error:", claimError);
    }
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

