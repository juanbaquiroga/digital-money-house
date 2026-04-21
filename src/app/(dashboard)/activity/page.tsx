"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useProfileStore } from "@/store/profileStore";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import {
  ActivityFilterModal,
  type PeriodOption,
  type DateRange,
} from "@/components/activity/ActivityFilterModal";

const ITEMS_PER_PAGE = 10;

/** Format a date to a relative day name in Spanish */
function formatRelativeDay(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const txDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor(
    (today.getTime() - txDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";

  const dayNames = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return dayNames[date.getDay()];
}

export default function ActivityPage() {
  const { activity, isLoading, account } = useProfileStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activePeriod, setActivePeriod] = useState<PeriodOption>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });

  // Filter by search term + date range
  const filteredActivity = useMemo(() => {
    let result = [...activity];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.description?.toLowerCase().includes(term) ||
          tx.type?.toLowerCase().includes(term)
      );
    }

    // Date range filter
    if (dateRange.from || dateRange.to) {
      result = result.filter((tx) => {
        const txDate = new Date(tx.dated);
        if (dateRange.from && txDate < dateRange.from) return false;
        if (dateRange.to && txDate > dateRange.to) return false;
        return true;
      });
    }

    // Sort by date descending (newest first)
    result.sort(
      (a, b) => new Date(b.dated).getTime() - new Date(a.dated).getTime()
    );

    return result;
  }, [activity, searchTerm, dateRange]);

  const totalPages = Math.ceil(filteredActivity.length / ITEMS_PER_PAGE);
  const paginatedActivity = filteredActivity.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterApply = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const formatAmount = (amount: number) => {
    const abs = Math.abs(amount);
    return abs.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (isLoading || !account) {
    return (
      <div className="p-6 sm:p-10 text-black flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <h1 className="text-xl font-bold">Cargando tu actividad...</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-4 sm:gap-6">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2">
        <Link
          href="/home"
          className="text-zinc-500 hover:text-black transition-colors"
        >
          <ArrowRight className="h-5 w-5 rotate-180" />
        </Link>
        <h1 className="text-lg font-bold text-black underline underline-offset-4">
          Tu actividad
        </h1>
      </div>

      {/* ── Search Bar + Filter Button ── */}
      <div className="flex flex-col sm:flex-row gap-3 relative">
        <div className="relative flex-1 shadow-sm rounded-xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="activity-search"
            type="text"
            placeholder="Buscar en tu actividad"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="block w-full pl-11 pr-3 py-4 border border-zinc-200 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-lg text-black"
          />
        </div>

        {/* Filter button — desktop only (hidden on mobile, shown inside card instead) */}
        <div className="relative hidden sm:block">
          <button
            id="activity-filter-btn"
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 shadow-sm whitespace-nowrap
              ${
                activePeriod
                  ? "bg-primary text-black hover:bg-primary-hover"
                  : "bg-secondary-bg text-white hover:bg-zinc-700"
              }`}
          >
            Filtrar
            <SlidersHorizontal className="h-5 w-5" />
          </button>

          {/* Filter modal - positioned relative to button on desktop */}
          <ActivityFilterModal
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
            onApply={(range) => {
              handleFilterApply(range);
              // Track which period is active for button styling
              if (!range.from && !range.to) {
                setActivePeriod(null);
              }
            }}
            currentPeriod={activePeriod}
          />
        </div>
      </div>

      {/* ── Activity List Card ── */}
      <div className="bg-white rounded-[1.25rem] p-4 sm:p-6 shadow-sm flex flex-col">
        <h3 className="text-black font-bold text-lg mb-2 border-b border-zinc-200 pb-4 flex items-center justify-between">
          <span>Tu actividad</span>
          <div className="flex items-center gap-2">
            {activePeriod && (
              <button
                onClick={() => {
                  setActivePeriod(null);
                  setDateRange({ from: null, to: null });
                  setCurrentPage(1);
                }}
                className="text-sm font-normal text-zinc-500 hover:text-black transition-colors"
              >
                Limpiar filtro
              </button>
            )}
            {/* Filter button — mobile only (inside card header) */}
            <div className="relative sm:hidden">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200
                  ${
                    activePeriod
                      ? "text-primary"
                      : "text-black"
                  }`}
              >
                Filtrar
                <SlidersHorizontal className="h-4 w-4" />
              </button>

              <ActivityFilterModal
                isOpen={filterOpen}
                onClose={() => setFilterOpen(false)}
                onApply={(range) => {
                  handleFilterApply(range);
                  if (!range.from && !range.to) {
                    setActivePeriod(null);
                  }
                }}
                currentPeriod={activePeriod}
              />
            </div>
          </div>
        </h3>

        {paginatedActivity.length === 0 ? (
          <p className="text-zinc-500 py-8 text-center">
            {searchTerm || dateRange.from
              ? "No se encontraron resultados para tu búsqueda."
              : "No hay actividad registrada."}
          </p>
        ) : (
          <ul className="flex flex-col">
            {paginatedActivity.map((tx) => {
              const isIncome =
                tx.type === "Deposit" ||
                tx.type === "deposit" ||
                tx.amount > 0;
              const prefix = isIncome ? "$" : "-$";

              return (
                <li key={tx.id}>
                  <Link
                    href={`/activity/${tx.id}`}
                    className="flex justify-between items-center py-4 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 -mx-2 px-2 rounded-lg transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-black sm:text-lg group-hover:text-primary transition-colors">
                        {tx.description || tx.type}
                      </span>
                    </div>
                    <div className="flex flex-col items-end justify-center flex-shrink-0 ml-4">
                      <span className="text-black font-medium sm:text-lg">
                        {prefix} {formatAmount(tx.amount)}
                      </span>
                      <span className="text-xs sm:text-sm text-zinc-400">
                        {formatRelativeDay(tx.dated)}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Pagination */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
