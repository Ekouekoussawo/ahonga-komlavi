"use client";

import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail } from "lucide-react";
import ContactPageForm from "@/components/ContactPageForm";

export default function ContactPage() {
  const t = useTranslations("contact");
  return (
    <div className="bg-[#faf9f6] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-8 sm:p-10 border border-[rgba(212,175,55,0.2)] shadow-sm">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8" style={{ fontFamily: "var(--font-heading)" }}>
            {t("title")}
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            <div className="space-y-6">
              <div className="flex gap-5 group">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary-solid flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-xs uppercase tracking-wider text-gray-600" style={{ fontFamily: "var(--font-body)" }}>{t("address")}</h4>
                  <p className="text-gray-800 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    Centre de prière ESPRIT ET VIE, Djagblé-Abolavé — Quartier des Vainqueurs
                  </p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary-solid flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-xs uppercase tracking-wider text-gray-600" style={{ fontFamily: "var(--font-body)" }}>{t("phone")}</h4>
                  <p className="text-gray-800 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    <a href="tel:+22890877855" className="block hover:text-primary-700">+228 90 87 78 55</a>
                    <a href="tel:+22899697848" className="block hover:text-primary-700">+228 99 69 78 48</a>
                  </p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary-solid flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-xs uppercase tracking-wider text-gray-600" style={{ fontFamily: "var(--font-body)" }}>{t("email")}</h4>
                  <p className="text-gray-800 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    <a href="mailto:priere@evangelisteahongakomlavi.com" className="hover:text-primary-700">priere@evangelisteahongakomlavi.com</a>
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-[#f9f7f2] p-8 border border-[rgba(212,175,55,0.25)]">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>{t("formTitle")}</h2>
              <ContactPageForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
