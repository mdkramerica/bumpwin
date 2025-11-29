"use client";

import { FileText, Download, CheckCircle, Loader2, Mail, FileCheck, Clock, AlertCircle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
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

export default function ClaimLetter({ airline }: { airline?: string }) {
  const letterRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateStr, setDateStr] = useState("");
  const [refNum, setRefNum] = useState("");
  const [showChecklist, setShowChecklist] = useState(true);

  const airlineName = airline ? (AIRLINE_NAMES[airline] || airline) : "Airline";
  const airlineEmail = airline ? (AIRLINE_EMAILS[airline] || "customer.service@[airline].com") : "customer.service@[airline].com";
  const airlinePortal = airline ? (AIRLINE_PORTALS[airline] || null) : null;

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString());
    setRefNum(`BW-${Math.floor(Math.random() * 10000)}`);
  }, []);

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

      pdf.save("BumpWin-Claim-Letter.pdf");

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
  };

  return (
    <div className="space-y-6">
      {/* Hidden Instructions Div (Only for PDF Capture) */}
      <div className="absolute -left-[9999px] top-0">
         <div ref={instructionsRef} style={{ width: "794px", padding: "40px", ...styles.container }}> 
            <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", ...styles.heading }}>FILING INSTRUCTIONS</h1>
            
            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", ...styles.heading }}>STEP 1: REVIEW & SIGN</h2>
              <p style={styles.list}>• Review the attached Demand Letter.</p>
              <p style={styles.list}>• Fill in your name, address, and contact info.</p>
              <p style={styles.list}>• Sign your name at the bottom where indicated.</p>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", ...styles.heading }}>STEP 2: GATHER DOCUMENTS</h2>
              <p style={{ marginBottom: "5px", ...styles.list }}>Attach copies of the following with your letter:</p>
              <ul style={{ paddingLeft: "20px", ...styles.list }}>
                 <li>□ Boarding Pass (Original or Digital Screenshot)</li>
                 <li>□ Ticket Receipt / E-Ticket Confirmation</li>
                 <li>□ Flight Itinerary showing scheduled times</li>
                 <li>□ Proof of Delay (FlightAware screenshot, airline notification)</li>
                 <li>□ Expense Receipts (meals, hotels, transport if applicable)</li>
                 <li>□ Copy of ID (Driver's License or Passport)</li>
              </ul>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", ...styles.heading }}>STEP 3: SEND TO AIRLINE</h2>
              <p style={styles.list}>Send the letter and attachments to <strong>{airlineName}</strong>:</p>
              <div style={{ marginTop: "10px", padding: "15px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
                 <p style={{ fontWeight: "bold", ...styles.heading }}>📧 Via Email:</p>
                 <p style={{ fontFamily: "monospace", ...styles.list }}>{airlineEmail}</p>
                 <p style={{ marginTop: "10px", fontSize: "12px", ...styles.subtext }}>*Tip: Send with "Delivery Receipt" enabled.</p>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", ...styles.heading }}>STEP 4: FOLLOW UP</h2>
              <p style={styles.list}>• The airline must acknowledge receipt within 30 days.</p>
              <p style={styles.list}>• If denied or no response, file a DOT complaint at transportation.gov/airconsumer</p>
              <p style={styles.list}>• Keep copies of all correspondence.</p>
            </div>
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
          CLAIM UNLOCKED
        </div>

        <div 
          className="border-b-2 pb-3 sm:pb-4 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 relative z-10"
          style={styles.border}
        >
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl uppercase">Demand Letter</h2>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest" style={styles.subtext}>Pursuant to 14 CFR Part 250</p>
          </div>
          <div className="text-left sm:text-right text-[10px] sm:text-xs font-mono">
            <p>DATE: {dateStr || "..."}</p>
            <p>REF: {refNum || "..."}</p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 font-serif text-xs sm:text-sm leading-relaxed relative z-10">
          <p>
            <strong>To: {airlineName} Legal Department</strong><br />
            Re: Compensation Claim for Flight {airline ? airline : "UA"} 249
          </p>
          <p>To Whom It May Concern,</p>
          <p>
            I am writing to formally claim compensation under US Department of Transportation regulations regarding my confirmed reservation on flight {airline ? airline : "UA"} 249, which was significantly delayed/cancelled on {dateStr}.
          </p>
          <p>
            The delay of over 3 hours entitles me to compensation. I hereby demand payment of <strong>$600.00</strong> within 30 days.
          </p>
          <p>
            Sincerely,<br />
            [Passenger Name]
          </p>
        </div>
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
          How to Submit Your Claim
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
                  Click the download button above to get your personalized demand letter. Fill in your full name, address, phone number, and email where indicated. Sign and date the letter.
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
                <p className="text-sm text-slate-400 mb-3">
                  Attach these documents to strengthen your claim:
                </p>
                
                {showChecklist && (
                  <div className="space-y-2 mt-3">
                    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <input type="checkbox" className="mt-1 w-4 h-4 accent-lime-400" />
                      <div>
                        <span className="text-white text-sm font-medium">Boarding Pass</span>
                        <p className="text-xs text-slate-500">Original or screenshot from airline app</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <input type="checkbox" className="mt-1 w-4 h-4 accent-lime-400" />
                      <div>
                        <span className="text-white text-sm font-medium">Ticket Receipt / E-Ticket Confirmation</span>
                        <p className="text-xs text-slate-500">Shows your booking and amount paid</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <input type="checkbox" className="mt-1 w-4 h-4 accent-lime-400" />
                      <div>
                        <span className="text-white text-sm font-medium">Flight Itinerary</span>
                        <p className="text-xs text-slate-500">Showing original scheduled departure time</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <input type="checkbox" className="mt-1 w-4 h-4 accent-lime-400" />
                      <div>
                        <span className="text-white text-sm font-medium">Proof of Delay</span>
                        <p className="text-xs text-slate-500">FlightAware screenshot, airline delay notification, or gate display photo</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <input type="checkbox" className="mt-1 w-4 h-4 accent-lime-400" />
                      <div>
                        <span className="text-white text-sm font-medium">Expense Receipts <span className="text-slate-500">(if applicable)</span></span>
                        <p className="text-xs text-slate-500">Meals, hotels, ground transportation caused by delay</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <input type="checkbox" className="mt-1 w-4 h-4 accent-lime-400" />
                      <div>
                        <span className="text-white text-sm font-medium">Photo ID Copy</span>
                        <p className="text-xs text-slate-500">Driver's license or passport (matching ticket name)</p>
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
                <p className="text-sm text-slate-400 mb-3">
                  Send your completed letter and documents via one of these methods:
                </p>
                
                <div className="space-y-3">
                  {/* Email Option */}
                  <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                    <div className="flex items-center gap-2 text-lime-400 font-medium text-sm mb-1">
                      <Mail className="w-4 h-4" />
                      <span>Option A: Email (Recommended)</span>
                    </div>
                    <a 
                      href={`mailto:${airlineEmail}?subject=Compensation Claim - Flight ${airline || "UA"} 249 - Ref ${refNum}`}
                      className="text-white font-mono text-sm hover:text-lime-400 transition-colors break-all"
                    >
                      {airlineEmail}
                    </a>
                    <p className="text-xs text-slate-500 mt-1">
                      💡 Tip: Request a read/delivery receipt and BCC yourself
                    </p>
                  </div>
                  
                  {/* Web Portal Option */}
                  {airlinePortal && (
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                      <div className="flex items-center gap-2 text-blue-400 font-medium text-sm mb-1">
                        <ExternalLink className="w-4 h-4" />
                        <span>Option B: Online Portal</span>
                      </div>
                      <a 
                        href={airlinePortal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white text-sm hover:text-blue-400 transition-colors underline"
                      >
                        {airlineName} Customer Care Portal →
                      </a>
                      <p className="text-xs text-slate-500 mt-1">
                        Upload your letter as an attachment in the complaint form
                      </p>
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
                    <span>If no response after 30 days, send a follow-up email referencing your original claim</span>
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
              <h4 className="font-bold text-amber-300 mb-1">If Your Claim is Denied</h4>
              <p className="text-sm text-amber-100/80 mb-2">
                If the airline denies your claim or doesn't respond within 60 days, you can escalate to the US Department of Transportation:
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

        {/* Pro Tips */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-lg">💡</span> Pro Tips for Success
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-lime-400">•</span>
              <span>Keep copies of <strong className="text-white">everything</strong> you send</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime-400">•</span>
              <span>Use <strong className="text-white">certified mail</strong> if sending physical letters for proof of delivery</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime-400">•</span>
              <span>Be <strong className="text-white">polite but firm</strong> — cite specific regulations (14 CFR Part 250)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime-400">•</span>
              <span>Include your <strong className="text-white">frequent flyer number</strong> if you have one</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime-400">•</span>
              <span>Screenshot <strong className="text-white">FlightAware</strong> or <strong className="text-white">FlightStats</strong> for independent delay proof</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
