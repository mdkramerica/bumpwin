
export type Region = "US" | "EU";
export type TriggerType = "DELAY" | "CANCELLATION" | "BUMPING" | "BAGGAGE" | "DOWNGRADE";

export interface CompensationRule {
  id: string;
  title: string;
  region: Region;
  type: TriggerType;
  condition: string;
  compensation: string;
  source: string;
  description: string;
}

export const COMPENSATION_RULES: CompensationRule[] = [
  // --- US RULES (DOT) ---
  {
    id: "us-bump-1",
    title: "Involuntary Denied Boarding (Domestic)",
    region: "US",
    type: "BUMPING",
    condition: "1-2 hour arrival delay",
    compensation: "200% of one-way fare (max $775)",
    source: "14 CFR 250.5",
    description: "If you are bumped against your will and the airline gets you to your destination between 1 and 2 hours late."
  },
  {
    id: "us-bump-2",
    title: "Involuntary Denied Boarding (Domestic - Major)",
    region: "US",
    type: "BUMPING",
    condition: "> 2 hour arrival delay",
    compensation: "400% of one-way fare (max $1,550)",
    source: "14 CFR 250.5",
    description: "If you are bumped and the airline cannot get you to your destination within 2 hours of your original arrival time."
  },
  {
    id: "us-baggage-lost",
    title: "Lost/Damaged Baggage (Domestic)",
    region: "US",
    type: "BAGGAGE",
    condition: "Lost, damaged, or delayed bag",
    compensation: "Up to $3,800 liability limit",
    source: "14 CFR 254.4",
    description: "Airlines are liable for provable damages up to the limit. This is not a flat fee; you must prove value."
  },
  {
    id: "us-tarmac-delay",
    title: "Tarmac Delay (Domestic)",
    region: "US",
    type: "DELAY",
    condition: "> 3 hours on tarmac",
    compensation: "Right to deplane (No mandatory cash)",
    source: "DOT Tarmac Delay Rule",
    description: "Airlines must allow you to get off the plane after 3 hours on the tarmac for domestic flights."
  },

  // --- EU RULES (EC 261/2004) ---
  {
    id: "eu-delay-1",
    title: "Significant Delay (> 3 hours)",
    region: "EU",
    type: "DELAY",
    condition: "Arrive > 3 hours late",
    compensation: "€250 - €600 depending on distance",
    source: "EC 261/2004",
    description: "If delay is within airline control. €250 (<1500km), €400 (1500-3500km), €600 (>3500km)."
  },
  {
    id: "eu-cancel-short",
    title: "Flight Cancellation (< 14 days notice)",
    region: "EU",
    type: "CANCELLATION",
    condition: "Cancelled with short notice",
    compensation: "€250 - €600 + Refund/Re-routing",
    source: "EC 261/2004",
    description: "Compensation applies unless extraordinary circumstances (weather, ATC strike). You also get meals/hotel."
  },
  {
    id: "eu-bump",
    title: "Denied Boarding (Overbooking)",
    region: "EU",
    type: "BUMPING",
    condition: "Denied boarding against will",
    compensation: "€250 - €600 immediately",
    source: "EC 261/2004",
    description: "Same compensation tiers as delays. Must be paid immediately in cash/check/transfer."
  }
];

