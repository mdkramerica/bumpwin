"use client";

import { FileText, Download, CheckCircle, Loader2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ... imports ...

const AIRLINE_EMAILS: Record<string, string> = {
  "UA": "customercare@united.com",
  "AA": "American.Airlines.Customer.Relations@aa.com",
  "DL": "charter.services@delta.com", // Delta is hard, usually web form
  "WN": "custrel@custsupport.southwest.com",
  "B6": "dearjetblue@jetblue.com",
};

const AIRLINE_NAMES: Record<string, string> = {
  "UA": "United Airlines",
  "AA": "American Airlines",
  "DL": "Delta Air Lines",
  "WN": "Southwest Airlines",
  "B6": "JetBlue Airways",
};

export default function ClaimLetter({ airline }: { airline?: string }) {
  const letterRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null); // New Ref for Instructions
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateStr, setDateStr] = useState("");
  const [refNum, setRefNum] = useState("");

  const airlineName = airline ? (AIRLINE_NAMES[airline] || airline) : "Airline";
  const airlineEmail = airline ? (AIRLINE_EMAILS[airline] || "customer.service@[airline].com") : "customer.service@[airline].com";

  // Fix Hydration Error: Generate random data on client only
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString());
    setRefNum(`BW-${Math.floor(Math.random() * 10000)}`);
  }, []);

  const handleDownload = async () => {
    if (!letterRef.current || !instructionsRef.current) return;

    try {
      setIsGenerating(true);
      
      // Wait a tick to ensure any state updates render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture Letter (Page 1)
      const canvas1 = await html2canvas(letterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // Capture Instructions (Page 2)
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
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Page 1
      const imgData1 = canvas1.toDataURL("image/png");
      const imgHeight1 = (canvas1.height * pdfWidth) / canvas1.width;
      pdf.addImage(imgData1, "PNG", 0, 0, pdfWidth, imgHeight1);

      // Page 2
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

  // We use inline styles for colors to ensure html2canvas compatibility
  // avoiding Tailwind v4's potential use of 'oklch' or 'lab' functions.
  const styles = {
    container: { backgroundColor: "#ffffff", color: "#0f172a" }, // bg-white text-slate-900
    watermark: { color: "#f1f5f9" }, // text-slate-100
    border: { borderColor: "#0f172a" }, // border-slate-900
    subtext: { color: "#64748b" }, // text-slate-500
    heading: { color: "#0f172a" }, // text-slate-900 for headings
    list: { color: "#334155" }, // text-slate-700 for list text
  };

  return (
    <div className="space-y-6">
      {/* Hidden Instructions Div (Only for Capture) */}
      <div className="absolute -left-[9999px] top-0">
         <div ref={instructionsRef} style={{ width: "794px", padding: "40px", ...styles.container }}> 
            <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", ...styles.heading }}>FILING INSTRUCTIONS</h1>
            
            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", ...styles.heading }}>STEP 1: REVIEW & SIGN</h2>
              <p style={styles.list}>• Review the attached Demand Letter.</p>
              <p style={styles.list}>• Sign your name at the bottom where indicated.</p>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", ...styles.heading }}>STEP 2: GATHER DOCUMENTS</h2>
              <p style={{ marginBottom: "5px", ...styles.list }}>Attach copies of the following with your letter:</p>
              <ul style={{ paddingLeft: "20px", ...styles.list }}>
                 <li>□ Boarding Pass (Original or Digital Screenshot)</li>
                 <li>□ Ticket Receipt / E-Ticket Confirmation</li>
                 <li>□ Expense Receipts (if claiming meals/hotels)</li>
                 <li>□ Copy of ID (Driver's License/Passport)</li>
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
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", ...styles.heading }}>STEP 4: NEXT STEPS</h2>
              <p style={styles.list}>• The airline must acknowledge receipt within 30 days.</p>
              <p style={styles.list}>• If they deny the claim or do not respond, file a complaint with the US DOT at <span style={{textDecoration: "underline"}}>transportation.gov/airconsumer</span>.</p>
            </div>
         </div>
      </div>

      {/* Capture Area */}
      <div 
        ref={letterRef} 
        className="p-4 sm:p-8 rounded-xl shadow-2xl max-w-full overflow-hidden relative"
        style={styles.container}
      >
        {/* Watermark */}
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
          <p>
            To Whom It May Concern,
          </p>
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
    </div>
  );
}