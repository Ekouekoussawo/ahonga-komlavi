"use client";

import Link from "next/link";
import { Sermon } from "@/types/wordpress";
import { CardImage } from "@/components/ResponsiveImage";

interface SermonsGridProps {
  sermons: Sermon[];
}

function SermonsEmpty() {
  return (
    <div className="py-16 text-center">
      <div
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(212,175,55,0.15)] text-primary-700"
        aria-hidden="true"
      >
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A9 9 0 006 18c1.052 0 2.062-.18 3-.512m0-13.042A8.967 8.967 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A9 9 0 0118 18c-1.052 0 2.062-.18 3-.512"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
        Aucun prêche disponible
      </h3>
      <p className="mx-auto mb-6 max-w-md text-gray-600" style={{ fontFamily: "var(--font-body)" }}>
        Revenez bientôt pour découvrir de nouveaux messages et ressources spirituelles.
      </p>
      <Link
        href="/sermons"
        className="inline-flex items-center gap-2 rounded-full bg-primary-700 px-6 py-3 font-bold text-white shadow-md transition hover:bg-primary-800 hover:shadow-lg"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Explorer les archives
      </Link>
    </div>
  );
}

export default function SermonsGrid({ sermons }: SermonsGridProps) {
  if (!sermons.length) return <SermonsEmpty />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {sermons.map((sermon) => (
        <article
          key={sermon.id}
          className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
          <Link href={`/sermons/${sermon.slug}`} className="relative aspect-[16/10] overflow-hidden">
            <CardImage
              src={sermon.image}
              alt={sermon.title}
              aspectRatio="16/10"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {sermon.categories?.[0] && (
              <span className="absolute top-4 left-4 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-white">
                {sermon.categories[0].name}
              </span>
            )}
          </Link>
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <time
              className="mb-3 text-xs font-semibold tracking-wider text-primary-700"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {sermon.date}
            </time>
            <h3
              className="text-xl font-semibold mb-3 leading-snug"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Link href={`/sermons/${sermon.slug}`} className="hover:text-primary-700">
                {sermon.title}
              </Link>
            </h3>
            <p
              className="text-gray-600 text-sm mb-5 line-clamp-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {sermon.excerpt}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs text-gray-600">Par {sermon.author}</span>
              <Link href={`/sermons/${sermon.slug}`} className="text-primary-700 font-semibold text-sm hover:text-primary-800">
                Lire la suite →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
