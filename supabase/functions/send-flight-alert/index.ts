/**
 * Supabase Edge Function: send-flight-alert
 * 
 * This function sends email alerts to users when their tracked flights
 * experience delays, cancellations, or become eligible for compensation.
 * 
 * Trigger: Called by a cron job or webhook when flight status changes
 * 
 * Required Environment Variables:
 * - RESEND_API_KEY: API key for Resend email service
 * - SUPABASE_URL: Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Service role key for database access
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Airline name mapping
const AIRLINE_NAMES: Record<string, string> = {
  "AA": "American Airlines",
  "UA": "United Airlines",
  "DL": "Delta Air Lines",
  "WN": "Southwest Airlines",
  "B6": "JetBlue Airways",
  "AS": "Alaska Airlines",
  "NK": "Spirit Airlines",
  "F9": "Frontier Airlines",
};

interface AlertPayload {
  tripId: string;
  alertType: "DELAY" | "CANCELLATION" | "BUMPING" | "TRACKING_CONFIRMATION";
  delayMinutes?: number;
}

serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: AlertPayload = await req.json();
    const { tripId, alertType, delayMinutes } = payload;

    if (!tripId || !alertType) {
      return new Response(
        JSON.stringify({ error: "Missing tripId or alertType" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch trip and user data
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .select(`
        *,
        users (
          id,
          email
        )
      `)
      .eq("id", tripId)
      .single();

    if (tripError || !trip) {
      console.error("Trip fetch error:", tripError);
      return new Response(
        JSON.stringify({ error: "Trip not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userEmail = trip.users?.email;
    if (!userEmail) {
      return new Response(
        JSON.stringify({ error: "User email not found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const airlineName = AIRLINE_NAMES[trip.airline_code] || trip.airline_code;
    const flightDate = new Date(trip.scheduled_departure).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // Calculate estimated compensation for bumping
    let estimatedCompensation = 0;
    if (alertType === "BUMPING" && delayMinutes) {
      const fare = trip.ticket_price || 300;
      if (delayMinutes <= 60) estimatedCompensation = 0;
      else if (delayMinutes <= 120) estimatedCompensation = Math.min(fare * 2, 775);
      else estimatedCompensation = Math.min(fare * 4, 1550);
    }

    // Generate email content based on alert type
    const emailContent = generateEmailContent(alertType, {
      airlineCode: trip.airline_code,
      airlineName,
      flightNumber: trip.flight_number,
      flightDate,
      delayMinutes,
      estimatedCompensation,
    });

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BumpWin Alerts <alerts@bumpwin.com>",
        to: [userEmail],
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Resend API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: errorData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailResult = await emailResponse.json();

    // Log the alert in database (optional - for tracking)
    await supabase.from("flight_alerts").insert({
      trip_id: tripId,
      user_id: trip.user_id,
      alert_type: alertType,
      sent_at: new Date().toISOString(),
      email_id: emailResult.id,
    }).catch(err => console.log("Alert logging skipped:", err));

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Generate email content based on alert type
 */
function generateEmailContent(
  alertType: string,
  data: {
    airlineCode: string;
    airlineName: string;
    flightNumber: string;
    flightDate: string;
    delayMinutes?: number;
    estimatedCompensation?: number;
  }
): { subject: string; html: string; text: string } {
  const { airlineCode, airlineName, flightNumber, flightDate, delayMinutes, estimatedCompensation } = data;
  const delayHours = delayMinutes ? Math.floor(delayMinutes / 60) : 0;
  const delayMins = delayMinutes ? delayMinutes % 60 : 0;
  const delayText = `${delayHours}h ${delayMins}m`;

  switch (alertType) {
    case "DELAY":
      return {
        subject: `⏰ Your ${airlineCode} ${flightNumber} flight is delayed`,
        html: generateDelayEmailHtml(airlineCode, airlineName, flightNumber, flightDate, delayText),
        text: `Your flight ${airlineCode} ${flightNumber} has been delayed by ${delayText}. While US law doesn't require cash compensation for delays, you may request meal vouchers, rebooking, or file a DOT complaint. View details: https://bumpwin.com/dashboard`,
      };

    case "CANCELLATION":
      return {
        subject: `❌ Your ${airlineCode} ${flightNumber} flight has been CANCELLED`,
        html: generateCancellationEmailHtml(airlineCode, airlineName, flightNumber, flightDate),
        text: `Your flight ${airlineCode} ${flightNumber} on ${flightDate} has been cancelled. You are entitled to a full refund. View details: https://bumpwin.com/dashboard`,
      };

    case "BUMPING":
      return {
        subject: `💰 You may be owed up to $${estimatedCompensation} - ${airlineCode} ${flightNumber}`,
        html: generateBumpingEmailHtml(airlineCode, airlineName, flightNumber, flightDate, estimatedCompensation || 1550),
        text: `Your flight ${airlineCode} ${flightNumber} is overbooked. If involuntarily denied boarding, you may be owed up to $${estimatedCompensation}. Claim now: https://bumpwin.com/dashboard`,
      };

    case "TRACKING_CONFIRMATION":
    default:
      return {
        subject: `✅ Now tracking ${airlineCode} ${flightNumber}`,
        html: generateTrackingEmailHtml(airlineCode, airlineName, flightNumber, flightDate),
        text: `We're now tracking your flight ${airlineCode} ${flightNumber} on ${flightDate}. We'll alert you about delays, cancellations, and compensation eligibility. View: https://bumpwin.com/dashboard`,
      };
  }
}

// Simplified HTML generators (full versions in lib/email-templates.ts)
function generateDelayEmailHtml(airlineCode: string, airlineName: string, flightNumber: string, flightDate: string, delayText: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1e293b; color: white; padding: 30px; border-radius: 16px;">
      <h1 style="color: #a3e635; margin-bottom: 20px;">BUMPWIN</h1>
      <div style="background: #f59e0b20; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #fbbf24; margin: 0;">⏰ Flight Delay Detected</h2>
        <p style="color: #fcd34d; margin: 10px 0 0 0;">Your flight has been delayed by <strong>${delayText}</strong></p>
      </div>
      <div style="background: #0f172a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: #64748b; margin: 0; font-size: 12px;">FLIGHT</p>
        <p style="color: white; font-size: 24px; font-weight: bold; margin: 5px 0;">${airlineCode} ${flightNumber}</p>
        <p style="color: #94a3b8; margin: 0;">${airlineName} · ${flightDate}</p>
      </div>
      <p style="color: #94a3b8; font-size: 14px;">While US law doesn't require cash compensation for delays, you may request meal vouchers, rebooking, or file a DOT complaint.</p>
      <a href="https://bumpwin.com/dashboard" style="display: inline-block; background: #a3e635; color: #0f172a; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">View Flight Status</a>
    </div>
  `;
}

function generateCancellationEmailHtml(airlineCode: string, airlineName: string, flightNumber: string, flightDate: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1e293b; color: white; padding: 30px; border-radius: 16px;">
      <h1 style="color: #a3e635; margin-bottom: 20px;">BUMPWIN</h1>
      <div style="background: #ef444420; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #f87171; margin: 0;">❌ Flight Cancelled</h2>
      </div>
      <div style="background: #0f172a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: white; font-size: 24px; font-weight: bold; margin: 0;">${airlineCode} ${flightNumber}</p>
        <p style="color: #94a3b8; margin: 5px 0 0 0;">${airlineName} · ${flightDate}</p>
      </div>
      <p style="color: #a3e635; font-weight: bold;">✅ Your Rights:</p>
      <ul style="color: #94a3b8;">
        <li>Full refund to your original payment method</li>
        <li>Rebooking on the next available flight</li>
        <li>Meal vouchers and hotel if stranded</li>
      </ul>
      <a href="https://bumpwin.com/dashboard" style="display: inline-block; background: #a3e635; color: #0f172a; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">File Your Complaint</a>
    </div>
  `;
}

function generateBumpingEmailHtml(airlineCode: string, airlineName: string, flightNumber: string, flightDate: string, compensation: number): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1e293b; color: white; padding: 30px; border-radius: 16px;">
      <h1 style="color: #a3e635; margin-bottom: 20px;">BUMPWIN</h1>
      <div style="background: #a3e63520; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #a3e635; margin: 0;">💰 Cash Compensation Available!</h2>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #64748b; margin: 0;">POTENTIAL COMPENSATION</p>
        <p style="color: #a3e635; font-size: 48px; font-weight: bold; margin: 10px 0;">Up to $${compensation}</p>
      </div>
      <div style="background: #0f172a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: white; font-size: 20px; font-weight: bold; margin: 0;">${airlineCode} ${flightNumber}</p>
        <p style="color: #94a3b8; margin: 5px 0 0 0;">${airlineName} · ${flightDate}</p>
      </div>
      <p style="color: #94a3b8;">If involuntarily denied boarding, US law <strong style="color: white;">requires</strong> cash compensation.</p>
      <a href="https://bumpwin.com/dashboard" style="display: inline-block; background: #a3e635; color: #0f172a; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">Claim Your Compensation</a>
    </div>
  `;
}

function generateTrackingEmailHtml(airlineCode: string, airlineName: string, flightNumber: string, flightDate: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1e293b; color: white; padding: 30px; border-radius: 16px;">
      <h1 style="color: #a3e635; margin-bottom: 20px;">BUMPWIN</h1>
      <div style="text-align: center; margin: 20px 0;">
        <p style="font-size: 40px; margin: 0;">✈️</p>
        <h2 style="color: white; margin: 10px 0;">Flight Tracking Active</h2>
      </div>
      <div style="background: #0f172a; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <p style="color: #64748b; margin: 0; font-size: 12px;">TRACKING</p>
        <p style="color: white; font-size: 28px; font-weight: bold; margin: 5px 0;">${airlineCode} ${flightNumber}</p>
        <p style="color: #94a3b8; margin: 0;">${airlineName}</p>
        <p style="color: #64748b; margin: 5px 0 0 0;">${flightDate}</p>
      </div>
      <p style="color: #94a3b8;">We'll alert you about delays, cancellations, and compensation eligibility.</p>
      <a href="https://bumpwin.com/dashboard" style="display: inline-block; background: #a3e635; color: #0f172a; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">View Dashboard</a>
    </div>
  `;
}


