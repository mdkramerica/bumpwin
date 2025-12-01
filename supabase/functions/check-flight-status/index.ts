/**
 * Supabase Edge Function: check-flight-status
 * 
 * This function runs on a cron schedule to check the status of upcoming flights
 * and trigger email alerts when flights are delayed, cancelled, or overbooked.
 * 
 * Trigger: Cron job (recommended: every 15-30 minutes)
 * 
 * Required Environment Variables:
 * - SUPABASE_URL: Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Service role key for database access
 * - FLIGHTAWARE_API_KEY: (Optional) FlightAware API for real flight data
 * - AVIATIONSTACK_API_KEY: (Optional) AviationStack API alternative
 * 
 * Note: For MVP, this uses mock data. In production, integrate with a real
 * flight status API like FlightAware, AviationStack, or Cirium.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const FLIGHTAWARE_API_KEY = Deno.env.get("FLIGHTAWARE_API_KEY");

interface FlightStatus {
  status: "ON_TIME" | "DELAYED" | "CANCELLED" | "DEPARTED" | "ARRIVED";
  delayMinutes: number;
  isOverbooked?: boolean;
  hasLanded?: boolean;
}

serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get all upcoming trips that need monitoring
    // Only check flights within the next 48 hours and past 24 hours
    const now = new Date();
    const pastWindow = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
    const futureWindow = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours from now

    const { data: trips, error: tripsError } = await supabase
      .from("trips")
      .select(`
        *,
        users (
          id,
          email
        )
      `)
      .eq("status", "UPCOMING")
      .gte("scheduled_departure", pastWindow.toISOString())
      .lte("scheduled_departure", futureWindow.toISOString());

    if (tripsError) {
      console.error("Error fetching trips:", tripsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch trips" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!trips || trips.length === 0) {
      return new Response(
        JSON.stringify({ message: "No upcoming flights to check", checked: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Checking ${trips.length} upcoming flights...`);

    const results = {
      checked: trips.length,
      alerts_sent: 0,
      completed: 0,
      delays: 0,
      cancellations: 0,
      errors: 0,
    };

    for (const trip of trips) {
      try {
        // Get flight status from API (or mock for MVP)
        const flightStatus = await getFlightStatus(
          trip.airline_code,
          trip.flight_number,
          trip.scheduled_departure
        );

        // Track if flight has landed (before checkAndUpdateStatus modifies anything)
        const hasLanded = flightStatus.hasLanded || flightStatus.status === "ARRIVED";

        // Check if status changed and needs alert
        const shouldAlert = await checkAndUpdateStatus(supabase, trip, flightStatus);

        // Track completed flights
        if (hasLanded) {
          results.completed++;
        }

        if (shouldAlert) {
          // Trigger alert email
          const alertType = flightStatus.status === "CANCELLED" 
            ? "CANCELLATION" 
            : flightStatus.isOverbooked 
              ? "BUMPING" 
              : "DELAY";

          await triggerAlert(trip.id, alertType, flightStatus.delayMinutes);
          
          results.alerts_sent++;
          if (alertType === "CANCELLATION") results.cancellations++;
          else if (alertType === "DELAY") results.delays++;
        }
      } catch (err) {
        console.error(`Error checking trip ${trip.id}:`, err);
        results.errors++;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        ...results,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Cron job error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Get flight status from external API
 * 
 * For MVP: Returns mock data
 * For Production: Integrate with FlightAware, AviationStack, or similar
 */
async function getFlightStatus(
  airlineCode: string,
  flightNumber: string,
  scheduledDeparture: string
): Promise<FlightStatus> {
  
  // If we have a FlightAware API key, use real data
  if (FLIGHTAWARE_API_KEY) {
    try {
      const response = await fetch(
        `https://aeroapi.flightaware.com/aeroapi/flights/${airlineCode}${flightNumber}`,
        {
          headers: {
            "x-apikey": FLIGHTAWARE_API_KEY,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Parse FlightAware response (structure varies)
        const flight = data.flights?.[0];
        if (flight) {
          const delayMinutes = flight.departure_delay || 0;
          let status: FlightStatus["status"] = "ON_TIME";
          
          if (flight.cancelled) status = "CANCELLED";
          else if (delayMinutes >= 180) status = "DELAYED";
          else if (flight.actual_off) status = "DEPARTED";
          else if (flight.actual_on) status = "ARRIVED";

          return {
            status,
            delayMinutes: Math.max(0, delayMinutes),
            isOverbooked: false, // FlightAware doesn't provide this
            hasLanded: status === "ARRIVED",
          };
        }
      }
    } catch (err) {
      console.error("FlightAware API error:", err);
    }
  }

  // MVP: Return mock data based on random chance
  // In production, replace with real API integration
  
  // First check if the scheduled departure has passed - if so, mark as arrived
  const departureTime = new Date(scheduledDeparture).getTime();
  const now = Date.now();
  const hoursSinceDeparture = (now - departureTime) / (1000 * 60 * 60);
  
  // If flight was scheduled more than 6 hours ago, assume it has landed
  if (hoursSinceDeparture > 6) {
    return { 
      status: "ARRIVED", 
      delayMinutes: 0,
      hasLanded: true,
    };
  }
  
  // If flight departed 1-6 hours ago, it's likely in the air
  if (hoursSinceDeparture > 1) {
    return { 
      status: "DEPARTED", 
      delayMinutes: 0,
      hasLanded: false,
    };
  }
  
  const random = Math.random();
  
  // 70% on time, 20% delayed, 8% cancelled, 2% overbooked
  if (random < 0.70) {
    return { status: "ON_TIME", delayMinutes: 0, hasLanded: false };
  } else if (random < 0.90) {
    // Random delay between 30 min and 5 hours
    const delayMinutes = Math.floor(Math.random() * 270) + 30;
    return { 
      status: delayMinutes >= 180 ? "DELAYED" : "ON_TIME", 
      delayMinutes,
      hasLanded: false,
    };
  } else if (random < 0.98) {
    return { status: "CANCELLED", delayMinutes: 0, hasLanded: false };
  } else {
    // Overbooked scenario
    return { 
      status: "DELAYED", 
      delayMinutes: Math.floor(Math.random() * 180) + 60,
      isOverbooked: true,
      hasLanded: false,
    };
  }
}

/**
 * Check if status changed and update database
 * Returns true if an alert should be sent
 */
async function checkAndUpdateStatus(
  supabase: ReturnType<typeof createClient>,
  trip: any,
  newStatus: FlightStatus
): Promise<boolean> {
  
  // Check if flight has landed - update status to COMPLETED
  const hasLanded = newStatus.hasLanded || newStatus.status === "ARRIVED";
  
  if (hasLanded) {
    // Update trip to COMPLETED - flight has landed, no longer needs monitoring
    await supabase
      .from("trips")
      .update({ 
        status: "COMPLETED",
      })
      .eq("id", trip.id);
    
    console.log(`Trip ${trip.id} marked as COMPLETED - flight has landed`);
    
    // No alert needed for normal landing
    return false;
  }
  
  // Only alert for significant changes
  const significantDelay = newStatus.delayMinutes >= 180; // 3+ hours
  const isCancelled = newStatus.status === "CANCELLED";
  const isOverbooked = newStatus.isOverbooked;

  if (!significantDelay && !isCancelled && !isOverbooked) {
    return false;
  }

  // Check if we already sent an alert for this condition
  const { data: existingAlerts } = await supabase
    .from("flight_alerts")
    .select("alert_type")
    .eq("trip_id", trip.id)
    .order("sent_at", { ascending: false })
    .limit(1);

  const lastAlertType = existingAlerts?.[0]?.alert_type;

  // Don't re-alert for same condition
  if (isCancelled && lastAlertType === "CANCELLATION") return false;
  if (isOverbooked && lastAlertType === "BUMPING") return false;
  if (significantDelay && lastAlertType === "DELAY") return false;

  // Update trip status in database
  const newTripStatus = isCancelled ? "CANCELED" : trip.status;
  
  await supabase
    .from("trips")
    .update({ 
      status: newTripStatus,
      // Store delay info in a metadata field if you have one
    })
    .eq("id", trip.id);

  // If there's a significant issue, create a claim if one doesn't exist
  if (significantDelay || isCancelled || isOverbooked) {
    const { data: existingClaim } = await supabase
      .from("claims")
      .select("id")
      .eq("trip_id", trip.id)
      .single();

    if (!existingClaim) {
      // Calculate estimated compensation
      let estimatedPayout = 0;
      if (isOverbooked && trip.ticket_price) {
        const fare = trip.ticket_price;
        if (newStatus.delayMinutes <= 60) estimatedPayout = 0;
        else if (newStatus.delayMinutes <= 120) estimatedPayout = Math.min(fare * 2, 775);
        else estimatedPayout = Math.min(fare * 4, 1550);
      }

      await supabase.from("claims").insert({
        trip_id: trip.id,
        user_id: trip.user_id,
        status: "DRAFT",
        estimated_payout: estimatedPayout,
        is_unlocked: false,
        claim_type: isOverbooked ? "bumping" : isCancelled ? "cancellation" : "delay",
      });
    }
  }

  return true;
}

/**
 * Trigger the send-flight-alert function
 */
async function triggerAlert(
  tripId: string,
  alertType: "DELAY" | "CANCELLATION" | "BUMPING",
  delayMinutes: number
): Promise<void> {
  const alertFunctionUrl = `${SUPABASE_URL}/functions/v1/send-flight-alert`;
  
  await fetch(alertFunctionUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tripId,
      alertType,
      delayMinutes,
    }),
  });
}


