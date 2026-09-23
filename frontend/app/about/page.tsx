"use client";

import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail } from "lucide-react";
import PrayerRequestForm from "@/components/PrayerRequestForm";
import JsonLd from "@/components/JsonLd";
import { organizationJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ahongan Komlavi",
  title: "Évangéliste",
  description: "Serviteur de Dieu animé par le désir de voir les vies transformées par la puissance de Jésus-Christ. Responsable du Centre de prière ESPRIT ET VIE à Lomé, Togo.",
  url: "https://evangelisteahongankomlavi.com/about/",
  image: "https://evangelisteahongankomlavi.com/ahonga-komlavi.jpg",
  sameAs: [
    "https://www.youtube.com/@Evang%C3%A9listeahongankomlavi",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Centre de prière ESPRIT ET VIE",
    url: "https://evangelisteahongankomlavi.com",
  },
  knowsAbout: [
    "Évangélisation",
    "Enseignement biblique",
    "Prière et intercession",
    "Conseil spirituel",
    "Ministère pastoral",
  ],
};

const breadcrumbs = [
  { name: "Accueil", url: "https://evangelisteahongankomlavi.com/" },
  { name: "À propos", url: "https://evangelisteahongankomlavi.com/about/" },
];

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="bg-white">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={personJsonLd} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <section className="relative py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/gallery/1186.jpg)" }}
        />
        <div className="absolute inset-0 bg-secondary-900/50" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.2] pb-1 mb-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]" style={{ fontFamily: "var(--font-heading)" }}>
            {t("title")}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]" style={{ fontFamily: "var(--font-body)" }}>
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Évangéliste <span className="text-primary-700">Ahongan Komlavi</span>
              </h2>
              <div className="space-y-4 text-gray-700" style={{ fontFamily: "var(--font-body)" }}>
                <p>
                  <strong>{t("lead")}</strong>
                </p>
                <p>{t("p1")}</p>
                <p>{t("p2")}</p>
                <p>{t("p3")}</p>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl ring-2 ring-[#D4AF37]/30 shadow-[0_12px_32px_rgba(0,0,0,0.12)] max-w-md">
                <img
                  src="/ahonga-komlavi.jpg"
                  alt="Évangéliste Ahongan Komlavi"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div id="contact" className="scroll-mt-24 rounded-2xl bg-[#f9f7f2] p-8 border border-[rgba(212,175,55,0.25)]">
              <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "var(--font-heading)" }}>{t("contactTitle")}</h2>
              <div className="space-y-5 mb-8">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-solid flex items-center justify-center text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>{t("address")}</h4>
                    <p className="text-gray-700 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                      Centre de prière ESPRIT ET VIE<br />Djagblé-Abolavé — Quartier des Vainqueurs
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-solid flex items-center justify-center text-white">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>{t("phone")}</h4>
                    <p className="text-sm" style={{ fontFamily: "var(--font-body)" }}>
                      <a href="tel:+22890877855" className="hover:text-primary-700">+228 90 87 78 55</a><br />
                      <a href="tel:+22899697848" className="hover:text-primary-700">+228 99 69 78 48</a>
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-solid flex items-center justify-center text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>{t("email")}</h4>
                    <p className="text-sm" style={{ fontFamily: "var(--font-body)" }}>
                      <a href="mailto:priere@evangelisteahongakomlavi.com" className="hover:text-primary-700">priere@evangelisteahongakomlavi.com</a>
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Envoyez-nous un message</h3>
              <PrayerRequestForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
