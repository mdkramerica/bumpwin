import Hero from "@/components/marketing/hero";
import Link from "next/link";
import { Plane, FileText, DollarSign, AlertTriangle, CheckCircle2, ArrowRight, Users } from "lucide-react";
import EmailCapture from "@/components/marketing/email-capture";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-900 text-white">
      <Hero />
      
      {/* What We Help With Section */}
      <section className="py-16 sm:py-24 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-4 font-display">
            WHEN ARE YOU OWED MONEY?
          </h2>
          <p className="text-slate-400 text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
            Compensation rules differ between the US and EU. Here's what triggers your rights:
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {/* US Rules Card */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-blue-400 rounded-full" />
                <h3 className="text-xl font-bold">United States</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Involuntary Bumping</p>
                    <p className="text-sm text-slate-400">Up to $1,550 cash if denied boarding due to overbooking</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Tarmac Delays (3+ hrs)</p>
                    <p className="text-sm text-slate-400">Right to deplane, food, water — but no cash compensation</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-400">Delays & Cancellations</p>
                    <p className="text-sm text-slate-500">No federal cash mandate — but airlines may offer vouchers</p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">
                Source: 14 CFR Part 250, DOT Tarmac Delay Rules
              </p>
            </div>
            
            {/* EU Rules Card */}
            <div className="bg-slate-900 border border-lime-400/30 rounded-2xl p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2 py-0.5 bg-lime-400/10 border border-lime-400/30 rounded text-[10px] font-bold text-lime-400">
                STRONGER RIGHTS
              </div>
              
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                <h3 className="text-xl font-bold">European Union</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Delays (3+ hours)</p>
                    <p className="text-sm text-slate-400">€250–€600 cash depending on distance</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Cancellations</p>
                    <p className="text-sm text-slate-400">Full refund + up to €600 if notified &lt;14 days before</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Denied Boarding</p>
                    <p className="text-sm text-slate-400">Up to €600 + rebooking or refund</p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">
                Source: EU Regulation EC 261/2004
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/rules" 
              className="inline-flex items-center gap-2 text-lime-400 hover:text-lime-300 font-medium"
            >
              See all compensation rules →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-4 font-display">
            HOW BUMPWIN WORKS
          </h2>
          <p className="text-slate-400 text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
            We help you understand your rights and generate the paperwork to claim what you're owed.
          </p>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center mx-auto">
                <Plane className="w-8 h-8 text-lime-400" />
              </div>
              <h3 className="text-xl font-bold">1. Enter Your Flight</h3>
              <p className="text-slate-400">
                Tell us your airline and flight number. We'll check what happened and what you might be owed.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-lime-400" />
              </div>
              <h3 className="text-xl font-bold">2. Get Your Letter</h3>
              <p className="text-slate-400">
                We generate a professional demand letter citing the exact regulations that apply to your case.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center mx-auto">
                <DollarSign className="w-8 h-8 text-lime-400" />
              </div>
              <h3 className="text-xl font-bold">3. Submit & Collect</h3>
              <p className="text-slate-400">
                Send the letter to the airline. We provide step-by-step instructions and escalation paths.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 transition-transform bg-lime-400 rounded-full hover:scale-105 hover:bg-lime-300 active:scale-95"
            >
              Check My Eligibility
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Email Capture Section - Bottom of Page */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-400/10 border border-lime-400/30 rounded-full text-xs font-medium text-lime-400 mb-4">
              <Users className="w-3 h-3" />
              Join 10,000+ travelers
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display mb-4">
              NEVER MISS OUT ON MONEY YOU'RE OWED
            </h2>
            <p className="text-slate-400">
              Get instant alerts when your flights are delayed, cancelled, or overbooked. 
              We'll tell you exactly what you're entitled to.
            </p>
          </div>
          
          <EmailCapture 
            variant="card"
            tag="homepage-bottom"
            headline="Get Free Compensation Alerts"
            subheadline="Know your rights before the airline tells you nothing."
            buttonText="Subscribe Free"
            showFirstName={true}
            className="max-w-md mx-auto"
          />
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="py-8 bg-slate-800/30 border-y border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-400">
              <strong className="text-slate-300">Important:</strong> BumpWin provides informational tools only. We are not a law firm and do not guarantee any outcome. Compensation depends on your specific situation, the airline's policies, and applicable regulations. 
              <Link href="/terms" className="text-lime-400 hover:underline ml-1">See full terms</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
