"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Trophy, Info } from "lucide-react";
import { clsx } from "clsx";

interface MiseryMeterProps {
  delayMinutes: number;
  isCancelled?: boolean;
  ticketPrice?: number | null;
  isBumping?: boolean; // Was the passenger involuntarily denied boarding?
  region?: "US" | "EU";
}

export default function MiseryMeter({ 
  delayMinutes = 0, 
  isCancelled = false,
  ticketPrice = null,
  isBumping = false,
  region = "US"
}: MiseryMeterProps) {
  const [showInfo, setShowInfo] = useState(false);
  
  // Determine eligibility
  // US: Only bumping has mandatory cash compensation
  // EU: Delays 3+ hours, cancellations, and bumping all qualify
  const isEligible = region === "EU" 
    ? (delayMinutes >= 180 || isCancelled || isBumping)
    : isBumping; // US only has mandatory comp for bumping
  
  const intensity = Math.min(delayMinutes / 180, 1);

  // Calculate estimated compensation
  const getCompensationEstimate = () => {
    if (region === "US") {
      if (!isBumping) {
        return {
          amount: null,
          label: "No mandatory compensation",
          sublabel: "US law doesn't require cash for delays",
          showRange: false,
        };
      }
      // US Bumping: 200% (1-2hr) or 400% (2+hr) of fare, max $775/$1,550
      const fare = ticketPrice || 300;
      if (delayMinutes <= 60) {
        return { amount: 0, label: "$0", sublabel: "Under 1 hour delay", showRange: false };
      }
      if (delayMinutes <= 120) {
        const est = Math.min(fare * 2, 775);
        return { 
          amount: est, 
          label: `Up to $${est}`, 
          sublabel: "200% of fare (max $775)",
          showRange: true,
        };
      }
      const est = Math.min(fare * 4, 1550);
      return { 
        amount: est, 
        label: `Up to $${est}`, 
        sublabel: "400% of fare (max $1,550)",
        showRange: true,
      };
    }
    
    // EU Compensation based on distance (simplified - assume long-haul)
    if (delayMinutes >= 180 || isCancelled) {
      return { 
        amount: 600, 
        label: "Up to €600", 
        sublabel: "EU EC 261/2004 (long-haul)",
        showRange: true,
      };
    }
    return { 
      amount: null, 
      label: "Not yet eligible", 
      sublabel: `Need ${180 - delayMinutes} more mins`,
      showRange: false,
    };
  };

  const compensation = getCompensationEstimate();

  // Visual Config
  const stateConfig = isEligible
    ? {
        color: "text-lime-400",
        borderColor: "border-lime-400",
        bg: "bg-lime-400",
        message: isBumping ? "BUMPING DETECTED" : isCancelled ? "FLIGHT CANCELED" : "ELIGIBLE",
        icon: Trophy,
        vibe: "",
      }
    : delayMinutes >= 120
    ? {
        color: "text-orange-500",
        borderColor: "border-orange-500",
        bg: "bg-orange-500",
        message: "SIGNIFICANT DELAY",
        icon: AlertTriangle,
        vibe: "",
      }
    : {
        color: "text-slate-400",
        borderColor: "border-slate-600",
        bg: "bg-slate-600",
        message: "MONITORING",
        icon: AlertTriangle,
        vibe: "",
      };

  return (
    <div className="w-full max-w-md p-6 mx-auto border rounded-2xl bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase">
          Misery Meter™
        </h3>
        <div className={clsx("flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700", stateConfig.color)}>
          <stateConfig.icon className="w-4 h-4" />
          <span className="text-xs font-bold">{stateConfig.message}</span>
        </div>
      </div>

      {/* The Gauge Visual */}
      <div className="relative w-full h-8 mb-6 overflow-hidden rounded-full bg-slate-800">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }} 
        />
        
        <motion.div
          className={clsx("h-full shadow-[0_0_20px_rgba(0,0,0,0.5)]", stateConfig.bg)}
          initial={{ width: "0%" }}
          animate={{ width: `${isEligible ? 100 : (delayMinutes / 180) * 100}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      {/* The Verdict */}
      <div className="text-center">
        {isEligible && compensation.amount !== null ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-2"
          >
            <p className="text-sm text-slate-400">POTENTIAL COMPENSATION</p>
            <h2 className="text-4xl sm:text-5xl font-black text-lime-400 font-display tracking-tighter">
              {compensation.label}
            </h2>
            <p className="text-xs text-lime-400/70">{compensation.sublabel}</p>
          </motion.div>
        ) : region === "US" && !isBumping && delayMinutes >= 180 ? (
          // US delay but no bumping - explain the situation
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <Info className="w-5 h-5" />
              <span className="font-bold">Important</span>
            </div>
            <p className="text-sm text-slate-300">
              US law does <span className="text-white font-bold">not</span> require cash compensation for delays.
            </p>
            <p className="text-xs text-slate-500">
              However, you may still request vouchers, rebooking, or file a DOT complaint.
            </p>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="text-xs text-lime-400 hover:underline"
            >
              {showInfo ? "Hide details" : "What can I do?"}
            </button>
            {showInfo && (
              <div className="mt-3 p-3 bg-slate-800 rounded-lg text-left text-xs text-slate-400 space-y-2">
                <p>• <strong className="text-white">Request meal vouchers</strong> for long delays</p>
                <p>• <strong className="text-white">Ask for hotel accommodation</strong> if overnight</p>
                <p>• <strong className="text-white">Request rebooking</strong> on next available flight</p>
                <p>• <strong className="text-white">File a DOT complaint</strong> if treated unfairly</p>
                <p>• <strong className="text-white">Check credit card benefits</strong> for trip delay insurance</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white">
              {delayMinutes} <span className="text-lg text-slate-500">MINUTES</span>
            </h2>
            {region === "EU" ? (
              <p className="text-sm text-slate-500">
                You need <span className="text-white">{Math.max(0, 180 - delayMinutes)} more minutes</span> of delay for EU compensation.
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Monitoring delay... US compensation requires <span className="text-white">involuntary bumping</span>.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Region indicator */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-500">
        <span className={`w-2 h-2 rounded-full ${region === "US" ? "bg-blue-400" : "bg-yellow-400"}`} />
        <span>Showing {region} regulations</span>
      </div>
    </div>
  );
}
