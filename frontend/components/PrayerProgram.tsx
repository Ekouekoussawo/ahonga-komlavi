const schedule = [
  {
    emoji: "🙏🏽",
    when: "Chaque mercredi",
    time: "12h00",
    title: "ARMÉE DE MIDI",
    description: "Un temps de prière pour chercher la face de Dieu, intercéder et combattre dans la prière.",
  },
  {
    emoji: "🔥",
    when: "Chaque dimanche",
    time: "18h30",
    title: "PRIÈRE D'INTERCESSION",
    description: "Un moment consacré à l'intercession pour les familles, les vies, l'Église, la nation et les besoins du peuple de Dieu.",
  },
  {
    emoji: "🌙",
    when: "Chaque premier et dernier vendredi",
    time: "22h00",
    title: "VEILLÉE DE PRIÈRE",
    description: "Une nuit consacrée à la prière, à l'intercession, à la louange et à la recherche de la présence de Dieu.",
  },
  {
    emoji: "🙌🏽",
    when: "Chaque troisième samedi",
    time: "08h00",
    title: "JEÛNE ET PRIÈRE",
    description: "Un temps de consécration, de jeûne et de prière pour rechercher la volonté de Dieu et Lui présenter nos vies et nos besoins.",
  },
  {
    emoji: "🔥",
    when: "Chaque première semaine du mois",
    time: "",
    title: "GRANDE SÉANCE DE PRIÈRE",
    description: "Un programme spécial consacré à la prière, à l'enseignement de la Parole, à l'intercession et à la recherche de la présence de Dieu.",
  },
];

export default function PrayerProgram() {
  return (
    <section className="bg-[#f9f7f2] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-16">
          <span
            className="inline-block rounded-full bg-[rgba(212,175,55,0.15)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#8a6d1b] mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Programme
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Notre programme de prière
          </h2>
          <p
            className="text-gray-600 mx-auto max-w-2xl text-base sm:text-lg"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Centre de prière ESPRIT ET VIE
            <br />
            Djagblé-Abolavé – Quartier des Vainqueurs
          </p>
          <p
            className="text-gray-600 mx-auto max-w-2xl text-base sm:text-lg mt-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Nous vous invitons à vous joindre à nous dans ces différents moments de prière, d&apos;intercession, de jeûne et de communion avec Dieu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {schedule.map((item) => (
            <div
              key={item.title}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-[rgba(212,175,55,0.25)] p-6 sm:p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <p
                className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <span aria-hidden="true">{item.emoji}</span> {item.when}
              </p>
              <h3
                className="text-xl font-semibold mb-2 leading-snug"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.title} {item.time && <span className="text-primary-700">— {item.time}</span>}
              </h3>
              <p className="text-gray-600 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <p
          className="mt-14 text-center text-lg italic text-gray-700 max-w-2xl mx-auto"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          « Invoque-moi, et je te répondrai ; je t&apos;annoncerai de grandes choses, des choses cachées,
          que tu ne connais pas. » — Jérémie 33:3
        </p>
      </div>
    </section>
  );
}
