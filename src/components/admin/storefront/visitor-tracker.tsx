"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logPageView } from "@/actions/analytics";

export function VisitorTracker() {
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
    });
  }, [pathname, searchParams]);

  return null;
}