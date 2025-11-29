"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Issue types
type IssueType = "DELAY" | "CANCELLATION" | "BUMPING";

// Calculate estimated compensation based on issue type and ticket price
function calculateEstimatedCompensation(
  issueType: IssueType, 
  ticketPrice: number | null,
  delayMinutes: number = 200
): number {
  if (issueType === "BUMPING") {
    const fare = ticketPrice || 300; // Default estimate if not provided
    if (delayMinutes <= 60) return 0;
    if (delayMinutes <= 120) return Math.min(fare * 2, 775); // 200% of fare, max $775
    return Math.min(fare * 4, 1550); // 400% of fare, max $1,550
  }
  
  // For delays and cancellations, there's no mandatory US compensation
  // But we can still track the claim for goodwill requests
  // Return 0 to indicate no guaranteed compensation
  return 0;
}

export async function addFlight(formData: FormData) {
  const supabase = await createClient();
  
  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login?message=Please log in to track your flight.");
  }

  // Get form data
  const airline = (formData.get("airline") as string)?.toUpperCase().trim();
  const flightNum = (formData.get("flightNum") as string)?.trim();
  const flightDate = formData.get("flightDate") as string;
  const issueType = formData.get("issueType") as IssueType;
  const ticketPriceStr = formData.get("ticketPrice") as string;
  const ticketPrice = ticketPriceStr ? parseFloat(ticketPriceStr) : null;

  // Validation
  if (!airline || !flightNum) {
    redirect("/dashboard?error=Missing flight details.");
  }
  
  if (!flightDate) {
    redirect("/dashboard?error=Please enter the flight date.");
  }
  
  if (!issueType) {
    redirect("/dashboard?error=Please select what happened to your flight.");
  }

  // 2. Ensure User Exists in public.users (Fix for FK Violation)
  const { error: userCheckError } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (userCheckError && userCheckError.code === 'PGRST116') {
    await supabase.from("users").insert({
      id: user.id,
      email: user.email || '',
    });
  }

  // 3. Create departure timestamp from date
  // For now, use noon on the selected date as placeholder
  const scheduledDeparture = new Date(`${flightDate}T12:00:00`).toISOString();

  // 4. Save Trip to DB
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .insert({
      user_id: user.id,
      airline_code: airline,
      flight_number: flightNum,
      scheduled_departure: scheduledDeparture,
      ticket_price: ticketPrice,
      status: issueType === "CANCELLATION" ? "CANCELED" : "COMPLETED",
    })
    .select()
    .single();

  if (tripError) {
    console.error("Trip Error:", tripError);
    redirect("/dashboard?error=Failed to save trip.");
  }

  // 5. Calculate estimated compensation
  // For demo, assume 200 min delay for delays, 0 for cancellations (handled differently)
  const mockDelayMinutes = issueType === "DELAY" ? 200 : issueType === "BUMPING" ? 200 : 0;
  const estimatedPayout = calculateEstimatedCompensation(issueType, ticketPrice, mockDelayMinutes);

  // 6. Create Claim
  // All issue types get a claim, but only bumping has guaranteed compensation
  const { error: claimError } = await supabase
    .from("claims")
    .insert({
      trip_id: trip.id,
      user_id: user.id,
      status: "DRAFT",
      estimated_payout: estimatedPayout,
      is_unlocked: false,
    });

  if (claimError) {
    console.error("Claim Error:", claimError);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// DEMO ONLY: Unlock all claims for the current user without payment
export async function demoUnlockAllClaims() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login?message=Please log in first.");
  }

  // Unlock all claims for this user
  const { error } = await supabase
    .from("claims")
    .update({ is_unlocked: true })
    .eq("user_id", user.id)
    .eq("is_unlocked", false);

  if (error) {
    console.error("Demo Unlock Error:", error);
    redirect("/dashboard?error=Failed to unlock claims.");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

