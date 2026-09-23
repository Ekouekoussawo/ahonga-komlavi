"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/gallery/photo-8.jpg",
  "/gallery/1.jpg",
  "/gallery/photo-11.jpg",
  "/gallery/2.jpg",
  "/gallery/photo-13.jpg",
  "/gallery/1062.jpg",
  "/gallery/photo-9.jpg",
  "/gallery/1186.jpg",
];

const VISIBLE = 3;

export default function GalleryCarousel() {
  const [start, setStart] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStart((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const visibleImages = Array.from({ length: VISIBLE }, (_, i) => images[(start + i) % images.length]);

  const prev = () => setStart((s) => (s - 1 + images.length) % images.length);
  const next = () => setStart((s) => (s + 1) % images.length);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block rounded-full bg-[rgba(212,175,55,0.15)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#8a6d1b] mb-4" style={{ fontFamily: "var(--font-body)" }}>
            Galerie
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Moments du ministère
          </h2>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {visibleImages.map((src, i) => (
              <div key={`${src}-${i}`} className="aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
                <img
                  src={src}
                  alt="Évangéliste Ahongan Komlavi en ministère"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <button
            onClick={prev}
            aria-label="Image précédente"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50"
          >
            <ChevronLeft className="h-5 w-5 text-slate-700" />
          </button>
          <button
            onClick={next}
            aria-label="Image suivante"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50"
          >
            <ChevronRight className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/galerie"
            className="inline-flex items-center gap-2 rounded-full bg-primary-700 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-primary-800 hover:shadow-xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Voir toute la galerie
          </Link>
        </div>
      </div>
    </section>
  );
}
