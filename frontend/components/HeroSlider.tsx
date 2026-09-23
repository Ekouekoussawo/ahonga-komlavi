"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { HeroImage } from "@/components/ResponsiveImage";

export default function HeroSlider() {
  const t = useTranslations("hero");
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/gallery/photo-13.jpg",
      subtitle: t("subtitle"),
      title: t("title"),
      description: "Un serviteur appelé à conduire les âmes dans la présence de Dieu",
      cta: t("cta"),
      href: "/about",
    },
    {
      id: 2,
      image: "/gallery/1062.jpg",
      subtitle: "Notre Vision",
      title: "Notre Vision",
      description: "Apporter l’espérance, la foi et la transformation par l’Évangile",
      cta: "Découvrir",
      href: "/#vision",
    },
    {
      id: 3,
      image: "/gallery/1218.jpg",
      subtitle: "Rejoignez-nous",
      title: "Rejoignez-nous",
      description: "Participez à nos programmes et vivez une expérience de foi authentique",
      cta: "Programme",
      href: "/#programme",
    },
  ];

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      7000
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const goTo = (i: number) => setCurrent(i);
  const slide = slides[current];

  return (
    <section
      className="relative flex h-[85vh] min-h-[520px] items-center justify-center overflow-hidden"
      aria-label="Bannière principale"
    >
      <style>{`
        @keyframes heroImgIn {
          0% { opacity: 0; transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes heroSlideIn {
          0% { opacity: 0; transform: translateY(22px) scale(0.975); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-"] { animation: none !important; transform: none !important; }
        }
      `}</style>

      {/* Render only the active slide: fewer LCP bytes + enables entrance replay */}
      <div key={slide.id} className="absolute inset-0 animate-[heroImgIn_0.6s_ease-out_both]">
        <HeroImage
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover [filter:saturate(1.35)_contrast(1.05)]"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="pointer-events-none absolute inset-0 bg-radial from-transparent to-black/30" />
      </div>

      {/* Content — keyed per slide to replay staggered entrance */}
      <div key={`content-${slide.id}`} className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-16 text-center text-white sm:px-6">
        <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/90 backdrop-blur">
          {slide.subtitle}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl animate-[heroSlideIn_0.6s_ease-out_0.2s_both]" style={{ fontFamily: "var(--font-heading)" }}>
          {slide.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base text-white/90 sm:text-lg animate-[heroSlideIn_0.6s_ease-out_0.3s_both]">
          {slide.description}
        </p>
        <Link
          href={slide.href}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-medium text-gray-900 shadow-md transition-all duration-200 hover:bg-[#b8962e] hover:scale-[1.03] animate-[heroSlideIn_0.6s_ease-out_0.4s_both]"
        >
          {slide.cta}
        </Link>
      </div>

      {/* Navigation arrows — 48px touch targets */}
      <button onClick={prev} aria-label="Diapositive précédente" className="absolute left-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border-2 border-white/70 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:border-white md:left-6">
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button>
      <button onClick={next} aria-label="Diapositive suivante" className="absolute right-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border-2 border-white/70 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:border-white md:right-6">
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Progress indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Aller à la diapositive ${i + 1}`}
            aria-current={i === current ? "true" : undefined}
            onClick={() => goTo(i)}
            className={[
              "h-2 rounded-full transition-all duration-300 ease-out",
              i === current ? "w-8 bg-[#D4AF37] ring-2 ring-white/60" : "w-2 bg-white/40 hover:bg-white/60",
            ].join(" ")}
          />
        ))}
      </div>
    </section>
  );
}
