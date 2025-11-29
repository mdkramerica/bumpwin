"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Issue types - now includes UPCOMING for future flight tracking
type IssueType = "UPCOMING" | "DELAY" | "CANCELLATION" | "BUMPING";

// Calculate estimated compensation based on issue type and ticket price
function calculateEstimatedCompensation(
  issueType: IssueType, 
  ticketPrice: number | null,
  delayMinutes: number = 200
): number {
  if (issueType === "BUMPING") {
    const fare = ticketPrice || 300;
    if (delayMinutes <= 60) return 0;
    if (delayMinutes <= 120) return Math.min(fare * 2, 775);
    return Math.min(fare * 4, 1550);
  }
  
  // For delays, cancellations, and upcoming flights - no guaranteed US compensation
  return 0;
}

// Check if a date is in the future
function isFutureDate(dateStr: string): boolean {
  const inputDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
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
  let issueType = formData.get("issueType") as IssueType;
  const ticketPriceStr = formData.get("ticketPrice") as string;
  const ticketPrice = ticketPriceStr ? parseFloat(ticketPriceStr) : null;
  const enableAlerts = formData.get("enableAlerts") === "on";

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

  // If it's a future date and they selected UPCOMING, that's fine
  // If it's a future date but they selected a past issue, warn them
  const isUpcoming = isFutureDate(flightDate);
  
  // 2. Ensure User Exists in public.users
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
  const scheduledDeparture = new Date(`${flightDate}T12:00:00`).toISOString();

  // 4. Determine trip status
  let tripStatus: "UPCOMING" | "COMPLETED" | "CANCELED" = "UPCOMING";
  if (issueType === "UPCOMING" || isUpcoming) {
    tripStatus = "UPCOMING";
  } else if (issueType === "CANCELLATION") {
    tripStatus = "CANCELED";
  } else {
    tripStatus = "COMPLETED";
  }

  // 5. Save Trip to DB
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .insert({
      user_id: user.id,
      airline_code: airline,
      flight_number: flightNum,
      scheduled_departure: scheduledDeparture,
      ticket_price: ticketPrice,
      status: tripStatus,
    })
    .select()
    .single();

  if (tripError) {
    console.error("Trip Error:", tripError);
    redirect("/dashboard?error=Failed to save trip.");
  }

  // 6. For UPCOMING flights, don't create a claim yet - we'll create one if issues occur
  // For past issues, create a claim
  if (issueType !== "UPCOMING" && !isUpcoming) {
    const mockDelayMinutes = issueType === "DELAY" ? 200 : issueType === "BUMPING" ? 200 : 0;
    const estimatedPayout = calculateEstimatedCompensation(issueType, ticketPrice, mockDelayMinutes);

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
  }

  // 7. Log alert preference (for future email system)
  if (enableAlerts) {
    console.log(`Alert enabled for trip ${trip.id}, user email: ${user.email}`);
    // TODO: Store alert preference in database or trigger welcome email
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

