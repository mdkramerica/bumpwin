"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, X, Scale, Lightbulb } from "lucide-react";
import { COMPENSATION_RULES, CompensationRule } from "@/lib/rules-data/rules";

export default function RulesPage() {
  const [selectedRule, setSelectedRule] = useState<CompensationRule | null>(null);

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
          <p className="text-sm text-slate-500">Click any card to view the full legal text.</p>
        </section>

        {/* Rules Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {COMPENSATION_RULES.map((rule) => (
            <button
              key={rule.id}
              onClick={() => setSelectedRule(rule)}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-lime-400/50 transition-all group text-left cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
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
              
              <div className="mt-4 text-xs text-lime-400/70 group-hover:text-lime-400 transition-colors">
                Click to view full legal text →
              </div>
            </button>
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

      {/* Modal */}
      {selectedRule && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRule(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-start">
              <div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  selectedRule.region === "US" ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {selectedRule.region} REGION
                </span>
                <h2 className="text-2xl font-bold font-display mt-2">{selectedRule.title}</h2>
                <p className="text-sm text-slate-500 font-mono">{selectedRule.source}</p>
              </div>
              <button 
                onClick={() => setSelectedRule(null)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">The Trigger</div>
                  <p className="text-white font-medium">{selectedRule.condition}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">The Payout</div>
                  <p className="text-lime-400 font-bold text-xl">{selectedRule.compensation}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-slate-300">{selectedRule.description}</p>
              </div>

              {/* Legal Text */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <Scale className="w-5 h-5 text-lime-400" />
                  <h3 className="font-bold text-lg">Official Legal Text</h3>
                </div>
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {selectedRule.legalText}
                </pre>
              </div>

              {/* Tips */}
              {selectedRule.tips && selectedRule.tips.length > 0 && (
                <div className="bg-lime-400/10 border border-lime-400/30 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-lime-400" />
                    <h3 className="font-bold text-lg text-lime-400">Pro Tips</h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedRule.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-lime-400 mt-1">•</span>
                        {tip}
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
