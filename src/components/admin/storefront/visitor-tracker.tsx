"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logPageView } from "@/actions/analytics";

function VisitorTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const fullPath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    logPageView({
      path: pathname,
      fullPath,
      referrerUrl: document.referrer || null,
      userAgent: navigator.userAgent,
      isPWAInstalled:
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true,
    }).catch((error) => {
      console.error("logPageView failed", error);
    });
  }, [pathname, searchParams]);

  return null;
}

// Wrap the inner component in a Suspense boundary
export function VisitorTracker() {
  return (
    <Suspense fallback={null}>
      <VisitorTrackerInner />
    </Suspense>
  );
}