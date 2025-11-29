"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { clsx } from "clsx";

type EmailCaptureVariant = "inline" | "card" | "minimal";

interface EmailCaptureProps {
  variant?: EmailCaptureVariant;
  tag?: string;
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  successMessage?: string;
  className?: string;
  showFirstName?: boolean;
}

export default function EmailCapture({
  variant = "inline",
  tag = "website",
  headline = "Get Flight Compensation Alerts",
  subheadline = "Join thousands of travelers who never miss out on money they're owed.",
  buttonText = "Get Alerts",
  successMessage = "You're in! Check your inbox for a confirmation.",
  className = "",
  showFirstName = false,
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/convertkit/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          tag,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      setStatus("success");
      setEmail("");
      setFirstName("");
    } catch (error) {
      console.error("Subscribe error:", error);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  // Success State
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={clsx(
          "flex items-center gap-3 p-4 rounded-xl bg-lime-400/10 border border-lime-400/30",
          className
        )}
      >
        <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-slate-900" />
        </div>
        <div>
          <p className="font-bold text-lime-400">You're subscribed!</p>
          <p className="text-sm text-slate-400">{successMessage}</p>
        </div>
      </motion.div>
    );
  }

  // Inline Variant (horizontal, for hero sections)
  if (variant === "inline") {
    return (
      <div className={clsx("w-full", className)}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-slate-900 font-bold px-6 py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {buttonText}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
        <AnimatePresence>
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-400 text-sm mt-2"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Card Variant (boxed, for page sections)
  if (variant === "card") {
    return (
      <div
        className={clsx(
          "bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-2xl p-6 sm:p-8",
          className
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-lime-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">{headline}</h3>
            <p className="text-sm text-slate-400">{subheadline}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {showFirstName && (
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name (optional)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none transition-colors"
            />
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-slate-900 font-bold px-6 py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {buttonText}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <AnimatePresence>
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-400 text-sm mt-3"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="text-xs text-slate-500 mt-4 text-center">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Minimal Variant (compact, for tight spaces)
  if (variant === "minimal") {
    return (
      <div className={clsx("w-full", className)}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-lime-400 hover:bg-lime-300 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
        <AnimatePresence>
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-400 text-xs mt-1"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return null;
}

