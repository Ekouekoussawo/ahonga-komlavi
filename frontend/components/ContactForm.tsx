"use client";

import { useState, FormEvent } from "react";
import { submitContactForm } from "@/lib/api";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    };

    try {
      await submitContactForm(data);
      setStatus("success");
      e.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Erreur lors de l'envoi");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-10 animate-in fade-in duration-300">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          Message envoyé
        </h3>
        <p className="text-gray-600" style={{ fontFamily: "var(--font-body)" }}>
          Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center gap-2 text-primary-700 font-semibold hover:underline"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-body)" }}>
            Nom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={status === "loading"}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:bg-gray-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-body)" }}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={status === "loading"}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:bg-gray-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-body)" }}>
          Sujet
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          disabled={status === "loading"}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:bg-gray-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-body)" }}>
          Téléphone (optionnel)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          disabled={status === "loading"}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:bg-gray-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "var(--font-body)" }}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          disabled={status === "loading"}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:bg-gray-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>
      {status === "error" && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm" style={{ fontFamily: "var(--font-body)" }}>
          {errorMessage}
        </div>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b8962e] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Envoi en cours...
          </span>
        ) : (
          "Envoyer"
        )}
      </button>
    </form>
  );
}