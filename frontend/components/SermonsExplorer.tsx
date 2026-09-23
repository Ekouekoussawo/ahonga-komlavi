"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Sermon } from "@/types/wordpress";
import { getSermons } from "@/lib/wordpress";
import { isoTime } from "@/lib/wordpress";
import { fallbackSermons } from "@/data/fallback";
import SermonsGrid from "@/components/SermonsGrid";
import JsonLd from "@/components/JsonLd";
import { sermonsListJsonLd } from "@/lib/json-ld";

type SortOption = "newest" | "oldest";

interface Props {
  initialSermons?: Sermon[];
}

export default function SermonsExplorer({ initialSermons }: Props) {
  const t = useTranslations("sermons");
  // Use server-provided sermons immediately — no fake-sermon flash.
  const [sermons, setSermons] = useState<Sermon[]>(
    initialSermons?.length ? initialSermons : fallbackSermons
  );
  const [selectedSeries, setSelectedSeries] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const seriesOptions = useMemo(() => {
    const map = new Map<string, number>();
    sermons.forEach((sermon) => {
      const name = sermon.series || "Prêches Généraux";
      map.set(name, (map.get(name) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
  }, [sermons]);

  const visibleSermons = useMemo(() => {
    let filtered = sermons;
    if (selectedSeries !== "all") {
      filtered = sermons.filter((sermon) => (sermon.series || "Prêches Généraux") === selectedSeries);
    }
    // Sort a COPY — never mutate the state array in place.
    return [...filtered].sort((a, b) => {
      const dateA = isoTime(a.dateIso);
      const dateB = isoTime(b.dateIso);
      return sort === "oldest" ? dateA - dateB : dateB - dateA;
    });
  }, [sermons, selectedSeries, sort]);

  const sermonsJsonLd = useMemo(() => sermonsListJsonLd(visibleSermons), [visibleSermons]);

  // Client-side refresh picks up a newer snapshot deployed without a rebuild.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await getSermons();
      if (!cancelled && data.length) setSermons(data);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-20">
      <JsonLd data={sermonsJsonLd} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{t("viewAll")}</h2>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold text-gray-700" style={{ fontFamily: "var(--font-body)" }}>
              {t("filterSeries", { defaultValue: "Série" })}
            </label>
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <option value="all">{t("filterAll", { defaultValue: "Toutes" })}</option>
              {seriesOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <label className="text-sm font-semibold text-gray-700 ml-2" style={{ fontFamily: "var(--font-body)" }}>
              {t("filterDate", { defaultValue: "Date" })}
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <option value="newest">{t("filterNewest", { defaultValue: "Plus récents" })}</option>
              <option value="oldest">{t("filterOldest", { defaultValue: "Plus anciens" })}</option>
            </select>
          </div>
        </div>

        <SermonsGrid sermons={visibleSermons} />
      </div>
    </section>
  );
}
