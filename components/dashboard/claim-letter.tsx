"use client";

import { FileText, Download, CheckCircle, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ClaimLetter() {
  const letterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!letterRef.current) return;

    try {
      setIsGenerating(true);
      
      // Wait a tick to ensure any state updates render
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(letterRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("BumpWin-Claim-Letter.pdf");

    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div ref={letterRef} className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl max-w-full overflow-hidden relative">
        {/* Watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-100 text-6xl font-black opacity-50 -rotate-12 select-none pointer-events-none whitespace-nowrap z-0">
          CLAIM UNLOCKED
        </div>

        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start relative z-10">
          <div>
            <h2 className="font-display font-bold text-2xl uppercase">Demand Letter</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Pursuant to 14 CFR Part 250</p>
          </div>
          <div className="text-right text-xs font-mono">
            <p>DATE: {new Date().toLocaleDateString()}</p>
            <p>REF: BW-{Math.floor(Math.random() * 10000)}</p>
          </div>
        </div>

        <div className="space-y-4 font-serif text-sm leading-relaxed relative z-10">
          <p>
            <strong>To: United Airlines Legal Department</strong><br />
            Re: Compensation Claim for Flight UA 249
          </p>
          <p>
            To Whom It May Concern,
          </p>
          <p>
            I am writing to formally claim compensation under US Department of Transportation regulations regarding my confirmed reservation on flight UA 249, which was significantly delayed/cancelled on {new Date().toLocaleDateString()}.
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

