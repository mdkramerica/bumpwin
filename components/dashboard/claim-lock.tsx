"use client";

import { useState } from "react";
import { Lock, Check, Info, AlertTriangle } from "lucide-react";

interface ClaimLockProps {
  claimId: string;
  estimatedPayout: number;
  isBumping?: boolean;
  ticketPrice?: number | null;
}

export default function ClaimLock({ 
  claimId, 
  estimatedPayout,
  isBumping = false,
  ticketPrice = null,
}: ClaimLockProps) {
  const [loading, setLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const PRICE = 19;

  // Calculate more accurate estimate for US bumping
  const getEstimatedCompensation = () => {
    if (isBumping && ticketPrice) {
      // 400% of fare, max $1,550 for 2+ hour delays
      return Math.min(ticketPrice * 4, 1550);
    }
    return estimatedPayout;
  };

  const estimate = getEstimatedCompensation();
  const PROFIT = estimate - PRICE;

  const handleUnlock = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ claimId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
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
        <div className="text-slate-400 flex items-center gap-1">
          Potential Value
          <button 
            onClick={() => setShowDisclaimer(!showDisclaimer)}
            className="text-slate-500 hover:text-white"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-white font-mono">Up to ${estimate}</div>
      </div>

      {/* Disclaimer */}
      {showDisclaimer && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 p-3 text-xs text-amber-200/80">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-300 mb-1">Important Disclaimer</p>
              <p>This is an <strong>estimate</strong> based on US DOT regulations. Actual compensation depends on your specific situation:</p>
              <ul className="mt-1 space-y-0.5 text-amber-200/70">
                <li>• US law only mandates cash for <strong>involuntary bumping</strong></li>
                <li>• Delays/cancellations have no federal cash requirement</li>
                <li>• Compensation is not guaranteed</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6 space-y-6">
        <div className="space-y-2 text-center">
          <Lock className="w-8 h-8 text-lime-400 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-white">Unlock Your Claim Kit</h3>
          <p className="text-slate-400 text-sm">
            Get your personalized demand letter, filing instructions, and step-by-step guide.
          </p>
        </div>

        {/* The Visual Equation */}
        <div className="bg-slate-950 rounded-lg p-4 flex justify-between items-center font-mono text-sm sm:text-base">
            <div className="text-center">
                <div className="text-slate-500 text-xs mb-1">POTENTIAL</div>
                <div className="text-white">Up to ${estimate}</div>
            </div>
            <div className="text-slate-600">-</div>
            <div className="text-center">
                <div className="text-slate-500 text-xs mb-1">COST</div>
                <div className="text-red-400">${PRICE}</div>
            </div>
            <div className="text-slate-600">=</div>
            <div className="text-center">
                <div className="text-lime-400 text-xs mb-1 font-bold">NET</div>
                <div className="text-lime-400 font-bold">Up to ${PROFIT}</div>
            </div>
        </div>

        {/* What You Get */}
        <div className="space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">What's Included:</p>
          <div className="flex flex-col gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-lime-400" />
                <span>Personalized demand letter citing regulations</span>
            </div>
            <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-lime-400" />
                <span>Step-by-step filing instructions</span>
            </div>
            <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-lime-400" />
                <span>Document checklist for your claim</span>
            </div>
            <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-lime-400" />
                <span>Airline contact information</span>
            </div>
            <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-lime-400" />
                <span>DOT escalation guide if denied</span>
            </div>
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
        
        <p className="text-center text-[10px] text-slate-500 leading-relaxed">
          By unlocking, you acknowledge this is an informational tool only. 
          We do not guarantee any compensation outcome. 
          <a href="/terms" className="text-lime-400 hover:underline ml-1">Terms apply</a>.
        </p>
      </div>
    </div>
  );
}
