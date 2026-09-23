"use client";

import { useState } from "react";
import { Smartphone } from "lucide-react";

// Local (8-digit, no +228) numbers — USSD transfer codes on Togolese
// networks take the subscriber number in local format, not international.
const MIXX_LOCAL_NUMBER = "90877855";
const FLOOZ_LOCAL_NUMBER = "99697848";

export default function MobileMoneyQuickPay() {
  const [amount, setAmount] = useState("");

  // Mixx by Yas (Togocom/Yas): no flat number+amount+PIN string is publicly
  // documented (only the *145*1# menu entry is confirmed). This extrapolates
  // Flooz's verified *155*1*1*Number*Amount*PIN# pattern onto Mixx's own
  // menu code — unverified, but a wrong USSD string just errors out safely
  // (no transfer can occur on an invalid code), so it's worth trying rather
  // than falling back to the plain menu whenever an amount is given.
  const mixxHref = amount
    ? `tel:*145*1*${MIXX_LOCAL_NUMBER}*${encodeURIComponent(amount)}*`
    : "tel:*145*1%23";

  // Flooz (Moov Africa): *155*1*1*Number*Amount*PIN# is the documented
  // format for sending to a Moov number. Ending on "*" instead of "#"
  // leaves the code without the PIN and dials only as far as verified —
  // most phones then prompt for the PIN as the next USSD step, so it's
  // never typed into this page. If a handset doesn't support resuming
  // there, dialing just shows an error — no transfer can go through on an
  // incomplete code, so this is safe either way.
  const floozHref = amount
    ? `tel:*155*1*1*${FLOOZ_LOCAL_NUMBER}*${encodeURIComponent(amount)}*`
    : `tel:*155%23`;

  return (
    <div className="mb-8">
      <label className="mb-3 block text-sm font-semibold text-white/90" style={{ fontFamily: "var(--font-body)" }}>
        Montant du don (FCFA) — optionnel, pour pré-remplir le transfert
      </label>
      <input
        type="number"
        inputMode="numeric"
        min="0"
        placeholder="Ex : 5000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-6 w-full max-w-xs rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30"
        style={{ fontFamily: "var(--font-body)" }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="h-5 w-5 text-accent-400" />
            <h3 className="font-semibold" style={{ fontFamily: "var(--font-heading)" }}>Mixx by Yas</h3>
          </div>
          <p className="text-white/90 mb-3">+228 90 87 78 55</p>
          <a
            href={mixxHref}
            className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-secondary-900 hover:bg-accent-400 transition"
          >
            Ouvrir Mixx by Yas{amount ? ` (${amount} FCFA)` : ""}
          </a>
          <p className="mt-2 text-xs text-white/50">
            {amount
              ? "Numéro et montant pré-remplis, si votre téléphone le permet — sinon confirmez-les à l'écran suivant."
              : "Ouvre le menu de transfert — indiquez ce numéro quand il vous est demandé."}
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="h-5 w-5 text-accent-400" />
            <h3 className="font-semibold" style={{ fontFamily: "var(--font-heading)" }}>Flooz</h3>
          </div>
          <p className="text-white/90 mb-3">+228 99 69 78 48</p>
          <a
            href={floozHref}
            className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-secondary-900 hover:bg-accent-400 transition"
          >
            Ouvrir Flooz{amount ? ` (${amount} FCFA)` : ""}
          </a>
          <p className="mt-2 text-xs text-white/50">
            Numéro et montant pré-remplis — il ne vous restera qu&apos;à entrer votre code secret.
          </p>
        </div>
      </div>
    </div>
  );
}
