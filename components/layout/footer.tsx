"use client";

import Link from "next/link";
import { demoUnlockAllClaims } from "@/app/actions";
import { Unlock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
          {/* Logo */}
          <Link href="/" className="font-display font-bold text-xl text-lime-400 hover:opacity-80 transition-opacity">
            BUMPWIN
          </Link>
          
          {/* Legal Links */}
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
            <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/rules" className="text-slate-400 hover:text-white transition-colors">
              Know Your Rights
            </Link>
          </nav>
        </div>
        
        {/* Disclaimer */}
        <div className="text-center text-[10px] sm:text-xs text-slate-600 leading-relaxed max-w-3xl mx-auto mb-4">
          <p>
            BumpWin provides informational tools and template documents only. We are not a law firm and do not provide legal advice. 
            No attorney-client relationship is created by using this service. Results are not guaranteed. 
            Consult a qualified attorney for advice specific to your situation.
          </p>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-xs text-slate-600 mb-4">
          <p>© {currentYear} BumpWin. All rights reserved.</p>
        </div>

        {/* Demo Unlock Button - FOR TESTING ONLY */}
        <div className="border-t border-slate-800 pt-4 mt-4">
          <form action={demoUnlockAllClaims} className="flex justify-center">
            <button 
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors"
            >
              <Unlock className="w-3 h-3" />
              <span>DEMO: Unlock All Claims (No Payment)</span>
            </button>
          </form>
          <p className="text-center text-[10px] text-amber-600/60 mt-2">
            ⚠️ Development only - Remove before production
          </p>
        </div>
      </div>
    </footer>
  );
}
