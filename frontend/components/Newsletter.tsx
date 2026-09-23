"use client";

import { useState } from "react";

export default function Newsletter() {
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Merci pour votre inscription !");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section className="relative bg-primary-solid py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              Restez connecté
            </h3>
            <p className="text-primary-100 max-w-md text-sm sm:text-base" style={{ fontFamily: "var(--font-body)" }}>
              Recevez nos actualités, événements et inspirations par email.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row w-full md:w-auto gap-3" onSubmit={onSubmit}>
            <input
              type="email"
              placeholder="Votre email"
              required
               className="w-full sm:w-80 rounded-full border border-gray-900/10 bg-white/90 backdrop-blur px-6 py-3.5 text-sm text-gray-900 outline-none transition-all duration-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/30 placeholder:text-gray-500"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <button
              type="submit"
              className="rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-bold text-primary-300 shadow-lg shadow-[rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-[#2a2a2a] hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0"
              style={{ fontFamily: "var(--font-body)" }}
            >
              S’inscrire
            </button>
          </form>
        </div>
        {status && <p className="mt-6 text-center md:text-left text-sm font-semibold text-white">{status}</p>}
      </div>
    </section>
  );
}
