import Link from "next/link";
import { ArrowRight, Plane, AlertTriangle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:py-24 overflow-hidden text-center bg-slate-900">
      {/* Background Gradient Blob */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-lime-400/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 text-xs sm:text-sm font-medium border rounded-full border-lime-400/30 text-lime-400 bg-lime-400/10">
          <Plane className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Know Your Rights. Get What You're Owed.
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white font-display">
          FLIGHT <span className="text-slate-500 line-through">NIGHTMARE</span>?
          <br />
          <span className="text-lime-400">FIGHT BACK</span>.
        </h1>

        {/* Subheadline - More accurate */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-slate-400 px-2">
          Got bumped, delayed, or canceled? <br className="hidden md:block" />
          You may be owed <span className="text-white font-bold">up to $1,550</span> in compensation.
        </p>

        {/* Clarification note */}
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          US law guarantees cash for involuntary bumping. EU law covers delays & cancellations too.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 sm:gap-4 pt-4 sm:pt-6 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-slate-900 transition-transform bg-lime-400 rounded-full hover:scale-105 hover:bg-lime-300 active:scale-95"
          >
            Check My Eligibility
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Link>
          
          <Link
            href="/rules"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white transition-colors border border-slate-700 rounded-full hover:bg-slate-800"
          >
            View Rules & Rights
          </Link>
        </div>
        
        {/* Trust badges */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full" />
            US: 14 CFR Part 250 (Bumping)
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            EU: EC 261/2004 (Delays + More)
          </span>
        </div>
      </div>
    </section>
  );
}
