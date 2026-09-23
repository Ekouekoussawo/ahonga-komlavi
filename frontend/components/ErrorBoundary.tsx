"use client";

import { Metadata } from "next";

type ErrorProps = {
  error?: Error & { digest?: string };
  reset?: () => void;
};

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
        Une erreur est survenue
      </h2>
      <p className="mt-3 max-w-md text-gray-600" style={{ fontFamily: "var(--font-body)" }}>
        Nous n&apos;avons pas pu charger cette section. Vous pouvez réessayer ou revenir à l&apos;accueil.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
           className="rounded-full bg-primary-700 px-6 py-3 font-bold text-white shadow-md transition hover:bg-primary-800 hover:shadow-lg"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
