"use client";

import { useTranslations } from "next-intl";
import { ChevronDown, Calendar } from "lucide-react";

interface SermonFilterProps {
  series: string[];
  selectedSeries: string;
  onSeriesChange: (series: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  months: { value: string; label: string }[];
}

export default function SermonFilter({
  series,
  selectedSeries,
  onSeriesChange,
  selectedMonth,
  onMonthChange,
  months,
}: SermonFilterProps) {
  const t = useTranslations("sermons");

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-10 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex-1 sm:max-w-xs">
        <label htmlFor="series-filter" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "var(--font-body)" }}>
          {t("filterSeries")}
        </label>
        <div className="relative">
          <select
            id="series-filter"
            value={selectedSeries}
            onChange={(e) => onSeriesChange(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <option value="">{t("allSeries")}</option>
            {series.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      <div className="flex-1 sm:max-w-xs">
        <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "var(--font-body)" }}>
          {t("filterDate")}
        </label>
        <div className="relative">
          <select
            id="month-filter"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <option value="">{t("allMonths")}</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}