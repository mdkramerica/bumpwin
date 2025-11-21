import Hero from "@/components/marketing/hero";
import MiseryMeter from "@/components/dashboard/misery-meter";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-900 text-white">
      <Hero />
      
      {/* Demo Section for Misery Meter */}
      <section id="how-it-works" className="py-24 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-12 font-display">
            HOW IT WORKS
          </h2>
          
          <div className="grid gap-12 md:grid-cols-2 max-w-4xl mx-auto items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-lime-400">
                1. We Track The Misery
              </h3>
              <p className="text-slate-400 text-lg">
                Every minute you wait increases your chance of a payout. 
                We monitor your flight in real-time.
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-lime-400 rounded-full" />
                  Real-time delay tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-lime-400 rounded-full" />
                  Cancellation monitoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-lime-400 rounded-full" />
                  Instant eligibility check
                </li>
              </ul>
            </div>

            {/* Demo Meter: Set to a Winning State */}
            <div className="transform scale-90 md:scale-100">
              <MiseryMeter delayMinutes={210} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
