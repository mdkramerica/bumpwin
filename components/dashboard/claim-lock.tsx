"use client";

import { useState } from "react";
import { Lock, Check } from "lucide-react";

interface ClaimLockProps {
  claimId: string;
  estimatedPayout: number;
}

export default function ClaimLock({ claimId, estimatedPayout }: ClaimLockProps) {
  const [loading, setLoading] = useState(false);
  const PRICE = 19;
  const PROFIT = estimatedPayout - PRICE;

  const handleUnlock = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ claimId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      }
    } catch (error) {
      console.error("Checkout Error", error);
      setLoading(false);
    }
  };

  return (
    <div className="border border-slate-800 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* The Math Header */}
      <div className="bg-slate-800/50 p-4 border-b border-slate-800 flex justify-between items-center text-sm">
        <div className="text-slate-400">Potential Value</div>
        <div className="text-white font-mono">${estimatedPayout}</div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-2 text-center">
          <Lock className="w-8 h-8 text-lime-400 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-white">Unlock Your Claim</h3>
          <p className="text-slate-400 text-sm">
            Generate the official legal demand letter and filing instructions instantly.
          </p>
        </div>

        {/* The Visual Equation */}
        <div className="bg-slate-950 rounded-lg p-4 flex justify-between items-center font-mono text-sm sm:text-base">
            <div className="text-center">
                <div className="text-slate-500 text-xs mb-1">PAYOUT</div>
                <div className="text-white">${estimatedPayout}</div>
            </div>
            <div className="text-slate-600">-</div>
            <div className="text-center">
                <div className="text-slate-500 text-xs mb-1">COST</div>
                <div className="text-red-400">${PRICE}</div>
            </div>
            <div className="text-slate-600">=</div>
            <div className="text-center">
                <div className="text-lime-400 text-xs mb-1 font-bold">PROFIT</div>
                <div className="text-lime-400 font-bold">${PROFIT}</div>
            </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-col gap-2 text-xs text-slate-500">
           <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-lime-400" />
              <span>US DOT Regulation Compliant</span>
           </div>
           <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-lime-400" />
              <span>Includes 100% Refund Guarantee if rejected</span>
           </div>
        </div>

        <button 
          onClick={handleUnlock}
          disabled={loading}
          className="w-full bg-lime-400 hover:bg-lime-300 text-slate-900 font-bold py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Preparing..." : `UNLOCK FOR $${PRICE}`}
        </button>
        
        <p className="text-center text-[10px] text-slate-600">
           Secure Payment via Stripe • 256-bit SSL Encrypted
        </p>
      </div>
    </div>
  );
}

