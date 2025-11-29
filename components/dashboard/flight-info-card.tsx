"use client";

import { Plane, Calendar, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

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
  // Add more as needed
};

interface FlightInfoCardProps {
  airlineCode: string;
  flightNumber: string;
  scheduledDeparture: string;
  status: string;
  delayMinutes: number;
  ticketPrice?: number | null;
}

export default function FlightInfoCard({
  airlineCode,
  flightNumber,
  scheduledDeparture,
  status,
  delayMinutes,
  ticketPrice,
}: FlightInfoCardProps) {
  const airlineName = AIRLINE_NAMES[airlineCode.toUpperCase()] || airlineCode;
  const departureDate = new Date(scheduledDeparture);
  
  // Format date nicely
  const formattedDate = departureDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  
  const formattedTime = departureDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Determine delay status styling
  const isDelayed = delayMinutes > 0;
  const isSevereDelay = delayMinutes >= 180; // 3+ hours
  
  const delayHours = Math.floor(delayMinutes / 60);
  const delayMins = delayMinutes % 60;
  const delayText = delayHours > 0 
    ? `${delayHours}h ${delayMins}m delayed` 
    : `${delayMins}m delayed`;

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
          isSevereDelay 
            ? "bg-red-500/20 text-red-400 border border-red-500/30" 
            : isDelayed 
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              : "bg-lime-500/20 text-lime-400 border border-lime-500/30"
        }`}>
          {isSevereDelay ? "SEVERE DELAY" : isDelayed ? "DELAYED" : status}
        </div>
      </div>

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
        {isDelayed && (
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

      {/* Compensation Eligibility Banner */}
      {isSevereDelay && (
        <div className="bg-lime-400/10 border-t border-lime-400/20 px-4 py-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0" />
          <div>
            <div className="text-lime-400 font-bold text-sm">COMPENSATION ELIGIBLE</div>
            <div className="text-lime-400/70 text-xs">Your delay exceeds 3 hours — you may be entitled to up to $600</div>
          </div>
        </div>
      )}
    </div>
  );
}

