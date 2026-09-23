"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Sermon } from "@/types/wordpress";
import SermonsGrid from "./SermonsGrid";

interface SermonsProps {
  posts: Sermon[];
}

export default function Sermons({ posts }: SermonsProps) {
  const t = useTranslations("sermons");

  return (
    <section className="bg-[#f9f7f2] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-16">
          <span
            className="inline-block rounded-full bg-[rgba(212,175,55,0.15)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#8a6d1b] mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {t("badge")}
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("title")}
          </h2>
          <p
            className="text-gray-600 mx-auto max-w-2xl text-base sm:text-lg"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {t("subtitle")}
          </p>
        </div>

        <SermonsGrid sermons={posts.slice(0, 3)} />

        <div className="mt-12 text-center">
          <Link
            href="/sermons"
            className="inline-flex items-center gap-2 rounded-full bg-primary-700 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-primary-800 hover:shadow-xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
