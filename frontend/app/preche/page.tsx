"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PrecheRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sermons/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-gray-600" style={{ fontFamily: "var(--font-body)" }}>
        Redirection vers les prêches...
      </p>
    </div>
  );
}