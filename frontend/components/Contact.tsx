"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail } from "lucide-react";

const contactInfo = [
  { icon: MapPin, href: "#" },
  { icon: Phone, href: "tel:+22890877855" },
  { icon: Mail, href: "mailto:priere@evangelisteahongakomlavi.com" },
];

export default function Contact() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      phone: (formData.get("phone") as string) || undefined,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Request failed");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  return (
    <section className="relative bg-[#faf9f6] py-24" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <div className="rounded-2xl bg-white p-8 sm:p-10 border border-[rgba(212,175,55,0.2)] shadow-sm transition hover:shadow-md hover:border-[rgba(212,175,55,0.45)] duration-300">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              {t("title")}
            </h2>
            <div className="space-y-6">
              {contactInfo.map((item, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary-solid flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {<item.icon className="h-6 w-6 text-white" />}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-xs uppercase tracking-wider text-gray-600" style={{ fontFamily: "var(--font-body)" }}>
                      {idx === 0 ? t("address") : idx === 1 ? t("phone") : t("email")}
                    </h4>
                    <p className="text-gray-800 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                      {idx === 0 ? (
                        "Centre de prière ESPRIT ET VIE, Djagblé-Abolavé — Quartier des Vainqueurs"
                      ) : idx === 1 ? (
                        <>
                          <a href={item.href} className="block hover:text-primary-700 transition-colors">+228 90 87 78 55</a>
                          <a href="tel:+22899697848" className="block hover:text-primary-700 transition-colors">+228 99 69 78 48</a>
                        </>
                      ) : (
                        <a href={item.href} className="hover:text-primary-700 transition-colors">priere@evangelisteahongakomlavi.com</a>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form className="rounded-2xl bg-white p-8 sm:p-10 border border-[rgba(212,175,55,0.25)] shadow-sm hover:shadow-md transition-shadow duration-300" onSubmit={onSubmit}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              {t("formTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="block" htmlFor="contact-name">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 block" style={{ fontFamily: "var(--font-body)" }}>
                  {t("name")}
                </span>
                <input
                  id="contact-name"
                  name="name"
                  className="w-full rounded-xl border border-[rgba(212,175,55,0.4)] bg-gray-50/50 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                  style={{ fontFamily: "var(--font-body)" }}
                  required
                />
              </label>
              <label className="block" htmlFor="contact-email">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 block" style={{ fontFamily: "var(--font-body)" }}>
                  {t("emailField")}
                </span>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className="w-full rounded-xl border border-[rgba(212,175,55,0.4)] bg-gray-50/50 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                  style={{ fontFamily: "var(--font-body)" }}
                  required
                />
              </label>
            </div>

            <label className="block mt-5" htmlFor="contact-subject">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 block" style={{ fontFamily: "var(--font-body)" }}>
                {t("subject")}
              </span>
                <select
                  id="contact-subject"
                  name="subject"
                  className="mt-1 w-full rounded-xl border border-[rgba(212,175,55,0.4)] bg-gray-50/50 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 appearance-none"
                  style={{ fontFamily: "var(--font-body)" }}
                  required
                >
                  <option value="">{t("selectPlaceholder")}</option>
                  <option>Guérison et santé</option>
                  <option>Famille et mariage</option>
                  <option>Finances et provision</option>
                  <option>Travail et orientation</option>
                  <option>Délivrance et libération</option>
                  <option>Intercession pour un proche</option>
                  <option>Réconciliation</option>
                  <option>Action de grâce</option>
                  <option>Autre intention</option>
                </select>
            </label>

            <label className="block mt-5" htmlFor="contact-phone">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 block" style={{ fontFamily: "var(--font-body)" }}>
                {t("phoneField")}
              </span>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                className="w-full rounded-xl border border-[rgba(212,175,55,0.4)] bg-gray-50/50 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </label>

            <label className="block mt-5" htmlFor="contact-message">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 block" style={{ fontFamily: "var(--font-body)" }}>
                {t("message")}
              </span>
              <textarea
                id="contact-message"
                name="message"
                className="mt-1 w-full rounded-xl border border-[rgba(212,175,55,0.4)] bg-gray-50/50 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 min-h-[140px]"
                style={{ fontFamily: "var(--font-body)" }}
                required
              />
            </label>

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-8 w-full rounded-full bg-primary-solid px-6 py-3 font-bold text-white shadow-md transition-all duration-300 hover:bg-primary-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-body)" }}
              >
              {status === "loading" ? "Envoi..." : t("submit")}
            </button>
            {status === "success" && <p className="mt-4 text-center text-sm font-semibold text-green-700">{t("success")}</p>}
            {status === "error" && <p className="mt-4 text-center text-sm font-semibold text-red-700">{errorMessage}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
