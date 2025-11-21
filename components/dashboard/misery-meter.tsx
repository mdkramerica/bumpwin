"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Trophy } from "lucide-react";
import { clsx } from "clsx";

interface MiseryMeterProps {
  delayMinutes: number; // The input: how late is the flight?
  isCancelled?: boolean;
}

export default function MiseryMeter({ delayMinutes = 0, isCancelled = false }: MiseryMeterProps) {
  // Determine State based on Logic
  // < 180 mins (3 hrs) = CALM / ANNOYED
  // > 180 mins OR Cancelled = WINNER
  
  const isWinner = delayMinutes >= 180 || isCancelled;
  const intensity = Math.min(delayMinutes / 180, 1); // 0 to 1 scale for progress bar

  // Visual Config
  const stateConfig = isWinner
    ? {
        color: "text-lime-400",
        borderColor: "border-lime-400",
        bg: "bg-lime-400",
        message: isCancelled ? "FLIGHT CANCELED" : "PAYDAY IMMINENT",
        icon: Trophy,
        vibe: "animate-glitch", // Custom CSS class for shaking/glitching
      }
    : {
        color: "text-orange-500",
        borderColor: "border-orange-500",
        bg: "bg-orange-500",
        message: "DELAY DETECTED",
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
        {/* Background Striped Pattern */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }} 
        />
        
        {/* Progress Bar */}
        <motion.div
          className={clsx("h-full shadow-[0_0_20px_rgba(0,0,0,0.5)]", stateConfig.bg)}
          initial={{ width: "0%" }}
          animate={{ width: `${isWinner ? 100 : (delayMinutes / 180) * 100}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      {/* The Verdict */}
      <div className="text-center">
        {isWinner ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={clsx("space-y-2", stateConfig.vibe)}
          >
            <p className="text-sm text-slate-400">COMPENSATION ELIGIBLE</p>
            <h2 className="text-5xl font-black text-lime-400 font-display tracking-tighter">
              $600.00
            </h2>
            <p className="text-xs text-lime-400/70">CASH CLAIM UNLOCKED</p>
          </motion.div>
        ) : (
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white">
              {delayMinutes} <span className="text-lg text-slate-500">MINUTES</span>
            </h2>
            <p className="text-sm text-slate-500">
              You need <span className="text-white">{180 - delayMinutes} more minutes</span> of delay to win big.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

