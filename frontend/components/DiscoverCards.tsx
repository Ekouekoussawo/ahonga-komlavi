import Link from "next/link";
import { useTranslations } from "next-intl";
import { BookOpen, HeartHandshake, Users, Heart } from "lucide-react";

const items = [
  { id: "teaching", icon: BookOpen, href: "/sermons" },
  { id: "prayer", icon: HeartHandshake, href: "/about#contact" },
  { id: "community", icon: Users, href: "/about" },
  { id: "giving", icon: Heart, href: "tel:+22890877855" },
];

export default function DiscoverCards() {
  const t = useTranslations("discover");

  const descriptions = [
    "Prêches et études bibliques pour grandir dans la foi",
    "Programmes de prière et d'intercession",
    "Rejoindre une famille de foi active",
    "Contribuer à l'œuvre de Dieu",
  ];

  return (
    <section className="relative bg-primary-soft py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col items-center rounded-2xl bg-white p-8 text-center border border-slate-100 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary-solid text-primary-700 transition-all duration-200 group-hover:scale-105 group-hover:bg-primary-solid group-hover:text-white">
                {<item.icon className="h-7 w-7" />}
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                {idx === 0 ? "Enseignement" : idx === 1 ? "Prière" : idx === 2 ? "Communauté" : "Soutenir"}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5" style={{ fontFamily: "var(--font-body)" }}>
                {descriptions[idx]}
              </p>
              <span className="text-primary-readable font-semibold text-sm transition-transform duration-200 group-hover:translate-x-1">
                En savoir plus →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
