"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plane, Bell, CheckCircle, Loader2, ArrowRight } from "lucide-react";

const POPUP_STORAGE_KEY = "bumpwin_exit_popup_shown";
const POPUP_COOLDOWN_DAYS = 7;
const MOBILE_DELAY_MS = 30000; // 30 seconds on mobile

interface ExitPopupProps {
  excludePaths?: string[];
}

export default function ExitPopup({ excludePaths = ["/dashboard", "/login", "/flight"] }: ExitPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Check if we should show the popup
  const shouldShowPopup = useCallback(() => {
    if (typeof window === "undefined") return false;
    
    // Check if on excluded path
    const currentPath = window.location.pathname;
    if (excludePaths.some(path => currentPath.startsWith(path))) {
      return false;
    }

    // Check localStorage for cooldown
    const lastShown = localStorage.getItem(POPUP_STORAGE_KEY);
    if (lastShown) {
      const lastShownDate = new Date(lastShown);
      const daysSinceShown = (Date.now() - lastShownDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceShown < POPUP_COOLDOWN_DAYS) {
        return false;
      }
    }

    return true;
  }, [excludePaths]);

  // Mark popup as shown
  const markAsShown = useCallback(() => {
    localStorage.setItem(POPUP_STORAGE_KEY, new Date().toISOString());
  }, []);

  // Show popup
  const showPopup = useCallback(() => {
    if (shouldShowPopup()) {
      setIsVisible(true);
      markAsShown();
    }
  }, [shouldShowPopup, markAsShown]);

  // Close popup
  const closePopup = () => {
    setIsVisible(false);
  };

  // Handle form submit
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
          tag: "exit-popup",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      setStatus("success");
      
      // Auto-close after success
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch (error) {
      console.error("Subscribe error:", error);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      // Mobile: Show after delay
      const timer = setTimeout(() => {
        showPopup();
      }, MOBILE_DELAY_MS);

      return () => clearTimeout(timer);
    } else {
      // Desktop: Exit intent detection
      const handleMouseLeave = (e: MouseEvent) => {
        // Only trigger when mouse leaves through top of viewport
        if (e.clientY <= 0) {
          showPopup();
        }
      };

      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [showPopup]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={closePopup}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header with gradient */}
              <div className="bg-gradient-to-br from-lime-400/20 to-emerald-500/10 p-6 pb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-lime-400 rounded-xl flex items-center justify-center">
                    <Plane className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white font-display">Wait! Don't Leave Empty-Handed</h2>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">
                  Airlines owe US travelers <span className="text-lime-400 font-bold">$1.5 billion</span> in unclaimed compensation. 
                  Get alerts when your flights qualify.
                </p>
              </div>

              {/* Form Content */}
              <div className="p-6 -mt-4">
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-4"
                  >
                    <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-slate-900" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">You're In!</h3>
                    <p className="text-slate-400 text-sm">
                      Check your inbox for a confirmation email. We'll alert you when your flights qualify for compensation.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                        <Bell className="w-5 h-5 text-lime-400" />
                        <span className="text-white font-medium">Get Free Alerts</span>
                      </div>
                      <ul className="text-sm text-slate-400 space-y-1.5">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-400 flex-shrink-0" />
                          <span>Flight delay & cancellation alerts</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-400 flex-shrink-0" />
                          <span>Know your compensation rights</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-lime-400 flex-shrink-0" />
                          <span>Step-by-step claim templates</span>
                        </li>
                      </ul>
                    </div>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none transition-colors"
                    />

                    {status === "error" && (
                      <p className="text-red-400 text-sm">{errorMessage}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-slate-900 font-bold px-6 py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Get Free Alerts
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-slate-500 text-center">
                      No spam, ever. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


