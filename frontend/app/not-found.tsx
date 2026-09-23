import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-primary-readable mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          Page introuvable
        </h2>
        <p className="text-gray-600 mb-8" style={{ fontFamily: "var(--font-body)" }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b8962e]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
