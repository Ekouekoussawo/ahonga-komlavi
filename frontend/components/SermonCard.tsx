"use client";

import { useTranslations } from "next-intl";
import { Play, Clock, Calendar } from "lucide-react";
import { Sermon } from "@/types/wordpress";

interface SermonCardProps {
  sermon: Sermon;
}

export default function SermonCard({ sermon }: SermonCardProps) {
  const t = useTranslations("sermons");

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={sermon.image}
          alt={sermon.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {sermon.videoId && (
          <button
            className="absolute inset-0 flex items-center justify-center"
            onClick={() => window.open(sermon.youtubeUrl, "_blank")}
            aria-label={`${t("watch")}: ${sermon.title}`}
          >
            <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center transition-transform group-hover:scale-110">
              <Play className="h-8 w-8 text-primary-700 ml-1" aria-hidden="true" />
            </div>
          </button>
        )}
        {sermon.categories?.[0] && (
          <span className="absolute top-4 left-4 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-white">
            {sermon.categories[0].name}
          </span>
        )}
        {sermon.series && (
          <span className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700">
            {sermon.series}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3" style={{ fontFamily: "var(--font-body)" }}>
          <time>
            <Calendar className="h-3.5 w-3.5 inline-block mr-1" aria-hidden="true" />
            {sermon.date}
          </time>
          {sermon.videoId && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 inline-block mr-1" aria-hidden="true" />
              <a href={sermon.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-700 transition-colors">
                {t("watchOnYouTube")}
              </a>
            </span>
          )}
        </div>
        <h3
          className="text-xl font-semibold mb-3 leading-snug group-hover:text-primary-700 transition-colors"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {sermon.title}
        </h3>
        <p
          className="text-gray-600 text-sm mb-5 line-clamp-3 flex-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {sermon.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-gray-600" style={{ fontFamily: "var(--font-body)" }}>
            Par {sermon.author}
          </span>
          {sermon.videoId && (
            <a
              href={sermon.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-700 font-semibold text-sm hover:text-primary-800 transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              {t("watch")}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}