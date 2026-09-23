"use client";

import { useEffect, useRef } from "react";

const counters = [
  { value: 15, label: "Années de ministère" },
  { value: 1000, label: "Vies transformées" },
  { value: 50, label: "Programmes de prière" },
  { value: 200, label: "Communautés touchées" },
];

export default function Counters() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.animated === "true") return;
    el.dataset.animated = "true";

    const nodes = el.querySelectorAll<HTMLSpanElement>("[data-count]");
    nodes.forEach((node) => {
      const target = Number(node.getAttribute("data-count"));
      const duration = 1800;
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        node.textContent = Math.floor(progress * target).toLocaleString("fr-FR");
        if (progress < 1) requestAnimationFrame(step);
        else node.textContent = target.toLocaleString("fr-FR");
      };
      requestAnimationFrame(step);
    });
  }, []);

  return (
    <section className="relative bg-[#1a1a1a] text-white py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_center,_#D4AF37_0%,_transparent_70%)]" />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {counters.map((counter) => (
          <div
            key={counter.label}
            className="rounded-2xl bg-white/[0.07] border border-primary-800/40 p-8 sm:p-10 transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.12] hover:border-primary-500/60 hover:shadow-primary-500/10"
          >
            <div className="text-5xl sm:text-6xl font-bold text-primary-300 mb-3" data-count={counter.value} style={{ fontFamily: "var(--font-heading)" }}>
              0
            </div>
            <div className="text-gray-300 text-sm font-medium tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
              {counter.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
