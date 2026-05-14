import { useEffect } from "react";
import { SITE } from "./siteConfig";

/** Privacy-friendly analytics: set REACT_APP_PLAUSIBLE_DOMAIN in env. */
export function AnalyticsInit() {
  useEffect(() => {
    if (!SITE.plausibleDomain) return;
    const s = document.createElement("script");
    s.defer = true;
    s.dataset.domain = SITE.plausibleDomain;
    s.src = "https://plausible.io/js/script.js";
    document.head.appendChild(s);
    return () => {
      try {
        document.head.removeChild(s);
      } catch {
        /* ignore */
      }
    };
  }, []);
  return null;
}
