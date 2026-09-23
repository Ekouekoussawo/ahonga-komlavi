const points = [
  "Voir des hommes, des femmes, des jeunes et des familles restaurés par Dieu, enracinés dans Sa Parole et capables à leur tour de devenir des instruments de bénédiction pour leur génération.",
  "Le Centre de prière ESPRIT ET VIE est ainsi un lieu où chacun peut venir chercher Dieu, prier, écouter Sa Parole, recevoir des encouragements et grandir dans sa relation avec Jésus-Christ.",
  "Son désir n'est pas simplement de rassembler des personnes, mais de préparer des vies à marcher avec Dieu et à accomplir leur destinée selon Sa volonté.",
];

export default function Vision() {
  return (
    <section className="bg-secondary-500 py-20 md:py-24 text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span
            className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-400 mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Vision
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Notre vision
          </h2>
        </div>

        <ul className="space-y-6 mb-12">
          {points.map((point, idx) => (
            <li key={idx} className="flex gap-4 text-white/90 text-lg leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent-400" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <blockquote
          className="text-center text-xl italic text-accent-400 border-t border-white/15 pt-8"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          « L&apos;Esprit du Seigneur est sur moi, parce qu&apos;il m&apos;a oint pour annoncer une bonne nouvelle aux pauvres. »
          <footer className="mt-2 text-sm not-italic text-white/70">— Luc 4:18</footer>
        </blockquote>

        <p className="mt-10 text-center text-white/80" style={{ fontFamily: "var(--font-body)" }}>
          Que toute la gloire revienne à Jésus-Christ, car Lui seul sauve, restaure, délivre et transforme les vies.
        </p>
      </div>
    </section>
  );
}
