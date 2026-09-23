"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Evangelist() {
  const t = useTranslations("about");

  return (
    <section className="bg-white py-20" aria-label="Présentation de l’évangéliste">
      <style>{`
        @keyframes riseIn {
          0% { opacity: 0; transform: translateY(22px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-"] { animation: none !important; transform: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-y-16 gap-x-12 lg:grid-cols-2 lg:gap-x-16">
          <div className="riseIn animate-[riseIn_0.7s_ease-out_0.1s_both] flex justify-center">
            <div className="relative inline-block">
               {/* Portrait */}
               <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-[28px] ring-2 ring-[#D4AF37]/30 shadow-[0_12px_32px_rgba(0,0,0,0.10),_inset_0_1px_2px_rgba(255,255,255,0.45)] transition-transform duration-300 hover:scale-[1.015]">
                 <img
                   src="/ahonga-komlavi.jpg"
                   alt="Évangéliste Ahongan Komlavi"
                   className="h-full w-full object-cover"
                   loading="lazy"
                   decoding="async"
                 />
               </div>

              {/* Experience badge */}
              <div className="absolute -bottom-7 -right-8 origin-bottom-right bg-primary-solid text-white rounded-2xl px-5 py-3 shadow-[0_8px_22px_rgba(0,0,0,0.14),_inset_0_1px_1px_rgba(255,255,255,0.35)] ring-1 ring-white/60">
                <p className="text-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  +15 ans
                </p>
                <p className="text-xs text-primary-100">de ministère</p>
              </div>
            </div>
          </div>

          <div className="riseIn animate-[riseIn_0.7s_ease-out_0.25s_both]">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
              Évangéliste <span className="text-primary-700">Ahongan Komlavi</span>
            </h2>
            <div className="mt-3 h-1 w-16 rounded-full bg-primary-solid" />

            <p className="mt-5 text-base font-semibold text-slate-700">
              <strong>{t("lead")}</strong>
            </p>

            {/* Short teaser only — the full bio (p2, p3) lives on /about,
                where it isn't competing with a compact portrait for height. */}
            <div className="mt-6 space-y-6 text-slate-600">
              <p className="text-base/loose">{t("p1")}</p>
            </div>

            <Link
              href="/about"
              className="mt-10 inline-flex items-center justify-center rounded-full border-2 border-primary-solid px-8 py-3 text-sm font-medium text-primary-700 transition-all duration-200 hover:scale-[1.03] hover:bg-primary-solid hover:text-white"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}