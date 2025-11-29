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
  legalText: string; // The actual law/regulation text
  tips?: string[]; // Optional tips for claiming
  checklist: string[]; // Required documents/evidence for a successful claim
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
    description: "If you are bumped against your will and the airline gets you to your destination between 1 and 2 hours late.",
    legalText: `§ 250.5 Amount of denied boarding compensation for passengers denied boarding involuntarily.

(a) Subject to the exceptions provided in § 250.6, a carrier to whom this part applies as described in § 250.2 shall pay compensation in interstate air transportation to passengers who are denied boarding involuntarily from an oversold flight as follows:

(1) No compensation is required if the carrier offers alternate transportation that, at the time the arrangement is made, is planned to arrive at the airport of the passenger's first stopover, or if none, the airport of the passenger's final destination not later than one hour after the planned arrival time of the passenger's original flight;

(2) Compensation shall be 200 percent of the fare to the passenger's destination or first stopover, with a maximum of $775, if the carrier offers alternate transportation that, at the time the arrangement is made, is planned to arrive at the airport of the passenger's first stopover, or if none, the airport of the passenger's final destination more than one hour but less than two hours after the planned arrival time of the passenger's original flight.`,
    tips: [
      "Always ask for written confirmation of the bump",
      "Do NOT accept a voucher if you want cash - you have the right to cash",
      "The airline must book you on the next available flight at no extra cost"
    ],
    checklist: [
      "Original boarding pass (physical or screenshot)",
      "Booking confirmation / E-ticket with your name and flight details",
      "Written 'Denied Boarding' notice from the airline (ask for this!)",
      "Photo ID (passport or driver's license)",
      "New boarding pass showing rebooked flight and actual arrival time",
      "Any receipts for meals, transport, or accommodation incurred due to the delay"
    ]
  },
  {
    id: "us-bump-2",
    title: "Involuntary Denied Boarding (Domestic - Major)",
    region: "US",
    type: "BUMPING",
    condition: "> 2 hour arrival delay",
    compensation: "400% of one-way fare (max $1,550)",
    source: "14 CFR 250.5",
    description: "If you are bumped and the airline cannot get you to your destination within 2 hours of your original arrival time.",
    legalText: `§ 250.5 Amount of denied boarding compensation for passengers denied boarding involuntarily.

(a)(3) Compensation shall be 400 percent of the fare to the passenger's destination or first stopover, with a maximum of $1,550, if the carrier does not offer alternate transportation that, at the time the arrangement is made, is planned to arrive at the airport of the passenger's first stopover, or if none, the airport of the passenger's final destination less than two hours after the planned arrival time of the passenger's original flight.`,
    tips: [
      "This is the MAXIMUM compensation under US law for bumping",
      "Demand payment immediately - they must pay same day",
      "Keep all documentation: boarding pass, bump notice, receipts"
    ],
    checklist: [
      "Original boarding pass (physical or screenshot)",
      "Booking confirmation / E-ticket with your name and flight details",
      "Written 'Denied Boarding' notice from the airline (CRITICAL - demand this)",
      "Photo ID (passport or driver's license)",
      "New boarding pass showing rebooked flight",
      "Proof of actual arrival time (boarding pass, flight tracker screenshot)",
      "All receipts for meals, transport, or hotel due to the extended delay"
    ]
  },
  {
    id: "us-baggage-lost",
    title: "Lost/Damaged Baggage (Domestic)",
    region: "US",
    type: "BAGGAGE",
    condition: "Lost, damaged, or delayed bag",
    compensation: "Up to $3,800 liability limit",
    source: "14 CFR 254.4",
    description: "Airlines are liable for provable damages up to the limit. This is not a flat fee; you must prove value.",
    legalText: `§ 254.4 Carrier liability.

On any flight segment using large aircraft, or on any flight segment that is included on the same ticket as another flight segment that uses large aircraft, an air carrier shall not limit its liability for provable direct or consequential damages resulting from the disappearance of, damage to, or delay in delivery of a passenger's personal property, including baggage, in its custody to an amount less than $3,800 for each passenger.`,
    tips: [
      "File a claim IMMEDIATELY at the airport before leaving",
      "Keep receipts for any emergency purchases (clothes, toiletries)",
      "Take photos of damaged bags before and after"
    ],
    checklist: [
      "Baggage claim ticket / tag number",
      "Property Irregularity Report (PIR) - filed at airport baggage office",
      "Photos of damaged bag (exterior and interior)",
      "Itemized list of lost/damaged contents with estimated values",
      "Original purchase receipts for valuable items (if available)",
      "Receipts for emergency replacement purchases (clothes, toiletries)",
      "Boarding pass and booking confirmation",
      "Photo ID"
    ]
  },
  {
    id: "us-tarmac-delay",
    title: "Tarmac Delay (Domestic)",
    region: "US",
    type: "DELAY",
    condition: "> 3 hours on tarmac",
    compensation: "Right to deplane (No mandatory cash)",
    source: "DOT Tarmac Delay Rule",
    description: "Airlines must allow you to get off the plane after 3 hours on the tarmac for domestic flights.",
    legalText: `49 U.S.C. § 42301 - Tarmac Delay Contingency Plan

For domestic flights, airlines must provide passengers the opportunity to deplane after the aircraft has sat on the tarmac for 3 hours. For international flights, the limit is 4 hours.

Airlines must also:
- Provide adequate food and water no later than 2 hours after the aircraft leaves the gate
- Maintain operable lavatories
- Provide adequate medical attention if needed

Airlines can be fined up to $27,500 per passenger for violations.`,
    tips: [
      "Start a timer when the plane leaves the gate",
      "Politely but firmly ask the crew about deplane options after 2.5 hours",
      "Document everything - times, crew responses, conditions"
    ],
    checklist: [
      "Boarding pass showing flight number and date",
      "Timestamped notes or photos documenting the delay (use your phone)",
      "Screenshots from flight tracking apps showing tarmac time",
      "Names of crew members you spoke to (if possible)",
      "Written record of when food/water was offered (or not)",
      "Any communication from the airline about the delay",
      "Witness contact info (fellow passengers)"
    ]
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
    description: "If delay is within airline control. €250 (<1500km), €400 (1500-3500km), €600 (>3500km).",
    legalText: `REGULATION (EC) No 261/2004 - Article 7: Right to compensation

1. Where reference is made to this Article, passengers shall receive compensation amounting to:
(a) EUR 250 for all flights of 1500 kilometres or less;
(b) EUR 400 for all intra-Community flights of more than 1500 kilometres, and for all other flights between 1500 and 3500 kilometres;
(c) EUR 600 for all flights not falling under (a) or (b).

In determining the distance, the basis shall be the last destination at which the denial of boarding or cancellation will delay the passenger's arrival after the scheduled time.

Note: The Sturgeon ruling (C-402/07) extended this compensation to delays of 3+ hours, not just cancellations.`,
    tips: [
      "EU rules apply to ALL flights departing from EU airports, regardless of airline",
      "Also applies to EU airlines flying INTO the EU from anywhere",
      "'Extraordinary circumstances' (weather, strikes) may exempt the airline - but they must prove it"
    ],
    checklist: [
      "Booking confirmation / E-ticket showing original scheduled times",
      "Boarding pass (original delayed flight)",
      "Proof of actual arrival time (new boarding pass, flight tracker screenshot)",
      "Photo ID (passport preferred for EU claims)",
      "Any written communication from airline about the delay",
      "Receipts for meals, refreshments, or hotel (for reimbursement)",
      "Screenshot of flight distance (use Great Circle Mapper to calculate km)"
    ]
  },
  {
    id: "eu-cancel-short",
    title: "Flight Cancellation (< 14 days notice)",
    region: "EU",
    type: "CANCELLATION",
    condition: "Cancelled with short notice",
    compensation: "€250 - €600 + Refund/Re-routing",
    source: "EC 261/2004",
    description: "Compensation applies unless extraordinary circumstances (weather, ATC strike). You also get meals/hotel.",
    legalText: `REGULATION (EC) No 261/2004 - Article 5: Cancellation

1. In case of cancellation of a flight, the passengers concerned shall:
(a) be offered assistance by the operating air carrier in accordance with Article 8 (refund or re-routing); and
(b) be offered assistance by the operating air carrier in accordance with Article 9(1)(a) and 9(2) (meals, refreshments, hotel accommodation, transport); and
(c) have the right to compensation by the operating air carrier in accordance with Article 7, unless:
   (i) they are informed of the cancellation at least two weeks before the scheduled time of departure; or
   (ii) they are informed of the cancellation between two weeks and seven days before the scheduled time of departure and are offered re-routing... arriving no more than two hours after the scheduled time of arrival; or
   (iii) they are informed of the cancellation less than seven days before the scheduled time of departure and are offered re-routing... arriving no more than one hour after the scheduled time of arrival.`,
    tips: [
      "Screenshot your booking confirmation showing original times",
      "If they rebook you, check if the new arrival time triggers compensation",
      "You're entitled to meals and hotel even if no cash compensation applies"
    ],
    checklist: [
      "Original booking confirmation showing scheduled departure/arrival",
      "Cancellation notice from airline (email, SMS, or app notification)",
      "Screenshot showing when you were notified (timestamp is key!)",
      "New booking confirmation if re-routed",
      "Proof of actual arrival time on new flight",
      "Photo ID (passport preferred)",
      "Receipts for meals, hotel, and transport during wait",
      "Screenshot of flight distance for compensation tier calculation"
    ]
  },
  {
    id: "eu-bump",
    title: "Denied Boarding (Overbooking)",
    region: "EU",
    type: "BUMPING",
    condition: "Denied boarding against will",
    compensation: "€250 - €600 immediately",
    source: "EC 261/2004",
    description: "Same compensation tiers as delays. Must be paid immediately in cash/check/transfer.",
    legalText: `REGULATION (EC) No 261/2004 - Article 4: Denied boarding

1. When an operating air carrier reasonably expects to deny boarding on a flight, it shall first call for volunteers to surrender their reservations in exchange for benefits under conditions to be agreed between the passenger concerned and the operating air carrier.

2. If an insufficient number of volunteers comes forward... the operating air carrier may then deny boarding to passengers against their will.

3. If boarding is denied to passengers against their will, the operating air carrier shall immediately compensate them in accordance with Article 7 and assist them in accordance with Articles 8 and 9.

Article 7(3): The compensation referred to in paragraph 1 shall be paid in cash, by electronic bank transfer, bank orders or bank cheques or, with the signed agreement of the passenger, in travel vouchers and/or other services.`,
    tips: [
      "NEVER sign anything accepting a voucher unless you truly want it",
      "Cash compensation must be offered FIRST before vouchers",
      "Get the airline's written confirmation of the denied boarding"
    ],
    checklist: [
      "Original boarding pass (shows you had a confirmed seat)",
      "Booking confirmation / E-ticket",
      "Written 'Denied Boarding' confirmation from airline (DEMAND THIS)",
      "Photo ID (passport preferred for EU claims)",
      "New boarding pass showing rebooked flight",
      "Proof of actual arrival time",
      "Receipts for meals, hotel, transport incurred due to rebooking",
      "Screenshot of flight distance for compensation tier"
    ]
  }
];
