"use client";

import { useTranslations } from "next-intl";

export default function MinistryPage() {
  const t = useTranslations("ministry");
  return (
    <div className="bg-white">
      <section className="relative py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/gallery/photo-9.jpg)" }}
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
                Vision <span className="text-primary-700">et mission</span>
              </h2>
              <div className="space-y-4 text-gray-700" style={{ fontFamily: "var(--font-body)" }}>
                <p>{t("visionP1")}</p>
                <p>{t("visionP2")}</p>
                <p>{t("visionP3")}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#f9f7f2] p-8 border border-[rgba(212,175,55,0.25)]">
              <h3 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "var(--font-heading)" }}>
                {t("valuesTitle")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white p-4 border border-[rgba(212,175,55,0.25)]">
                  <h4 className="font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>{t("prayer")}</h4>
                  <p className="text-sm text-gray-600">{t("prayerDesc")}</p>
                </div>
                <div className="rounded-xl bg-white p-4 border border-[rgba(212,175,55,0.25)]">
                  <h4 className="font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>{t("word")}</h4>
                  <p className="text-sm text-gray-600">{t("wordDesc")}</p>
                </div>
                <div className="rounded-xl bg-white p-4 border border-[rgba(212,175,55,0.25)]">
                  <h4 className="font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>{t("love")}</h4>
                  <p className="text-sm text-gray-600">{t("loveDesc")}</p>
                </div>
                <div className="rounded-xl bg-white p-4 border border-[rgba(212,175,55,0.25)]">
                  <h4 className="font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>{t("service")}</h4>
                  <p className="text-sm text-gray-600">{t("serviceDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
