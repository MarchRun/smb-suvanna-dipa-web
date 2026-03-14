/**
 * Page Tracker Component
 * Tracks page views for public pages
 * Include this component in public layout
 */

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/actions/analytics/tracking";

// Map paths to page names
const pageNames: Record<string, string> = {
  "/": "Beranda",
  "/about": "Tentang",
  "/activities": "Aktivitas",
  "/contact": "Kontak",
};

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public pages
    const publicPaths = ["/", "/about", "/activities", "/contact"];
    if (!publicPaths.includes(pathname)) return;

    // Generate a simple visitor ID (for session tracking)
    let visitorId = sessionStorage.getItem("visitor_id");
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("visitor_id", visitorId);
    }

    // Track the page view
    trackPageView({
      page_path: pathname,
      page_name: pageNames[pathname] || pathname,
      visitor_id: visitorId,
      user_agent: navigator.userAgent,
      referrer: document.referrer || undefined,
    });
  }, [pathname]);

  // This component doesn't render anything
  return null;
}
