import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plane, Calendar, Clock, DollarSign, AlertTriangle, CheckCircle2, XCircle, Timer } from "lucide-react";
import FlightInfoCard from "@/components/dashboard/flight-info-card";
import MiseryMeter from "@/components/dashboard/misery-meter";
import ClaimLock from "@/components/dashboard/claim-lock";
import ClaimLetter from "@/components/dashboard/claim-letter";
import SocialShare from "@/components/viral/social-share";

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
  "HA": "Hawaiian Airlines",
  "SY": "Sun Country Airlines",
};

export default async function FlightDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?message=Please log in to view flight details.");
  }

  // Fetch trip with claim
  const { data: trip, error } = await supabase
    .from("trips")
    .select(`
      *,
      claims (*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !trip) {
    redirect("/dashboard?error=Flight not found.");
  }

  // Check if an UPCOMING flight's scheduled departure has passed
  const now = new Date();
  const scheduledDeparture = new Date(trip.scheduled_departure);
  const bufferHours = 6; // Buffer for flight duration
  const cutoffTime = new Date(scheduledDeparture.getTime() + bufferHours * 60 * 60 * 1000);
  const isFlightInPast = now > cutoffTime;
  
  // Auto-correct status for past UPCOMING flights
  let effectiveStatus = trip.status;
  if (trip.status === "UPCOMING" && trip.issue_type === "UPCOMING" && isFlightInPast) {
    effectiveStatus = "COMPLETED";
    // Update database in background
    supabase
      .from("trips")
      .update({ status: "COMPLETED" })
      .eq("id", trip.id)
      .then(({ error }) => {
        if (error) {
          console.error("Failed to auto-update trip status:", error);
        }
      });
  }

  const claim = trip.claims?.[0];
  const airlineName = AIRLINE_NAMES[trip.airline_code] || trip.airline_code;
  
  // Determine claim type from trip status or claim
  const claimType: "bumping" | "delay" | "cancellation" = 
    claim?.claim_type || 
    (effectiveStatus === "CANCELED" ? "cancellation" : "delay");
  
  // Use delay from trip data, or 0 for upcoming flights
  const delayMinutes = effectiveStatus === "UPCOMING" ? 0 : (trip.delay_minutes || 0);
  
  // Format dates
  const scheduledDate = new Date(trip.scheduled_departure);
  const formattedDate = scheduledDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = scheduledDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Status badge styling
  const getStatusBadge = () => {
    switch (effectiveStatus) {
      case "UPCOMING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Timer className="w-3 h-3" />
            MONITORING
          </span>
        );
      case "CANCELED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" />
            CANCELLED
          </span>
        );
      case "COMPLETED":
        return delayMinutes >= 180 ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <AlertTriangle className="w-3 h-3" />
            DELAYED
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle2 className="w-3 h-3" />
            COMPLETED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 pb-24">
      <div className="max-w-lg mx-auto space-y-6">
        
        {/* Header with Back Button */}
        <header className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold font-display">Flight Details</h1>
            <p className="text-xs text-slate-500">View and manage your claim</p>
          </div>
          {getStatusBadge()}
        </header>

        {/* Flight Info Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
          {/* Airline Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-lime-400/10 rounded-xl flex items-center justify-center">
                <Plane className="w-7 h-7 text-lime-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold font-display">
                  {trip.airline_code} {trip.flight_number}
                </h2>
                <p className="text-slate-400">{airlineName}</p>
              </div>
            </div>
          </div>

          {/* Flight Details Grid */}
          <div className="grid grid-cols-2 divide-x divide-slate-700">
            <div className="p-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Calendar className="w-3 h-3" />
                DATE
              </div>
              <p className="text-white font-medium text-sm">{formattedDate}</p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Clock className="w-3 h-3" />
                TIME
              </div>
              <p className="text-white font-medium text-sm">{formattedTime}</p>
            </div>
          </div>

          {/* Ticket Price */}
          {trip.ticket_price && (
            <div className="p-4 border-t border-slate-700">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <DollarSign className="w-3 h-3" />
                TICKET PRICE
              </div>
              <p className="text-white font-bold text-lg">${trip.ticket_price.toFixed(2)}</p>
            </div>
          )}

          {/* Status Message for Upcoming */}
          {effectiveStatus === "UPCOMING" && (
            <div className="p-4 border-t border-slate-700 bg-blue-500/5">
              <div className="flex items-start gap-3">
                <Timer className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-300 mb-1">Monitoring Active</h3>
                  <p className="text-sm text-slate-400">
                    We're watching this flight for delays, cancellations, and overbooking. 
                    You'll receive an email alert if anything changes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Delay Info for Completed/Delayed */}
          {effectiveStatus === "COMPLETED" && delayMinutes > 0 && (
            <div className="p-4 border-t border-slate-700 bg-orange-500/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-orange-300 mb-1">
                    {Math.floor(delayMinutes / 60)}h {delayMinutes % 60}m Delay Detected
                  </h3>
                  <p className="text-sm text-slate-400">
                    {delayMinutes >= 180 
                      ? "This qualifies as a significant delay. Check your compensation options below."
                      : "This delay may not qualify for compensation, but you can still file a complaint."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Info */}
          {effectiveStatus === "CANCELED" && (
            <div className="p-4 border-t border-slate-700 bg-red-500/5">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-300 mb-1">Flight Cancelled</h3>
                  <p className="text-sm text-slate-400">
                    You are entitled to a full refund. You may also request reimbursement for expenses 
                    and goodwill compensation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Misery Meter (for non-upcoming flights) */}
        {effectiveStatus !== "UPCOMING" && (
          <div>
            <p className="text-center text-slate-500 text-xs mb-3 uppercase tracking-wider">Delay Status</p>
            <MiseryMeter delayMinutes={delayMinutes} />
          </div>
        )}

        {/* Claim Section */}
        {claim && !claim.is_unlocked && effectiveStatus !== "UPCOMING" && (
          <section>
            <ClaimLock claimId={claim.id} estimatedPayout={claim.estimated_payout || 600} />
          </section>
        )}

        {/* Unlocked Claim - Show Letter */}
        {claim && claim.is_unlocked && (
          <div className="space-y-8">
            <section>
              <ClaimLetter airline={trip.airline_code} />
            </section>
            
            <section>
              <p className="text-center text-sm text-slate-400 mb-2">Share your experience and help others.</p>
              <SocialShare airline={trip.airline_code} />
            </section>
          </div>
        )}

        {/* No Claim Yet (Upcoming Flight) */}
        {!claim && effectiveStatus === "UPCOMING" && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Timer className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Waiting for Flight</h3>
            <p className="text-sm text-slate-400 mb-4">
              We'll automatically create a claim if your flight is delayed, cancelled, or you're denied boarding.
            </p>
            <div className="text-xs text-slate-500">
              Alerts enabled • Monitoring active
            </div>
          </div>
        )}

        {/* Flight Completed - No issues detected (for auto-completed UPCOMING flights) */}
        {!claim && effectiveStatus === "COMPLETED" && trip.issue_type === "UPCOMING" && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Flight Completed</h3>
            <p className="text-sm text-slate-400 mb-4">
              This flight has landed. No significant issues were detected during monitoring.
            </p>
            <div className="text-xs text-slate-500">
              Have a great trip!
            </div>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="pt-4">
          <Link 
            href="/dashboard"
            className="block w-full text-center py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-medium transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}


