import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MiseryMeter from "@/components/dashboard/misery-meter";
import ClaimLock from "@/components/dashboard/claim-lock";
import ClaimLetter from "@/components/dashboard/claim-letter";
import BountyCard from "@/components/viral/bounty-card";
import SocialShare from "@/components/viral/social-share";
import { addFlight } from "@/app/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
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
  if (userProfileError && userProfileError.code === 'PGRST116') {
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

  const latestTrip = trips?.[0];
  const latestClaim = latestTrip?.claims?.[0]; // Assuming 1:1 for MVP
  const currentDelay = latestTrip ? 200 : 0; // Hardcoded "Winner" delay for demo if trip exists

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-md mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-xl font-bold font-display text-lime-400">BUMPWIN</h1>
          <div className="text-xs text-slate-500">{user.email}</div>
        </header>

        {/* 1. Flight Input (Only show if no active trip) */}
        {!latestTrip && (
          <section className="space-y-4">
             <h2 className="text-2xl font-bold">Track Your Flight</h2>
             <form action={addFlight} className="space-y-3">
               <div>
                 <label className="block text-xs font-medium text-slate-400 mb-1">AIRLINE CODE</label>
                 <input 
                   name="airline" 
                   type="text" 
                   placeholder="e.g. UA" 
                   className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-lime-400 outline-none transition-colors uppercase"
                   required
                 />
               </div>
               <div>
                 <label className="block text-xs font-medium text-slate-400 mb-1">FLIGHT NUMBER</label>
                 <input 
                   name="flightNum" 
                   type="text" 
                   placeholder="e.g. 249" 
                   className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-lime-400 outline-none transition-colors"
                   required
                 />
               </div>
               <button type="submit" className="w-full bg-lime-400 text-slate-900 font-bold py-4 rounded-lg hover:bg-lime-300 transition-transform active:scale-95">
                 START MONITORING
               </button>
             </form>
          </section>
        )}

        {/* 2. The Misery Meter (Show if trip exists) */}
        {latestTrip && (
          <section>
             <div className="mb-6 text-center">
                <h2 className="text-lg font-bold">{latestTrip.airline_code} {latestTrip.flight_number}</h2>
                <p className="text-slate-500 text-sm">Monitoring Delay Status...</p>
             </div>
             <MiseryMeter delayMinutes={currentDelay} />
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
               <ClaimLetter />
            </section>

            {/* The Viral Loop: Share Buttons */}
            <section>
               <p className="text-center text-sm text-slate-400 mb-2">Don't keep the victory to yourself.</p>
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

      </div>
    </div>
  );
}
