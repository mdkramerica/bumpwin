"use client";

import { Plane, Calendar, Clock, AlertTriangle, CheckCircle2, Info, XCircle, Radio, Edit3 } from "lucide-react";
import { useState } from "react";

// Airline name mapping
const AIRLINE_NAMES: Record<string, string> = {
  "AA": "American Airlines",
  "UA": "United Airlines",
  "DL": "Delta Air Lines",
  "WN": "Southwest Airlines",
  "B6": "JetBlue Airways",
  "AS": "Alaska Airlines",
  "NK": "Spirit Airlines",
  "F9": "Frontier Airlines",
  "G4": "Allegiant Air",
  "HA": "Hawaiian Airlines",
  "SY": "Sun Country Airlines",
};

interface FlightInfoCardProps {
  airlineCode: string;
  flightNumber: string;
  scheduledDeparture: string;
  status: string;
  delayMinutes: number;
  ticketPrice?: number | null;
  isBumping?: boolean;
  isCancelled?: boolean;
  issueType?: string | null;
  dataSource?: "live" | "manual" | null;
}

export default function FlightInfoCard({
  airlineCode,
  flightNumber,
  scheduledDeparture,
  status,
  delayMinutes,
  ticketPrice,
  isBumping = false,
  isCancelled = false,
  issueType,
  dataSource = "manual",
}: FlightInfoCardProps) {
  const [showCompInfo, setShowCompInfo] = useState(false);
  
  const airlineName = AIRLINE_NAMES[airlineCode.toUpperCase()] || airlineCode;
  const departureDate = new Date(scheduledDeparture);
  const manualScheduledTime =
    dataSource === "manual" && !Number.isNaN(departureDate.getTime())
      ? departureDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC", // stored as UTC when entered manually, so keep original value
        })
      : null;
  
  const formattedDate = departureDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  
  const formattedTime = manualScheduledTime || departureDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const isDelayed = delayMinutes > 0;
  const isSevereDelay = delayMinutes >= 180;
  
  const delayHours = Math.floor(delayMinutes / 60);
  const delayMins = delayMinutes % 60;
  const delayText = delayHours > 0 
    ? `${delayHours}h ${delayMins}m delayed` 
    : `${delayMins}m delayed`;

  // Check if this is an upcoming flight being monitored
  const isUpcoming = issueType === "UPCOMING" || status === "UPCOMING";
  
  // Determine what compensation info to show
  const getCompensationInfo = () => {
    // For upcoming flights, show monitoring status
    if (isUpcoming) {
      return {
        eligible: false,
        title: "MONITORING FLIGHT",
        message: "We'll alert you if your flight is delayed, cancelled, or if you get bumped.",
        type: "info" as const,
      };
    }
    
    if (isBumping) {
      const fare = ticketPrice || 300;
      if (delayMinutes <= 60) {
        return {
          eligible: false,
          title: "Bumped - Under 1 Hour Delay",
          message: "No compensation required if you arrive within 1 hour of original time.",
          type: "warning" as const,
        };
      }
      if (delayMinutes <= 120) {
        const est = Math.min(fare * 2, 775);
        return {
          eligible: true,
          title: "BUMPING COMPENSATION",
          message: `You may be owed up to $${est} (200% of fare, max $775)`,
          type: "success" as const,
        };
      }
      const est = Math.min(fare * 4, 1550);
      return {
        eligible: true,
        title: "BUMPING COMPENSATION",
        message: `You may be owed up to $${est} (400% of fare, max $1,550)`,
        type: "success" as const,
      };
    }
    
    if (isCancelled) {
      return {
        eligible: false,
        title: "FLIGHT CANCELLED",
        message: "US law requires a refund. Cash compensation is not federally mandated, but you can request vouchers.",
        type: "info" as const,
      };
    }
    
    if (isSevereDelay) {
      return {
        eligible: false,
        title: "SEVERE DELAY",
        message: "US law does NOT require cash compensation for delays. You may request meal vouchers, rebooking, or file a DOT complaint.",
        type: "warning" as const,
      };
    }
    
    // For delays under 3 hours
    if (isDelayed && delayMinutes > 0) {
      return {
        eligible: false,
        title: "FLIGHT DELAYED",
        message: `Your flight was delayed ${delayText}. US law does not require compensation for delays.`,
        type: "warning" as const,
      };
    }
    
    return null;
  };

  const compInfo = getCompensationInfo();

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
      {/* Header with airline branding */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            <Plane className="w-5 h-5 text-lime-400" />
          </div>
          <div>
            <div className="font-bold text-white text-lg">{airlineCode} {flightNumber}</div>
            <div className="text-xs text-slate-400">{airlineName}</div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
          isUpcoming
            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            : isBumping
              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
              : isCancelled
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : isSevereDelay 
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" 
                  : isDelayed 
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "bg-lime-500/20 text-lime-400 border border-lime-500/30"
        }`}>
          {isUpcoming ? "UPCOMING" : isBumping ? "BUMPED" : isCancelled ? "CANCELLED" : isSevereDelay ? "SEVERE DELAY" : isDelayed ? "DELAYED" : status}
        </div>
      </div>

      {/* Data Source Indicator */}
      {dataSource === "manual" && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2">
          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-amber-400">
            Manual entry — times may not reflect actual flight schedule
          </span>
        </div>
      )}
      {dataSource === "live" && (
        <div className="px-4 py-2 bg-lime-500/10 border-b border-lime-500/20 flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-lime-400" />
          <span className="text-xs text-lime-400">
            Live data — updated from flight tracking API
          </span>
        </div>
      )}

      {/* Flight Details Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {/* Departure Date */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>DEPARTURE DATE</span>
          </div>
          <div className="text-white font-medium">{formattedDate}</div>
        </div>

        {/* Scheduled Time */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>SCHEDULED TIME</span>
          </div>
          <div className="text-white font-medium">{formattedTime}</div>
        </div>

        {/* Delay Info */}
        {isDelayed && !isCancelled && (
          <div className="space-y-1 col-span-2">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>DELAY DETECTED</span>
            </div>
            <div className={`font-bold text-lg ${isSevereDelay ? "text-red-400" : "text-amber-400"}`}>
              {delayText}
            </div>
          </div>
        )}

        {/* Ticket Price (if available) */}
        {ticketPrice && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <span>💵</span>
              <span>TICKET PRICE</span>
            </div>
            <div className="text-white font-medium">${ticketPrice.toFixed(2)}</div>
          </div>
        )}
      </div>

      {/* Compensation Info Banner */}
      {compInfo && (
        <div className={`border-t px-4 py-3 ${
          compInfo.type === "success" 
            ? "bg-lime-400/10 border-lime-400/20" 
            : compInfo.type === "warning"
              ? "bg-amber-500/10 border-amber-500/20"
              : "bg-blue-500/10 border-blue-500/20"
        }`}>
          <div className="flex items-start gap-2">
            {compInfo.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0" />
            ) : compInfo.type === "warning" ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className={`font-bold text-sm ${
                compInfo.type === "success" ? "text-lime-400" : compInfo.type === "warning" ? "text-amber-400" : "text-blue-400"
              }`}>
                {compInfo.title}
              </div>
              <div className={`text-xs ${
                compInfo.type === "success" ? "text-lime-400/70" : compInfo.type === "warning" ? "text-amber-400/70" : "text-blue-400/70"
              }`}>
                {compInfo.message}
              </div>
            </div>
            <button 
              onClick={() => setShowCompInfo(!showCompInfo)}
              className="text-xs text-slate-400 hover:text-white"
            >
              {showCompInfo ? "Less" : "More"}
            </button>
          </div>
          
          {showCompInfo && (
            <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-400 space-y-2">
              <p className="font-medium text-slate-300">Understanding US Compensation Rules:</p>
              <p>• <strong className="text-white">Involuntary Bumping</strong> is the ONLY situation with mandatory cash compensation in the US</p>
              <p>• <strong className="text-white">Delays & Cancellations</strong> do not have federal cash compensation requirements</p>
              <p>• Airlines may voluntarily offer vouchers, miles, or rebooking</p>
              <p>• You can always <strong className="text-white">file a DOT complaint</strong> at transportation.gov</p>
              <p className="text-slate-500 italic pt-1">EU flights have stronger protections under EC 261/2004</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

