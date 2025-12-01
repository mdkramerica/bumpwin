import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MiseryMeter from "@/components/dashboard/misery-meter";
import ClaimLock from "@/components/dashboard/claim-lock";
import ClaimLetter from "@/components/dashboard/claim-letter";
import FlightInfoCard from "@/components/dashboard/flight-info-card";
import BountyCard from "@/components/viral/bounty-card";
import SocialShare from "@/components/viral/social-share";
import EmailCapture from "@/components/marketing/email-capture";
import { addFlight } from "@/app/actions";
import { logout } from "@/app/auth/actions";
import { Plus, History, LogOut, Plane, ChevronRight, Bell } from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const { error, new: isNew } = await searchParams;
  const errorMessage = typeof error === "string" ? error : null;
  const showNewForm = isNew === 'true';
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to Login if not authenticated
    redirect("/login");
  }

  // Fetch User's Data
  const { data: trips } = await supabase
    .from("trips")
    .select("*, claims(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Also fetch User profile for Referral Code
  // Note: If user doesn't exist in users table yet (trigger might not have run), handle gracefully
  let userProfile = null;
  const { data: profileData, error: userProfileError } = await supabase
    .from("users")
    .select("referral_code, total_referral_earnings")
    .eq("id", user.id)
    .single();
  
  // If user profile doesn't exist, create it (fallback if trigger didn't run)
  if (userProfileError && (userProfileError as any).code === 'PGRST116') {
    // User doesn't exist in users table, create it
    const { data: newUser } = await supabase
      .from("users")
      .insert({
        id: user.id,
        email: user.email || '',
      })
      .select()
      .single();
    userProfile = newUser || { referral_code: null, total_referral_earnings: 0 };
  } else {
    userProfile = profileData;
  }

  const latestTrip = showNewForm ? null : trips?.[0];
  const latestClaim = latestTrip?.claims?.[0]; // Assuming 1:1 for MVP
  // Use actual delay from database, default to 0 if not set
  const currentDelay = latestTrip?.delay_minutes || 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 pb-24">
      <div className="max-w-md mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center gap-2">
          <Link href="/" className="text-xl font-bold font-display text-lime-400 hover:opacity-80 flex-shrink-0">
            BUMPWIN
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500 truncate max-w-[100px] sm:max-w-[150px]">{user.email}</div>
            <form action={logout}>
              <button 
                type="submit"
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-800"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </header>

        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg text-center animate-in fade-in slide-in-from-top-2">
            {errorMessage}
          </div>
        )}

        {/* Welcome Card for New Users (no trips yet) */}
        {(!trips || trips.length === 0) && !showNewForm && (
          <section className="bg-gradient-to-br from-lime-400/10 to-emerald-500/5 border border-lime-400/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-lime-400 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">Welcome to BumpWin!</h2>
                <p className="text-sm text-slate-400">Get alerts when your flights qualify for compensation.</p>
              </div>
            </div>
            <EmailCapture 
              variant="minimal"
              tag="post-signup"
              className="pt-2"
            />
            <p className="text-xs text-slate-500 text-center">
              Or track a flight below to get started.
            </p>
          </section>
        )}

        {/* 1. Flight Input (Only show if no active trip) */}
        {!latestTrip && (
          <section className="space-y-4">
             <h2 className="text-2xl font-bold">Track Your Flight</h2>
             <p className="text-sm text-slate-400">Add a past incident or track an upcoming flight for alerts.</p>
             <form action={addFlight} className="space-y-3">
               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="block text-xs font-medium text-slate-400 mb-1">AIRLINE CODE</label>
                   <input 
                     name="airline" 
                     type="text" 
                     placeholder="e.g. WN" 
                     maxLength={3}
                     className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-lime-400 outline-none transition-colors uppercase"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-slate-400 mb-1">FLIGHT NUMBER</label>
                   <input 
                     name="flightNum" 
                     type="text" 
                     placeholder="e.g. 4207" 
                     className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-lime-400 outline-none transition-colors"
                     required
                   />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="block text-xs font-medium text-slate-400 mb-1">FLIGHT DATE</label>
                   <input 
                     name="flightDate" 
                     type="date" 
                     className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-lime-400 outline-none transition-colors [color-scheme:dark]"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-slate-400 mb-1">SCHEDULED TIME</label>
                   <input 
                     name="flightTime" 
                     type="time" 
                     className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-lime-400 outline-none transition-colors [color-scheme:dark]"
                   />
                 </div>
               </div>
               <p className="text-[10px] text-slate-500 -mt-2">Future dates = we'll monitor & alert you. Past dates = file a claim.</p>
               <div>
                 <label className="block text-xs font-medium text-slate-400 mb-1">STATUS <span className="text-slate-500">(What happened or will happen?)</span></label>
                 <select 
                   name="issueType"
                   id="issueType"
                   className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-lime-400 outline-none transition-colors"
                   required
                 >
                   <option value="">Select status...</option>
                   <option value="UPCOMING">📅 Upcoming flight - monitor for issues</option>
                   <option value="DELAY">⏰ Flight was delayed</option>
                   <option value="CANCELLATION">❌ Flight was cancelled</option>
                   <option value="BUMPING">🚫 I was involuntarily bumped</option>
                 </select>
               </div>
               
               {/* Delay Duration - only shown when DELAY or BUMPING is selected (handled client-side) */}
               <div id="delayDurationField">
                 <label className="block text-xs font-medium text-slate-400 mb-1">DELAY DURATION <span className="text-slate-500">(how late did you arrive?)</span></label>
                 <div className="grid grid-cols-2 gap-3">
                   <div className="relative">
                     <input 
                       name="delayHours" 
                       type="number" 
                       placeholder="0" 
                       min="0"
                       max="48"
                       defaultValue="0"
                       className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-lime-400 outline-none transition-colors"
                     />
                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">hours</span>
                   </div>
                   <div className="relative">
                     <input 
                       name="delayMins" 
                       type="number" 
                       placeholder="0" 
                       min="0"
                       max="59"
                       defaultValue="0"
                       className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-lime-400 outline-none transition-colors"
                     />
                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">mins</span>
                   </div>
                 </div>
                 <p className="text-[10px] text-slate-500 mt-1">For bumping: how late you arrived at final destination vs original schedule</p>
               </div>
               <div>
                 <label className="block text-xs font-medium text-slate-400 mb-1">TICKET PRICE <span className="text-slate-500">(one-way, optional)</span></label>
                 <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                   <input 
                     name="ticketPrice" 
                     type="number" 
                     placeholder="e.g. 350" 
                     min="0"
                     step="0.01"
                     className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pl-7 text-white focus:border-lime-400 outline-none transition-colors"
                   />
                 </div>
                 <p className="text-[10px] text-slate-500 mt-1">Important for bumping claims - compensation is based on fare paid</p>
               </div>
               
               {/* Email Alerts Checkbox */}
               <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                 <label className="flex items-start gap-3 cursor-pointer">
                   <input 
                     type="checkbox" 
                     name="enableAlerts"
                     defaultChecked
                     className="mt-1 w-4 h-4 accent-lime-400"
                   />
                   <div>
                     <span className="text-white text-sm font-medium">Email me alerts</span>
                     <p className="text-xs text-slate-500">Get notified if your flight is delayed, cancelled, or you become eligible for compensation</p>
                   </div>
                 </label>
               </div>
               
               <button type="submit" className="w-full bg-lime-400 text-slate-900 font-bold py-4 rounded-lg hover:bg-lime-300 transition-transform active:scale-95">
                 TRACK FLIGHT
               </button>
             </form>
          </section>
        )}

        {/* 2. Flight Info Card + Misery Meter (Show if trip exists) */}
        {latestTrip && (
          <section className="space-y-6">
             {/* Detailed Flight Info Card */}
             <FlightInfoCard
               airlineCode={latestTrip.airline_code}
               flightNumber={latestTrip.flight_number}
               scheduledDeparture={latestTrip.scheduled_departure}
               status={latestTrip.status}
               delayMinutes={currentDelay}
               ticketPrice={latestTrip.ticket_price}
               isBumping={latestTrip.issue_type === "BUMPING"}
               isCancelled={latestTrip.issue_type === "CANCELLATION"}
               issueType={latestTrip.issue_type}
               dataSource={latestTrip.data_source}
             />
             
             {/* The Misery Meter */}
             <div>
               <p className="text-center text-slate-500 text-xs mb-3 uppercase tracking-wider">Delay Status</p>
               <MiseryMeter delayMinutes={currentDelay} />
             </div>
          </section>
        )}

        {/* 3. The Paywall (Show if CLAIM exists and is LOCKED) */}
        {latestClaim && !latestClaim.is_unlocked && (
          <section className="pt-4">
             <ClaimLock claimId={latestClaim.id} estimatedPayout={latestClaim.estimated_payout || 600} />
          </section>
        )}

        {/* 4. Success State (Unlocked) */}
        {latestClaim && latestClaim.is_unlocked && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* The Reward: The Letter */}
            <section className="pt-4">
               <ClaimLetter airline={latestTrip.airline_code} />
            </section>

            {/* The Viral Loop: Share Buttons */}
            <section>
               <SocialShare airline={latestTrip.airline_code} />
            </section>

            {/* The Growth Loop: Bounty Card */}
            <section className="pt-4">
              <BountyCard 
                 referralCode={userProfile?.referral_code || "GENERATE"} 
                 earnings={userProfile?.total_referral_earnings || 0}
              />
            </section>
          </div>
        )}
        
        {/* 5. Claims History / Reset */}
        {trips && trips.length > 0 && (
          <section className="border-t border-slate-800 pt-8 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <History className="w-4 h-4" />
                YOUR HISTORY
              </h3>
              <Link href="/dashboard?new=true" className="text-xs text-lime-400 hover:text-lime-300 flex items-center gap-1">
                 <Plus className="w-3 h-3" />
                 Track New Flight
              </Link>
            </div>
            
            <div className="space-y-3">
              {trips.map((trip) => {
                const claim = trip.claims?.[0];
                return (
                  <Link 
                    key={trip.id} 
                    href={`/flight/${trip.id}`}
                    className="block bg-slate-800/50 hover:bg-slate-800 rounded-lg p-4 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-700 group-hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors">
                        <Plane className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="font-bold text-sm group-hover:text-lime-400 transition-colors">
                          {trip.airline_code} {trip.flight_number}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(trip.scheduled_departure).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {claim?.is_unlocked ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-lime-400/10 text-lime-400">
                          UNLOCKED
                        </span>
                      ) : trip.status === "UPCOMING" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400">
                          UPCOMING
                        </span>
                      ) : trip.status === "COMPLETED" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-lime-500/10 text-lime-400">
                          COMPLETED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-slate-700 text-slate-400">
                          {trip.status}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}