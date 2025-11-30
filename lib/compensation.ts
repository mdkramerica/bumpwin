/**
 * Compensation Calculation Utilities
 * 
 * IMPORTANT: These are ESTIMATES based on regulations. Actual compensation
 * depends on many factors and is not guaranteed.
 */

export type Region = "US" | "EU";
export type ClaimType = "BUMPING" | "DELAY" | "CANCELLATION";

interface CompensationEstimate {
  minAmount: number;
  maxAmount: number;
  currency: string;
  explanation: string;
  isGuaranteed: boolean; // Whether this is legally mandated
  regulation: string;
}

/**
 * US Bumping Compensation (14 CFR Part 250)
 * This is the ONLY mandatory cash compensation in the US
 * 
 * Based on:
 * - Delay to final destination
 * - One-way fare paid
 */
export function calculateUSBumpingCompensation(
  delayMinutes: number,
  ticketPrice: number | null
): CompensationEstimate {
  const oneWayFare = ticketPrice || 300; // Default estimate if unknown
  
  if (delayMinutes <= 60) {
    return {
      minAmount: 0,
      maxAmount: 0,
      currency: "USD",
      explanation: "Delays under 1 hour to final destination = no compensation required",
      isGuaranteed: false,
      regulation: "14 CFR Part 250",
    };
  }
  
  if (delayMinutes <= 120) {
    // 1-2 hours: 200% of one-way fare, max $775
    const amount = Math.min(oneWayFare * 2, 775);
    return {
      minAmount: Math.min(oneWayFare * 2, 775),
      maxAmount: 775,
      currency: "USD",
      explanation: `1-2 hour delay: 200% of fare ($${oneWayFare} × 2 = $${oneWayFare * 2}), capped at $775`,
      isGuaranteed: true,
      regulation: "14 CFR Part 250.5",
    };
  }
  
  // 2+ hours: 400% of one-way fare, max $1,550
  const amount = Math.min(oneWayFare * 4, 1550);
  return {
    minAmount: Math.min(oneWayFare * 4, 1550),
    maxAmount: 1550,
    currency: "USD",
    explanation: `2+ hour delay: 400% of fare ($${oneWayFare} × 4 = $${oneWayFare * 4}), capped at $1,550`,
    isGuaranteed: true,
    regulation: "14 CFR Part 250.5",
  };
}

/**
 * US Delay Compensation
 * IMPORTANT: There is NO mandatory cash compensation for delays in the US
 */
export function calculateUSDelayCompensation(
  delayMinutes: number
): CompensationEstimate {
  return {
    minAmount: 0,
    maxAmount: 0,
    currency: "USD",
    explanation: "US law does not require cash compensation for flight delays. Airlines may offer vouchers voluntarily.",
    isGuaranteed: false,
    regulation: "No federal mandate",
  };
}

/**
 * EU Delay/Cancellation Compensation (EC 261/2004)
 * Based on flight distance, not ticket price
 */
export function calculateEUCompensation(
  distanceKm: number,
  delayMinutes: number,
  isCancellation: boolean
): CompensationEstimate {
  // Must be 3+ hours delay for compensation (or cancellation with <14 days notice)
  if (!isCancellation && delayMinutes < 180) {
    return {
      minAmount: 0,
      maxAmount: 0,
      currency: "EUR",
      explanation: "Delays under 3 hours do not qualify for EU compensation",
      isGuaranteed: false,
      regulation: "EC 261/2004",
    };
  }
  
  let amount: number;
  let distanceCategory: string;
  
  if (distanceKm <= 1500) {
    amount = 250;
    distanceCategory = "short-haul (≤1,500km)";
  } else if (distanceKm <= 3500) {
    amount = 400;
    distanceCategory = "medium-haul (1,500-3,500km)";
  } else {
    amount = 600;
    distanceCategory = "long-haul (>3,500km)";
  }
  
  return {
    minAmount: amount,
    maxAmount: amount,
    currency: "EUR",
    explanation: `${isCancellation ? "Cancellation" : "3+ hour delay"} on ${distanceCategory} flight = €${amount}`,
    isGuaranteed: true,
    regulation: "EC 261/2004 Article 7",
  };
}

/**
 * Estimate compensation based on available info
 * Returns a user-friendly estimate with appropriate caveats
 */
export function estimateCompensation(params: {
  region: Region;
  claimType: ClaimType;
  delayMinutes: number;
  ticketPrice?: number | null;
  flightDistanceKm?: number;
}): CompensationEstimate {
  const { region, claimType, delayMinutes, ticketPrice, flightDistanceKm } = params;
  
  if (region === "US") {
    if (claimType === "BUMPING") {
      return calculateUSBumpingCompensation(delayMinutes, ticketPrice || null);
    }
    // US delays and cancellations have no mandatory compensation
    return calculateUSDelayCompensation(delayMinutes);
  }
  
  // EU
  return calculateEUCompensation(
    flightDistanceKm || 5000, // Default to long-haul if unknown
    delayMinutes,
    claimType === "CANCELLATION"
  );
}

/**
 * Format compensation for display
 */
export function formatCompensationRange(estimate: CompensationEstimate): string {
  if (estimate.maxAmount === 0) {
    return "No mandatory compensation";
  }
  
  const symbol = estimate.currency === "EUR" ? "€" : "$";
  
  if (estimate.minAmount === estimate.maxAmount) {
    return `${symbol}${estimate.maxAmount}`;
  }
  
  return `${symbol}${estimate.minAmount} - ${symbol}${estimate.maxAmount}`;
}

/**
 * Get a conservative "up to" estimate for marketing purposes
 */
export function getMaxPossibleCompensation(region: Region): { amount: number; currency: string } {
  if (region === "US") {
    return { amount: 1550, currency: "USD" }; // Max bumping compensation
  }
  return { amount: 600, currency: "EUR" }; // Max EU compensation
}


