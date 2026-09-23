import { Landmark } from "lucide-react";
import MobileMoneyQuickPay from "./MobileMoneyQuickPay";

const international = [
  { name: "Western Union", beneficiary: "AHONGAN KOMLAVI" },
  { name: "RIA Money Transfer", beneficiary: "AHONGAN KOMLAVI" },
  { name: "MoneyGram", beneficiary: "AHONGAN KOMLAVI" },
];

export default function Give() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url(/gallery/4.jpg)" }}
      />
      <div className="absolute inset-0 bg-secondary-900/65" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-white">
        <div className="text-center mb-12">
          <span
            className="inline-block font-body text-sm font-semibold uppercase tracking-wider text-accent-400 mb-4"
          >
            Soutenir l&apos;œuvre de Dieu
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Faites un don</h2>
          <blockquote className="italic text-white/80 max-w-xl mx-auto" style={{ fontFamily: "var(--font-heading)" }}>
            « Que chacun donne comme il l&apos;a résolu en son cœur, sans tristesse ni contrainte ;
            car Dieu aime celui qui donne avec joie. » — 2 Corinthiens 9:7
          </blockquote>
          <p className="text-white/70 max-w-2xl mx-auto mt-6" style={{ fontFamily: "var(--font-body)" }}>
            Votre générosité contribue à l&apos;organisation des programmes de prière, à l&apos;évangélisation
            et à l&apos;accompagnement des âmes du Centre de prière ESPRIT ET VIE.
          </p>
        </div>

        <MobileMoneyQuickPay />

        <div className="rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Landmark className="h-5 w-5 text-accent-400" />
            <h3 className="font-semibold" style={{ fontFamily: "var(--font-heading)" }}>Transferts internationaux</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {international.map((m) => (
              <div key={m.name}>
                <p className="text-sm font-semibold text-white/90">{m.name}</p>
                <p className="text-sm text-white/70">Bénéficiaire : {m.beneficiary}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-white/60 mt-4">
            Pour les transferts internationaux, veuillez nous contacter afin d&apos;obtenir les informations complémentaires nécessaires.
          </p>
        </div>

        <p className="text-center text-white/80 text-sm max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
          Que le Seigneur vous bénisse abondamment, qu&apos;Il vous rende selon votre générosité et qu&apos;Il fasse
          prospérer l&apos;œuvre de vos mains. Merci pour votre amour, votre confiance et votre soutien à l&apos;œuvre de Dieu.
        </p>
      </div>
    </section>
  );
}
