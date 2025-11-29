"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, X, Scale, Lightbulb, ClipboardList } from "lucide-react";
import { COMPENSATION_RULES, CompensationRule } from "@/lib/rules-data/rules";

export default function RulesPage() {
  const [selectedRule, setSelectedRule] = useState<CompensationRule | null>(null);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="font-display font-bold text-sm sm:text-xl text-lime-400">
            <span className="hidden sm:inline">BUMPWIN KNOWLEDGE BASE</span>
            <span className="sm:hidden">KNOWLEDGE BASE</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Hero Section */}
        <section className="text-center mb-6 sm:mb-10 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-800/60 text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
            Last updated: November 2025
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black font-display tracking-tight">
            KNOW YOUR <span className="text-lime-400">RIGHTS</span>.
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-2">
            Airlines bank on you not knowing the rules. We've compiled the definitive database of every trigger that entitles you to compensation in the US and EU.
          </p>
          <p className="text-xs sm:text-sm text-slate-500">Tap any card to view the full legal text.</p>
        </section>

        {/* Disclaimer Banner */}
        <section className="mb-10 sm:mb-12">
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 sm:px-6 sm:py-4 text-left text-[11px] sm:text-xs text-amber-100">
            <p className="font-semibold text-amber-300 mb-1">Important: US vs EU rules</p>
            <p className="mb-1">
              In the <span className="font-semibold">US</span>, federal law only mandates cash compensation for <span className="font-semibold">involuntary denied boarding (overbooking)</span>. There is currently <span className="font-semibold">no nationwide cash compensation requirement for delays or cancellations</span>.
            </p>
            <p>
              In the <span className="font-semibold">EU</span>, Regulation EC 261/2004 provides strong rights for delays, cancellations, and denied boarding. Lawmakers are debating reforms as of November 2025, but the existing EC 261/2004 rules remain in force until new legislation takes effect. This page is informational only and is not legal advice.
            </p>
          </div>
        </section>

        {/* Rules Grid */}
        <div className="grid gap-4 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {COMPENSATION_RULES.map((rule) => (
            <button
              key={rule.id}
              onClick={() => setSelectedRule(rule)}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 sm:p-6 hover:border-lime-400/50 transition-all group text-left cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  rule.region === "US" ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {rule.region} REGION
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-slate-500">{rule.source}</span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold mb-2 font-display group-hover:text-lime-400 transition-colors">
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
              
              <div className="mt-4 text-xs text-lime-400/70 group-hover:text-lime-400 transition-colors">
                Click to view full legal text →
              </div>
            </button>
          ))}
        </div>

        {/* CTA Footer */}
        <section className="mt-16 sm:mt-24 text-center bg-slate-800 rounded-2xl p-6 sm:p-12 border border-slate-700">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 font-display">Did one of these happen to you?</h2>
          <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">Don't leave money on the table. Start your claim in seconds.</p>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-slate-900 transition-transform bg-lime-400 rounded-full hover:scale-105 hover:bg-lime-300 active:scale-95"
          >
            Check My Flight Now
          </Link>
        </section>

      </main>

      {/* Modal */}
      {selectedRule && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedRule(null)}
        >
          <div 
            className="bg-slate-900 border-t sm:border border-slate-700 sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 sm:p-6 flex justify-between items-start">
              <div className="flex-1 min-w-0 pr-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  selectedRule.region === "US" ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {selectedRule.region} REGION
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-display mt-2 break-words">{selectedRule.title}</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-mono">{selectedRule.source}</p>
              </div>
              <button 
                onClick={() => setSelectedRule(null)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4">
                  <div className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-1">The Trigger</div>
                  <p className="text-white font-medium text-sm sm:text-base">{selectedRule.condition}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4">
                  <div className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-1">The Payout</div>
                  <p className="text-lime-400 font-bold text-lg sm:text-xl">{selectedRule.compensation}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-slate-300 text-sm sm:text-base">{selectedRule.description}</p>
              </div>

              {/* Legal Text */}
              <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-lime-400" />
                  <h3 className="font-bold text-base sm:text-lg">Official Legal Text</h3>
                </div>
                <pre className="text-xs sm:text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                  {selectedRule.legalText}
                </pre>
              </div>

              {/* Tips */}
              {selectedRule.tips && selectedRule.tips.length > 0 && (
                <div className="bg-lime-400/10 border border-lime-400/30 rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-lime-400" />
                    <h3 className="font-bold text-base sm:text-lg text-lime-400">Pro Tips</h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedRule.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <span className="text-lime-400 mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Evidence Checklist */}
              {selectedRule.checklist && selectedRule.checklist.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    <h3 className="font-bold text-base sm:text-lg text-blue-400">Evidence Checklist</h3>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 mb-3 sm:mb-4">Gather these documents to support your claim:</p>
                  <ul className="space-y-2 sm:space-y-3">
                    {selectedRule.checklist.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-blue-400/50 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="pt-4">
                <Link 
                  href="/dashboard"
                  className="block w-full bg-lime-400 text-slate-900 font-bold py-4 rounded-xl text-center hover:bg-lime-300 transition-colors"
                >
                  Start My Claim for This
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
