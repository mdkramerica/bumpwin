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
    description: "If you are bumped against your will and the airline gets you to your destination between 1 and 2 hours late. This is one of the only situations in US law where cash compensation is mandatory.",
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
    description: "If you are bumped and the airline cannot get you to your destination within 2 hours of your original arrival time. This is one of the only situations in US law where cash compensation is mandatory.",
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
    id: "us-disability-wheelchair",
    title: "Wheelchair / Mobility Equipment Damage",
    region: "US",
    type: "BAGGAGE",
    condition: "Wheelchair or mobility device lost, damaged, or destroyed by airline",
    compensation: "Full repair or replacement value + related expenses",
    source: "14 CFR Part 382 (DOT Disability Rules)",
    description: "US DOT rules treat wheelchairs like an extension of the passenger's body. If an airline damages, loses, or destroys a wheelchair or mobility device, it must cover full repair or replacement costs and related reasonable expenses.",
    legalText: `US Department of Transportation disability regulations (14 CFR Part 382) require airlines to fully compensate passengers when their wheelchairs or other assistive devices are lost, damaged, or destroyed in transit.

DOT guidance (including the Airline Passengers with Disabilities Bill of Rights and subsequent rulemakings) makes clear that:
- Airlines must promptly repair or replace damaged wheelchairs or mobility devices with equipment that is functionally equivalent;
- Compensation cannot be capped at the general baggage liability limit when it comes to wheelchairs and other assistive devices;
- Airlines must also cover reasonable expenses incurred as a direct result of the damage (such as temporary rentals or transportation to and from repair facilities).

Note: As of November 2025, lawmakers are pressing DOT to fully enforce and strengthen these protections, and additional guidance may be issued. Always confirm the latest details on transportation.gov.`,
    tips: [
      "Report damage before leaving the airport—ask for a written incident report specific to mobility equipment.",
      "Take detailed photos and video of the damage and how it impacts usability.",
      "Request a functionally equivalent loaner chair or other temporary accommodation in writing.",
      "Keep receipts for rentals, repairs, medical visits, or transport you needed because of the damage."
    ],
    checklist: [
      "Boarding pass and booking confirmation",
      "Baggage or mobility device tag number (if provided)",
      "Written incident report from the airline describing the wheelchair/mobility device damage",
      "Photos and/or video clearly showing the damage from multiple angles",
      "Original purchase invoice or proof of value for the wheelchair/mobility device (if available)",
      "Written repair estimate or replacement quote from the manufacturer or repair shop",
      "Receipts for any temporary rental equipment, taxis/transport, or medical visits caused by the damage",
      "Your contact details and preferred method for receiving reimbursement or replacement"
    ]
  },
  {
    id: "us-tarmac-delay",
    title: "Tarmac Delay (Domestic)",
    region: "US",
    type: "DELAY",
    condition: "> 3 hours on tarmac",
    compensation: "Right to deplane (no mandatory cash compensation)",
    source: "DOT Tarmac Delay Rule",
    description: "Airlines must allow you to get off the plane after 3 hours on the tarmac for domestic flights. There is still no automatic federal cash compensation for delays in the US—this rule is about your right to deplane and basic care only.",
    legalText: `49 U.S.C. § 42301 - Tarmac Delay Contingency Plan

For domestic flights, airlines must provide passengers the opportunity to deplane after the aircraft has sat on the tarmac for 3 hours. For international flights, the limit is 4 hours.

Airlines must also:
- Provide adequate food and water no later than 2 hours after the aircraft leaves the gate
- Maintain operable lavatories
- Provide adequate medical attention if needed

Airlines can be fined per passenger for violations, but there is still no mandatory federal cash compensation for passengers due solely to delay time.`,
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
    description: "If delay is within airline control. €250 (<1500km), €400 (1500-3500km), €600 (>3500km). As of November 2025, EU institutions are debating reforms, but the 3+ hour threshold and these compensation bands still apply until new legislation takes effect.",
    legalText: `REGULATION (EC) No 261/2004 - Article 7: Right to compensation

1. Where reference is made to this Article, passengers shall receive compensation amounting to:
(a) EUR 250 for all flights of 1500 kilometres or less;
(b) EUR 400 for all intra-Community flights of more than 1500 kilometres, and for all other flights between 1500 and 3500 kilometres;
(c) EUR 600 for all flights not falling under (a) or (b).

In determining the distance, the basis shall be the last destination at which the denial of boarding or cancellation will delay the passenger's arrival after the scheduled time.

Note: The Sturgeon ruling (C-402/07) extended this compensation to delays of 3+ hours, not just cancellations.

As of 2025, the Council of the EU has proposed increasing delay thresholds (for example, 4 hours for some short-haul flights and 6 hours for certain long-haul flights), while the European Parliament has voted to keep the current 3-hour trigger. Until a final compromise text is adopted and enters into force, the original EC 261/2004 rules and Sturgeon interpretation continue to apply.`,
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
    description: "Compensation applies unless extraordinary circumstances (weather, ATC strike). You also get meals/hotel. Proposed reforms in 2025 are being negotiated, but the core cancellation rights in EC 261/2004 remain in force.",
    legalText: `REGULATION (EC) No 261/2004 - Article 5: Cancellation

1. In case of cancellation of a flight, the passengers concerned shall:
(a) be offered assistance by the operating air carrier in accordance with Article 8 (refund or re-routing); and
(b) be offered assistance by the operating air carrier in accordance with Article 9(1)(a) and 9(2) (meals, refreshments, hotel accommodation, transport); and
(c) have the right to compensation by the operating air carrier in accordance with Article 7, unless:
   (i) they are informed of the cancellation at least two weeks before the scheduled time of departure; or
   (ii) they are informed of the cancellation between two weeks and seven days before the scheduled time of departure and are offered re-routing... arriving no more than two hours after the scheduled time of arrival; or
   (iii) they are informed of the cancellation less than seven days before the scheduled time of departure and are offered re-routing... arriving no more than one hour after the scheduled time of arrival.

Note: In 2025, EU legislators are negotiating revisions to passenger rights, including clearer rerouting duties and clarification of compensation triggers. Until a new regulation is formally adopted and implemented, EC 261/2004 remains the binding law.`,
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
    description: "Same compensation tiers as delays. Must be paid immediately in cash/check/transfer. Lawmakers are reviewing the regulation in 2025, but denied boarding compensation remains one of the strongest and clearest rights under EC 261/2004.",
    legalText: `REGULATION (EC) No 261/2004 - Article 4: Denied boarding

1. When an operating air carrier reasonably expects to deny boarding on a flight, it shall first call for volunteers to surrender their reservations in exchange for benefits under conditions to be agreed between the passenger concerned and the operating air carrier.

2. If an insufficient number of volunteers comes forward... the operating air carrier may then deny boarding to passengers against their will.

3. If boarding is denied to passengers against their will, the operating air carrier shall immediately compensate them in accordance with Article 7 and assist them in accordance with Articles 8 and 9.

Article 7(3): The compensation referred to in paragraph 1 shall be paid in cash, by electronic bank transfer, bank orders or bank cheques or, with the signed agreement of the passenger, in travel vouchers and/or other services.

Note: Any future reform of EC 261/2004 will still have to respect core consumer protection principles. For now, these provisions remain fully applicable.`,
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
  },
  {
    id: "eu-rerouting-rights",
    title: "Self-Arranged Rerouting (Pending Reform)",
    region: "EU",
    type: "DELAY",
    condition: "Airline fails to reroute you within a reasonable time after cancellation or long delay",
    compensation: "Reimbursement for self-booked rerouting (up to 400% of ticket price) – proposal under negotiation",
    source: "Proposed EU Passenger Rights Reform (Council position, June 2025)",
    description: "EU institutions are discussing a reform that would allow passengers to book their own rerouting (for example on another airline or mode of transport) and claim reimbursement – potentially up to 400% of the original ticket price – if the airline fails to offer rerouting within a set window. This is NOT yet in force, but it signals where EU law is heading.",
    legalText: `In June 2025 the Council of the European Union adopted a negotiating position on a revision of air passenger rights. Among other things, it proposed clearer duties for airlines to promptly reroute passengers after cancellations or long delays.

Key elements of the Council position include:
- Airlines must actively offer passengers rerouting options within a specified time frame;
- If the airline fails to provide rerouting within that time, passengers could arrange their own alternative transport and seek reimbursement;
- Reimbursement could be capped at a multiple of the original ticket price (public discussions referenced figures like up to 400% of the fare).

IMPORTANT: As of November 2025 this reform is still under negotiation between the Council, Parliament and Commission. It is NOT yet binding law. The existing EC 261/2004 framework continues to govern compensation and assistance. Passengers should check the latest status on official EU channels before relying on these proposed rights.`,
    tips: [
      "Treat this as a 'coming soon' right – great leverage in negotiations, but not automatic yet.",
      "If you self-reroute today, keep all receipts and screenshots and be prepared to argue under existing EC 261 principles (duty to mitigate, right to care).",
      "Watch for updates from the European Commission or national enforcement bodies about when any reform actually takes effect."
    ],
    checklist: [
      "Original booking confirmation and ticket showing price paid",
      "All emails / messages from the airline about cancellation or rerouting offers (or lack thereof)",
      "Receipts and confirmations for any self-booked replacement flights, trains, or other transport",
      "Screenshots or notes showing timelines – when you were informed, when rerouting was (or was not) offered",
      "Any written responses from the airline refusing to reroute or reimburse",
      "Links or PDFs of the latest official EU guidance on the reform when it becomes available"
    ]
  }
];
