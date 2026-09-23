"use client";

import { useEffect } from "react";

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "ahonga-komlavi.com";

export default function Analytics() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const script = document.createElement("script");
    script.setAttribute("defer", "");
    script.setAttribute("data-domain", PLAUSIBLE_DOMAIN);
    script.src = "https://plausible.io/js/script.js";

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
