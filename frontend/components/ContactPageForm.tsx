"use client";

import { FormEvent } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useTranslations } from "next-intl";

const CONTACT_SUBJECTS = [
  "Guérison et santé",
  "Famille et mariage",
  "Finances et provision",
  "Travail et orientation",
  "Délivrance et libération",
  "Intercession pour un proche",
  "Réconciliation",
  "Action de grâce",
  "Autre intention",
] as const;

export default function ContactPageForm() {
  const t = useTranslations("contact");

  // WordPress here is purely a content source (articles), not a form
  // backend — there's no /wp-json/contact-form/v1/submit route (confirmed
  // 404), so this opens WhatsApp with the message pre-filled instead of
  // posting somewhere that doesn't exist.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const link = buildWhatsAppLink({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    });
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block" htmlFor="contact-page-name">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 block" style={{ fontFamily: "var(--font-body)" }}>{t("name")}</span>
          <input
            id="contact-page-name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-[rgba(212,175,55,0.4)] bg-gray-50/50 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </label>
        <label className="block" htmlFor="contact-page-email">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 block" style={{ fontFamily: "var(--font-body)" }}>{t("emailField")}</span>
          <input
            id="contact-page-email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-[rgba(212,175,55,0.4)] bg-gray-50/50 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </label>
      </div>
      <label className="block" htmlFor="contact-page-subject">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 block" style={{ fontFamily: "var(--font-body)" }}>{t("subject")}</span>
        <select
          id="contact-page-subject"
          name="subject"
          required
          className="w-full rounded-xl border border-[rgba(212,175,55,0.4)] bg-gray-50/50 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 appearance-none"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <option value="">{t("selectPlaceholder")}</option>
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 block" style={{ fontFamily: "var(--font-body)" }}>{t("phoneField")}</span>
        <input
          name="phone"
          type="tel"
          className="w-full rounded-xl border border-[rgba(212,175,55,0.4)] bg-gray-50/50 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 block" style={{ fontFamily: "var(--font-body)" }}>{t("message")}</span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-[rgba(212,175,55,0.4)] bg-gray-50/50 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 min-h-[140px]"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </label>
      <button
        type="submit"
        className="mt-8 w-full rounded-full bg-primary-solid px-6 py-3 font-bold text-white shadow-md transition-all duration-300 hover:bg-primary-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {t("submit")}
      </button>
    </form>
  );
}
