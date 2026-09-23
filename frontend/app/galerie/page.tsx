"use client";

import { useState } from "react";

const galleryImages = [
  { src: "/gallery/1.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/2.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/3.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/4.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/5.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/1062.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/1066.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/1186.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/1218.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/photo-6.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/photo-7.png", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/photo-8.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/photo-9.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/photo-10.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/photo-11.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/photo-12.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/photo-13.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/photo-14.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/photo-15.png", alt: "Évangéliste Ahongan Komlavi en ministère" },
  { src: "/gallery/photo-16.jpg", alt: "Évangéliste Ahongan Komlavi en ministère" },
];

export default function GaleriePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function showPrev() {
    setOpenIndex((i) => (i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length));
  }
  function showNext() {
    setOpenIndex((i) => (i === null ? null : (i + 1) % galleryImages.length));
  }

  return (
    <div className="bg-white">
      <section className="relative py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/gallery/1062.jpg)" }}
        />
        <div className="absolute inset-0 bg-secondary-900/50" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.2] pb-1 mb-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]" style={{ fontFamily: "var(--font-heading)" }}>
            Galerie
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]" style={{ fontFamily: "var(--font-body)" }}>
            Découvrez les moments forts de notre ministère à travers ces images.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setOpenIndex(index)}
                className="galerie-item rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left cursor-zoom-in"
                aria-label="Agrandir l'image"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white text-4xl leading-none"
            aria-label="Fermer"
          >
            &times;
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-2 sm:left-6 text-white/80 hover:text-white text-4xl sm:text-5xl leading-none px-2"
            aria-label="Image précédente"
          >
            &#8249;
          </button>
          <img
            src={galleryImages[openIndex].src}
            alt={galleryImages[openIndex].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain rounded-lg shadow-2xl"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-2 sm:right-6 text-white/80 hover:text-white text-4xl sm:text-5xl leading-none px-2"
            aria-label="Image suivante"
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
}
