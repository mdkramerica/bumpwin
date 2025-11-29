"use client";

import { FileText, Download, CheckCircle, Loader2, Mail, FileCheck, Clock, AlertCircle, ExternalLink, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AIRLINE_EMAILS: Record<string, string> = {
  "UA": "customercare@united.com",
  "AA": "American.Airlines.Customer.Relations@aa.com",
  "DL": "charter.services@delta.com",
  "WN": "custrel@custsupport.southwest.com",
  "B6": "dearjetblue@jetblue.com",
  "AS": "customer.care@alaskaair.com",
  "NK": "customerservice@spirit.com",
  "F9": "customer.relations@flyfrontier.com",
};

const AIRLINE_NAMES: Record<string, string> = {
  "UA": "United Airlines",
  "AA": "American Airlines",
  "DL": "Delta Air Lines",
  "WN": "Southwest Airlines",
  "B6": "JetBlue Airways",
  "AS": "Alaska Airlines",
  "NK": "Spirit Airlines",
  "F9": "Frontier Airlines",
};

const AIRLINE_PORTALS: Record<string, string> = {
  "UA": "https://www.united.com/en/us/customer-care",
  "AA": "https://www.aa.com/contact/forms",
  "DL": "https://www.delta.com/contactus/commentComplaint",
  "WN": "https://www.southwest.com/contact-us/contact-us.html",
  "B6": "https://www.jetblue.com/contact-us",
  "AS": "https://www.alaskaair.com/feedback",
  "NK": "https://www.spirit.com/contact-us",
  "F9": "https://www.flyfrontier.com/contact-us/",
};

interface ClaimLetterProps {
  airline?: string;
  flightNumber?: string;
  claimType?: "BUMPING" | "DELAY" | "CANCELLATION";
  ticketPrice?: number | null;
  delayMinutes?: number;
  flightDate?: string;
}

export default function ClaimLetter({ 
  airline,
  flightNumber = "XXX",
  claimType = "DELAY",
  ticketPrice = null,
  delayMinutes = 200,
  flightDate,
}: ClaimLetterProps) {
  const letterRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateStr, setDateStr] = useState("");
  const [refNum, setRefNum] = useState("");
  const [showChecklist, setShowChecklist] = useState(true);
  const [letterType, setLetterType] = useState<"BUMPING" | "DELAY" | "CANCELLATION">(claimType);

  const airlineName = airline ? (AIRLINE_NAMES[airline] || airline) : "[AIRLINE NAME]";
  const airlineEmail = airline ? (AIRLINE_EMAILS[airline] || "customer.service@[airline].com") : "customer.service@[airline].com";
  const airlinePortal = airline ? (AIRLINE_PORTALS[airline] || null) : null;
  const fullFlightNum = airline ? `${airline} ${flightNumber}` : `[FLIGHT NUMBER]`;

  // Calculate compensation estimate for bumping
  const calculateBumpingCompensation = () => {
    const fare = ticketPrice || 300; // Default estimate
    if (delayMinutes <= 60) return { amount: 0, formula: "Under 1 hour delay = $0" };
    if (delayMinutes <= 120) {
      const amt = Math.min(fare * 2, 775);
      return { amount: amt, formula: `200% of $${fare} fare = $${fare * 2}, capped at $775` };
    }
    const amt = Math.min(fare * 4, 1550);
    return { amount: amt, formula: `400% of $${fare} fare = $${fare * 4}, capped at $1,550` };
  };

  const bumpingComp = calculateBumpingCompensation();

  useEffect(() => {
    setDateStr(flightDate || new Date().toLocaleDateString());
    setRefNum(`BW-${Math.floor(Math.random() * 10000)}`);
  }, [flightDate]);

  const handleDownload = async () => {
    if (!letterRef.current || !instructionsRef.current) return;

    try {
      setIsGenerating(true);
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas1 = await html2canvas(letterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const canvas2 = await html2canvas(instructionsRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();

      const imgData1 = canvas1.toDataURL("image/png");
      const imgHeight1 = (canvas1.height * pdfWidth) / canvas1.width;
      pdf.addImage(imgData1, "PNG", 0, 0, pdfWidth, imgHeight1);

      pdf.addPage();
      const imgData2 = canvas2.toDataURL("image/png");
      const imgHeight2 = (canvas2.height * pdfWidth) / canvas2.width;
      pdf.addImage(imgData2, "PNG", 0, 0, pdfWidth, imgHeight2);

      pdf.save(`BumpWin-${letterType}-Letter.pdf`);

    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const styles = {
    container: { backgroundColor: "#ffffff", color: "#0f172a" },
    watermark: { color: "#f1f5f9" },
    border: { borderColor: "#0f172a" },
    subtext: { color: "#64748b" },
    heading: { color: "#0f172a" },
    list: { color: "#334155" },
    warning: { backgroundColor: "#fef3c7", borderColor: "#f59e0b", color: "#92400e" },
  };

  // Generate letter content based on type
  const renderLetterContent = () => {
    if (letterType === "BUMPING") {
      return (
        <div className="space-y-3 sm:space-y-4 font-serif text-xs sm:text-sm leading-relaxed relative z-10">
          <p>
            <strong>To: {airlineName} Customer Relations</strong><br />
            Re: Denied Boarding Compensation Claim – Flight {fullFlightNum}
          </p>
          <p>To Whom It May Concern,</p>
          <p>
            I am writing to formally request compensation for <strong>involuntary denied boarding</strong> on flight {fullFlightNum} on {dateStr}. Despite holding a confirmed reservation and arriving at the gate on time, I was denied boarding due to overbooking.
          </p>
          <p>
            Under <strong>14 CFR Part 250</strong> (US Department of Transportation regulations), passengers who are involuntarily denied boarding are entitled to compensation based on the length of delay to their final destination:
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", marginBottom: "8px" }}>
            <li>• 1-2 hour delay: 200% of one-way fare (maximum $775)</li>
            <li>• Over 2 hour delay: 400% of one-way fare (maximum $1,550)</li>
          </ul>
          <p>
            Based on my delay of approximately <strong>{Math.floor(delayMinutes / 60)} hours {delayMinutes % 60} minutes</strong> to my final destination{ticketPrice ? ` and my one-way fare of $${ticketPrice}` : ""}, I am entitled to compensation of <strong>${bumpingComp.amount.toFixed(2)}</strong> ({bumpingComp.formula}).
          </p>
          <p>
            Please process this compensation within 30 days. If I do not receive a satisfactory response, I will file a formal complaint with the US Department of Transportation.
          </p>
          <p>
            Sincerely,<br />
            <br />
            _______________________________<br />
            [Your Full Name]<br />
            [Your Address]<br />
            [Your Email]<br />
            [Your Phone Number]<br />
            [Frequent Flyer Number, if applicable]
          </p>
        </div>
      );
    }

    if (letterType === "CANCELLATION") {
      return (
        <div className="space-y-3 sm:space-y-4 font-serif text-xs sm:text-sm leading-relaxed relative z-10">
          <p>
            <strong>To: {airlineName} Customer Relations</strong><br />
            Re: Flight Cancellation Complaint – Flight {fullFlightNum}
          </p>
          <p>To Whom It May Concern,</p>
          <p>
            I am writing regarding the cancellation of flight {fullFlightNum} on {dateStr}, for which I held a confirmed reservation.
          </p>
          <div style={{ ...styles.warning, padding: "12px", borderRadius: "6px", border: "1px solid", marginTop: "8px", marginBottom: "8px", fontSize: "11px" }}>
            <strong>Important Note:</strong> Under current US federal law, there is no mandatory cash compensation for flight cancellations. However, passengers are entitled to a full refund to the original form of payment for cancelled flights.
          </div>
          <p>
            I am requesting the following:
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", marginBottom: "8px" }}>
            <li>• <strong>Full refund</strong> of my ticket price to the original form of payment</li>
            <li>• Reimbursement for any <strong>additional expenses</strong> incurred due to the cancellation (receipts attached)</li>
            <li>• Consideration of <strong>goodwill compensation</strong> (vouchers, miles, or other accommodation) for the significant inconvenience caused</li>
          </ul>
          <p>
            While I understand cash compensation is not federally mandated for cancellations, I trust that {airlineName} values customer satisfaction and will provide fair accommodation for this disruption.
          </p>
          <p>
            Please respond within 30 days. If I do not receive a satisfactory resolution, I will file a complaint with the US Department of Transportation.
          </p>
          <p>
            Sincerely,<br />
            <br />
            _______________________________<br />
            [Your Full Name]<br />
            [Your Address]<br />
            [Your Email]<br />
            [Your Phone Number]
          </p>
        </div>
      );
    }

    // DELAY letter (default)
    return (
      <div className="space-y-3 sm:space-y-4 font-serif text-xs sm:text-sm leading-relaxed relative z-10">
        <p>
          <strong>To: {airlineName} Customer Relations</strong><br />
          Re: Flight Delay Complaint – Flight {fullFlightNum}
        </p>
        <p>To Whom It May Concern,</p>
        <p>
          I am writing regarding the significant delay of flight {fullFlightNum} on {dateStr}. My flight was delayed by approximately <strong>{Math.floor(delayMinutes / 60)} hours {delayMinutes % 60} minutes</strong>, causing considerable inconvenience.
        </p>
        <div style={{ ...styles.warning, padding: "12px", borderRadius: "6px", border: "1px solid", marginTop: "8px", marginBottom: "8px", fontSize: "11px" }}>
          <strong>Important Note:</strong> Under current US federal law, there is no mandatory cash compensation for flight delays. However, airlines have customer service obligations and may provide voluntary compensation.
        </div>
        <p>
          I am requesting the following:
        </p>
        <ul style={{ paddingLeft: "20px", marginTop: "8px", marginBottom: "8px" }}>
          <li>• Reimbursement for <strong>out-of-pocket expenses</strong> incurred during the delay (meals, transportation, accommodation – receipts attached)</li>
          <li>• <strong>Goodwill compensation</strong> in the form of travel vouchers, frequent flyer miles, or other accommodation</li>
          <li>• Written explanation of the <strong>cause of the delay</strong> for my records</li>
        </ul>
        <p>
          I understand that {airlineName} values its customers and I trust you will provide fair accommodation for this significant disruption to my travel plans.
        </p>
        <p>
          Please respond within 30 days. If I do not receive a satisfactory resolution, I will file a complaint with the US Department of Transportation.
        </p>
        <p>
          Sincerely,<br />
          <br />
          _______________________________<br />
          [Your Full Name]<br />
          [Your Address]<br />
          [Your Email]<br />
          [Your Phone Number]
        </p>
      </div>
    );
  };

  // Get regulation reference based on letter type
  const getRegulationRef = () => {
    if (letterType === "BUMPING") return "14 CFR Part 250";
    return "DOT Consumer Protection";
  };

  return (
    <div className="space-y-6">
      {/* Letter Type Selector */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <h4 className="text-sm font-bold text-slate-400 mb-3">SELECT YOUR SITUATION:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => setLetterType("BUMPING")}
            className={`p-3 rounded-lg border text-left transition-all ${
              letterType === "BUMPING" 
                ? "bg-lime-400/10 border-lime-400 text-lime-400" 
                : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
            }`}
          >
            <div className="font-bold text-sm">Involuntary Bumping</div>
            <div className="text-xs opacity-70">Cash compensation available</div>
          </button>
          <button
            onClick={() => setLetterType("DELAY")}
            className={`p-3 rounded-lg border text-left transition-all ${
              letterType === "DELAY" 
                ? "bg-amber-400/10 border-amber-400 text-amber-400" 
                : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
            }`}
          >
            <div className="font-bold text-sm">Flight Delay</div>
            <div className="text-xs opacity-70">Request expenses + goodwill</div>
          </button>
          <button
            onClick={() => setLetterType("CANCELLATION")}
            className={`p-3 rounded-lg border text-left transition-all ${
              letterType === "CANCELLATION" 
                ? "bg-red-400/10 border-red-400 text-red-400" 
                : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
            }`}
          >
            <div className="font-bold text-sm">Cancellation</div>
            <div className="text-xs opacity-70">Refund + goodwill request</div>
          </button>
        </div>
        
        {/* Compensation Info Box */}
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          letterType === "BUMPING" 
            ? "bg-lime-400/10 border border-lime-400/30 text-lime-300"
            : "bg-amber-500/10 border border-amber-500/30 text-amber-300"
        }`}>
          {letterType === "BUMPING" ? (
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Cash Compensation Available!</p>
                <p className="text-xs opacity-80 mt-1">
                  US law (14 CFR Part 250) requires airlines to pay cash for involuntary denied boarding. 
                  {ticketPrice && ` Based on your $${ticketPrice} fare, you may be owed up to $${bumpingComp.amount}.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">No Mandatory Cash Compensation</p>
                <p className="text-xs opacity-80 mt-1">
                  US law does not require cash compensation for {letterType === "DELAY" ? "delays" : "cancellations"}. 
                  However, you can request expense reimbursement and goodwill compensation (vouchers, miles).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Instructions Div (Only for PDF Capture) */}
      <div className="absolute -left-[9999px] top-0">
         <div ref={instructionsRef} style={{ width: "794px", padding: "40px", ...styles.container }}> 
            <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", ...styles.heading }}>FILING INSTRUCTIONS</h1>
            
            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", ...styles.heading }}>STEP 1: COMPLETE THE LETTER</h2>
              <p style={styles.list}>• Fill in all bracketed fields [Your Name], [Address], etc.</p>
              <p style={styles.list}>• Review the letter for accuracy</p>
              <p style={styles.list}>• Sign and date the letter</p>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", ...styles.heading }}>STEP 2: GATHER DOCUMENTS</h2>
              <p style={{ marginBottom: "5px", ...styles.list }}>Attach copies of:</p>
              <ul style={{ paddingLeft: "20px", ...styles.list }}>
                 <li>□ Boarding Pass or E-Ticket</li>
                 <li>□ Ticket Receipt showing price paid</li>
                 <li>□ Proof of {letterType === "BUMPING" ? "denied boarding (gate agent communication, rebooking confirmation)" : letterType === "DELAY" ? "delay (FlightAware screenshot, airline notification)" : "cancellation (airline notification)"}</li>
                 <li>□ Expense Receipts (if claiming reimbursement)</li>
                 <li>□ Photo ID</li>
              </ul>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", ...styles.heading }}>STEP 3: SEND TO AIRLINE</h2>
              <p style={styles.list}>Email to: <strong>{airlineEmail}</strong></p>
              <p style={{ marginTop: "10px", fontSize: "12px", ...styles.subtext }}>Request delivery receipt. Keep a copy for your records.</p>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", ...styles.heading }}>STEP 4: IF DENIED OR NO RESPONSE</h2>
              <p style={styles.list}>File a complaint with the US DOT at:</p>
              <p style={{ fontWeight: "bold", ...styles.heading }}>transportation.gov/airconsumer/file-consumer-complaint</p>
            </div>

            {letterType !== "BUMPING" && (
              <div style={{ ...styles.warning, padding: "15px", borderRadius: "8px", border: "1px solid" }}>
                <p style={{ fontWeight: "bold", marginBottom: "5px" }}>⚠️ Important Legal Note</p>
                <p style={{ fontSize: "12px" }}>
                  US federal law does not mandate cash compensation for flight {letterType === "DELAY" ? "delays" : "cancellations"}. 
                  This letter requests voluntary goodwill compensation and expense reimbursement. 
                  Only involuntary denied boarding (bumping) has mandatory cash compensation under 14 CFR Part 250.
                </p>
              </div>
            )}
         </div>
      </div>

      {/* Demand Letter Preview */}
      <div 
        ref={letterRef} 
        className="p-4 sm:p-8 rounded-xl shadow-2xl max-w-full overflow-hidden relative"
        style={styles.container}
      >
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-6xl font-black opacity-50 -rotate-12 select-none pointer-events-none whitespace-nowrap z-0"
          style={styles.watermark}
        >
          {letterType === "BUMPING" ? "COMPENSATION CLAIM" : "COMPLAINT LETTER"}
        </div>

        <div 
          className="border-b-2 pb-3 sm:pb-4 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 relative z-10"
          style={styles.border}
        >
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl uppercase">
              {letterType === "BUMPING" ? "Compensation Demand" : letterType === "DELAY" ? "Delay Complaint" : "Cancellation Complaint"}
            </h2>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest" style={styles.subtext}>
              {getRegulationRef()}
            </p>
          </div>
          <div className="text-left sm:text-right text-[10px] sm:text-xs font-mono">
            <p>DATE: {dateStr || "..."}</p>
            <p>REF: {refNum || "..."}</p>
          </div>
        </div>

        {renderLetterContent()}
      </div>

      {/* Download Button */}
      <div className="flex flex-col gap-3">
         <button 
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full bg-lime-400 hover:bg-lime-300 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-lime-400/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
         >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isGenerating ? "Generating..." : "Download PDF & Instructions"}
         </button>
         <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3 text-lime-400" />
            <span>Generated instantly. Ready to file.</span>
         </div>
      </div>

      {/* ===== SUBMISSION INSTRUCTIONS SECTION ===== */}
      <div className="border-t border-slate-800 pt-6 mt-6 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-lime-400" />
          How to Submit Your {letterType === "BUMPING" ? "Claim" : "Complaint"}
        </h3>

        {/* Step by Step Instructions */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-lime-400 text-slate-900 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1">Download & Complete the Letter</h4>
                <p className="text-sm text-slate-400">
                  Click download above. Fill in all fields marked with brackets: your name, address, contact info. Sign and date the letter.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 - Checklist */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-lime-400 text-slate-900 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <button 
                  onClick={() => setShowChecklist(!showChecklist)}
                  className="w-full flex items-center justify-between"
                >
                  <h4 className="font-bold text-white mb-1 text-left">Gather Required Documents</h4>
                  {showChecklist ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                
                {showChecklist && (
                  <div className="space-y-2 mt-3">
                    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <input type="checkbox" className="mt-1 w-4 h-4 accent-lime-400" />
                      <div>
                        <span className="text-white text-sm font-medium">Boarding Pass / E-Ticket</span>
                        <p className="text-xs text-slate-500">Proves you had a confirmed reservation</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <input type="checkbox" className="mt-1 w-4 h-4 accent-lime-400" />
                      <div>
                        <span className="text-white text-sm font-medium">Ticket Receipt</span>
                        <p className="text-xs text-slate-500">Shows price paid (important for bumping claims)</p>
                      </div>
                    </label>
                    
                    {letterType === "BUMPING" && (
                      <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                        <input type="checkbox" className="mt-1 w-4 h-4 accent-lime-400" />
                        <div>
                          <span className="text-white text-sm font-medium">Proof of Denied Boarding</span>
                          <p className="text-xs text-slate-500">Gate agent communication, rebooking confirmation, or written notice</p>
                        </div>
                      </label>
                    )}
                    
                    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <input type="checkbox" className="mt-1 w-4 h-4 accent-lime-400" />
                      <div>
                        <span className="text-white text-sm font-medium">Proof of {letterType === "BUMPING" ? "Arrival Time" : letterType === "DELAY" ? "Delay" : "Cancellation"}</span>
                        <p className="text-xs text-slate-500">
                          {letterType === "BUMPING" 
                            ? "Shows you arrived at gate on time" 
                            : "FlightAware screenshot, airline notification, or gate display photo"}
                        </p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <input type="checkbox" className="mt-1 w-4 h-4 accent-lime-400" />
                      <div>
                        <span className="text-white text-sm font-medium">Expense Receipts</span>
                        <p className="text-xs text-slate-500">Meals, hotels, transportation incurred due to disruption</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <input type="checkbox" className="mt-1 w-4 h-4 accent-lime-400" />
                      <div>
                        <span className="text-white text-sm font-medium">Photo ID Copy</span>
                        <p className="text-xs text-slate-500">Matching the name on your ticket</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 3 - Submit */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-lime-400 text-slate-900 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1">Submit to {airlineName}</h4>
                
                <div className="space-y-3 mt-3">
                  <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                    <div className="flex items-center gap-2 text-lime-400 font-medium text-sm mb-1">
                      <Mail className="w-4 h-4" />
                      <span>Email (Recommended)</span>
                    </div>
                    <a 
                      href={`mailto:${airlineEmail}?subject=${letterType === "BUMPING" ? "Denied Boarding Compensation" : letterType === "DELAY" ? "Flight Delay Complaint" : "Flight Cancellation Complaint"} - Flight ${fullFlightNum} - Ref ${refNum}`}
                      className="text-white font-mono text-sm hover:text-lime-400 transition-colors break-all"
                    >
                      {airlineEmail}
                    </a>
                    <p className="text-xs text-slate-500 mt-1">
                      💡 Request delivery receipt and BCC yourself
                    </p>
                  </div>
                  
                  {airlinePortal && (
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                      <div className="flex items-center gap-2 text-blue-400 font-medium text-sm mb-1">
                        <ExternalLink className="w-4 h-4" />
                        <span>Online Portal</span>
                      </div>
                      <a 
                        href={airlinePortal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white text-sm hover:text-blue-400 transition-colors underline"
                      >
                        {airlineName} Customer Care Portal →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 - Follow Up */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-lime-400 text-slate-900 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1">Wait & Follow Up</h4>
                <div className="text-sm text-slate-400 space-y-2">
                  <p className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span>Airlines typically respond within <strong className="text-white">30-60 days</strong></span>
                  </p>
                  <p className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>If no response after 30 days, send a follow-up referencing your original claim</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DOT Escalation Notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-300 mb-1">If Denied or No Response</h4>
              <p className="text-sm text-amber-100/80 mb-2">
                {letterType === "BUMPING" 
                  ? "If the airline refuses to pay the required compensation, file a formal complaint with the DOT. Bumping compensation is legally mandated."
                  : "While cash compensation isn't legally required for this situation, the DOT tracks complaints and airlines often respond to escalated issues."}
              </p>
              <a 
                href="https://www.transportation.gov/airconsumer/file-consumer-complaint"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 font-medium"
              >
                File a DOT Complaint →
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-xs text-slate-500">
          <p>
            <strong className="text-slate-400">Disclaimer:</strong> This tool provides informational templates only. 
            {letterType === "BUMPING" 
              ? " Involuntary denied boarding compensation is mandated by 14 CFR Part 250, but actual amounts depend on your specific circumstances."
              : " US federal law does not require cash compensation for flight delays or cancellations. This letter requests voluntary goodwill compensation."
            }
            {" "}Consult a legal professional for advice specific to your situation.
          </p>
        </div>
      </div>
    </div>
  );
}
