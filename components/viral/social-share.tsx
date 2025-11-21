"use client";

import { Twitter, Send } from "lucide-react";

export default function SocialShare({ airline, amount = 600 }: { airline: string, amount?: number }) {
  const shareText = `I just beat ${airline} and got $${amount} compensation with BumpWin. 
  
Check if your flight owes you money: `;
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent("https://bumpwin.com")}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " https://bumpwin.com")}`;

  return (
    <div className="flex gap-3 justify-center pt-4">
      <a 
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[#1DA1F2] text-white px-5 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
      >
        <Twitter className="w-4 h-4" />
        Tweet Victory
      </a>
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
      >
        <Send className="w-4 h-4" />
        Tell Friends
      </a>
    </div>
  );
}

