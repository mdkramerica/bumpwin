import Link from "next/link";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { COMPENSATION_RULES, Region, TriggerType } from "@/lib/rules-data/rules";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="font-display font-bold text-xl text-lime-400">BUMPWIN KNOWLEDGE BASE</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <section className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight">
            KNOW YOUR <span className="text-lime-400">RIGHTS</span>.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Airlines bank on you not knowing the rules. We've compiled the definitive database of every trigger that entitles you to compensation in the US and EU.
          </p>
        </section>

        {/* Rules Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {COMPENSATION_RULES.map((rule) => (
            <div key={rule.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-lime-400/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  rule.region === "US" ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {rule.region} REGION
                </span>
                <span className="text-xs font-mono text-slate-500">{rule.source}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-2 font-display group-hover:text-lime-400 transition-colors">
                {rule.title}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">The Trigger</div>
                  <p className="text-slate-300 text-sm">{rule.condition}</p>
                </div>
                
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">The Payout</div>
                  <p className="text-lime-400 font-bold text-lg">{rule.compensation}</p>
                </div>

                <div className="pt-4 border-t border-slate-700/50">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <section className="mt-24 text-center bg-slate-800 rounded-2xl p-12 border border-slate-700">
          <h2 className="text-3xl font-bold mb-4 font-display">Did one of these happen to you?</h2>
          <p className="text-slate-400 mb-8">Don't leave money on the table. Start your claim in seconds.</p>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 transition-transform bg-lime-400 rounded-full hover:scale-105 hover:bg-lime-300 active:scale-95"
          >
            Check My Flight Now
          </Link>
        </section>

      </main>
    </div>
  );
}

