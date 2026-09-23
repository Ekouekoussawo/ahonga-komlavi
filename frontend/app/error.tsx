"use client";

export default function GlobalError({ error, reset }: { error?: Error & { digest?: string }; reset?: () => void }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
          Une erreur critique est survenue
        </h2>
        <p className="mt-3 max-w-md text-gray-600" style={{ fontFamily: "var(--font-body)" }}>
          Nous rencontrons un problème technique. Vous pouvez réessayer ou revenir à l&apos;accueil.
        </p>
        {reset && (
          <button
            onClick={reset}
             className="mt-8 rounded-full bg-primary-700 px-6 py-3 font-bold text-white shadow-md transition hover:bg-primary-800 hover:shadow-lg"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Réessayer
          </button>
        )}
      </body>
    </html>
  );
}
