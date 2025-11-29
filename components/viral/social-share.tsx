"use client";

import { Twitter, Send, Share2 } from "lucide-react";

interface SocialShareProps {
  airline: string;
  claimType?: "BUMPING" | "DELAY" | "CANCELLATION";
}

export default function SocialShare({ 
  airline, 
  claimType = "DELAY" 
}: SocialShareProps) {
  
  // Different messages based on claim type - honest about what happened
  const getShareContent = () => {
    if (claimType === "BUMPING") {
      return {
        tweetText: `✈️ Got bumped from my ${airline} flight? I'm claiming the compensation I'm legally owed under DOT rules (up to $1,550)!

Know your rights 👉`,
        whatsappText: `Hey! I got bumped from my ${airline} flight and found out airlines have to pay you cash compensation by law (up to $1,550 for long delays). 

I'm using BumpWin to file my claim - you should check if any of your flights qualify too:`,
        buttonText: "Share My Claim",
      };
    }
    
    if (claimType === "CANCELLATION") {
      return {
        tweetText: `✈️ My ${airline} flight got cancelled. Filing for a refund + requesting goodwill compensation.

Did you know your rights? Check yours 👉`,
        whatsappText: `My ${airline} flight got cancelled! I'm filing for my refund and requesting compensation for the hassle.

Found this tool that helps you know your rights and file claims - might be useful if you've had flight issues:`,
        buttonText: "Share Experience",
      };
    }
    
    // DELAY (default)
    return {
      tweetText: `✈️ My ${airline} flight was massively delayed. Filing a complaint and requesting compensation for expenses.

Know your passenger rights 👉`,
      whatsappText: `Hey! Had a terrible delay on ${airline}. Found out you can file complaints and request compensation for expenses/inconvenience.

This tool helps you understand your rights and file claims:`,
      buttonText: "Share Experience",
    };
  };

  const content = getShareContent();
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.tweetText)}&url=${encodeURIComponent("https://bumpwin.com")}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(content.whatsappText + " https://bumpwin.com")}`;

  return (
    <div className="space-y-3">
      <p className="text-center text-xs text-slate-500">
        {claimType === "BUMPING" 
          ? "Help others know their rights when airlines overbook"
          : "Share your experience and help others know their rights"}
      </p>
      
      <div className="flex gap-3 justify-center">
        <a 
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#1DA1F2] text-white px-5 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <Twitter className="w-4 h-4" />
          Share on X
        </a>
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <Send className="w-4 h-4" />
          WhatsApp
        </a>
      </div>
      
      <p className="text-center text-[10px] text-slate-600 max-w-xs mx-auto">
        {claimType === "BUMPING" 
          ? "Involuntary bumping has mandatory cash compensation under US law"
          : "Note: US law doesn't require cash for delays/cancellations, but you can still file complaints and request goodwill compensation"}
      </p>
    </div>
  );
}
