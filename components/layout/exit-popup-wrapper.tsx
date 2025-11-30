"use client";

import { usePathname } from "next/navigation";
import ExitPopup from "@/components/marketing/exit-popup";

export default function ExitPopupWrapper() {
  const pathname = usePathname();
  
  // Only show on marketing pages, not on dashboard/login/flight pages
  const excludedPaths = ["/dashboard", "/login", "/flight"];
  const shouldShow = !excludedPaths.some(path => pathname.startsWith(path));
  
  if (!shouldShow) return null;
  
  return <ExitPopup excludePaths={excludedPaths} />;
}


