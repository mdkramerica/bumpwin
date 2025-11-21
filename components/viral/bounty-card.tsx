"use client";

import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface BountyCardProps {
  referralCode: string;
  earnings?: number;
}

export default function BountyCard({ referralCode, earnings = 0 }: BountyCardProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${process.env.NEXT_PUBLIC_URL || "bumpwin.com"}?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full mx-auto relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 rounded-full blur-3xl -z-0" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-lime-400 font-bold font-display text-xl tracking-tight">
            BOUNTY HUNTER
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Get $20 for every friend who wins.
          </p>
        </div>
        <div className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Earnings</p>
            <p className="text-white font-mono font-bold text-right">${earnings}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-4">
        <div className="shrink-0">
            <QRCodeSVG value={shareUrl} size={80} />
        </div>
        <div className="flex-1 min-w-0">
             <p className="text-slate-900 font-bold text-sm mb-1 truncate">
               {shareUrl}
             </p>
             <button 
               onClick={copyToClipboard}
               className="text-xs font-bold text-lime-600 hover:text-lime-700 flex items-center gap-1 transition-colors"
             >
               {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
               {copied ? "COPIED" : "COPY LINK"}
             </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
         <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-800">
            <div className="text-lg font-bold text-white">1</div>
            <div className="text-[10px] text-slate-500 uppercase">Scan</div>
         </div>
         <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-800">
            <div className="text-lg font-bold text-white">2</div>
            <div className="text-[10px] text-slate-500 uppercase">Win</div>
         </div>
         <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-800">
            <div className="text-lg font-bold text-lime-400">$20</div>
            <div className="text-[10px] text-slate-500 uppercase">Paid</div>
         </div>
      </div>
    </div>
  );
}

