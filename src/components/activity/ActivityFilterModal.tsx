"use client";

import { useState } from "react";

type PeriodOption =
  | "today"
  | "yesterday"
  | "last_week"
  | "last_15_days"
  | "last_month"
  | "last_year"
  | "custom"
  | null;

type OperationType = "all" | "income" | "expense";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface ActivityFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (range: DateRange, operationType: OperationType) => void;
  currentPeriod: PeriodOption;
  currentOperationType?: OperationType;
}

const PERIOD_OPTIONS: { value: PeriodOption; label: string }[] = [
  { value: "today", label: "Hoy" },
  { value: "yesterday", label: "Ayer" },
  { value: "last_week", label: "Última semana" },
  { value: "last_15_days", label: "Últimos 15 días" },
  { value: "last_month", label: "Último mes" },
  { value: "last_year", label: "Último año" },
  { value: "custom", label: "Otro período" },
];

const OPERATION_OPTIONS: { value: OperationType; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "income", label: "Ingresos" },
  { value: "expense", label: "Egresos" },
];

function getDateRange(period: PeriodOption): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case "today":
      return { from: today, to: now };
    case "yesterday": {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: yesterday, to: today };
    }
    case "last_week": {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return { from: weekAgo, to: now };
    }
    case "last_15_days": {
      const d15 = new Date(today);
      d15.setDate(d15.getDate() - 15);
      return { from: d15, to: now };
    }
    case "last_month": {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return { from: monthAgo, to: now };
    }
    case "last_year": {
      const yearAgo = new Date(today);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return { from: yearAgo, to: now };
    }
    default:
      return { from: null, to: null };
  }
}

export function ActivityFilterModal({
  isOpen,
  onClose,
  onApply,
  currentPeriod,
  currentOperationType = "all",
}: ActivityFilterModalProps) {
  const [selected, setSelected] = useState<PeriodOption>(currentPeriod);
  const [operationType, setOperationType] = useState<OperationType>(currentOperationType);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  if (!isOpen) return null;

  const handleApply = () => {
    if (selected === "custom") {
      onApply(
        {
          from: customFrom ? new Date(customFrom) : null,
          to: customTo ? new Date(customTo + "T23:59:59") : null,
        },
        operationType
      );
    } else if (selected) {
      onApply(getDateRange(selected), operationType);
    } else {
      
      onApply({ from: null, to: null }, operationType);
    }
    onClose();
  };

  const handleClear = () => {
    setSelected(null);
    setOperationType("all");
    setCustomFrom("");
    setCustomTo("");
    onApply({ from: null, to: null }, "all");
    onClose();
  };

  const hasFilters = selected !== null || operationType !== "all";

  return (
    <>
      
      <div
        className="fixed inset-0 bg-black/40 z-40 md:bg-transparent"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl p-6 pb-8 max-h-[85vh] overflow-y-auto
        md:absolute md:inset-auto md:top-full md:right-0 md:mt-2 md:rounded-2xl md:w-[360px] md:shadow-xl md:border md:border-zinc-200">

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-black">
            Filtros
          </h3>
          <button
            onClick={handleClear}
            className="text-sm text-zinc-500 hover:text-black transition-colors"
          >
            Borrar filtros
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-bold text-zinc-700 mb-3 uppercase tracking-wide">
            Tipo de operación
          </h4>
          <div className="flex gap-2">
            {OPERATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setOperationType(option.value)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 border ${
                  operationType === option.value
                    ? "bg-primary text-black border-primary"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <h4 className="text-sm font-bold text-zinc-700 mb-3 uppercase tracking-wide flex items-center gap-2">
          Período
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="mt-0.5">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </h4>

        <div className="flex flex-col">
          {PERIOD_OPTIONS.map((option) => (
            <div key={option.value}>
              <button
                onClick={() => setSelected(option.value)}
                className={`w-full flex items-center justify-between py-4 border-b border-zinc-100 text-left transition-colors
                  ${option.value === "custom" ? "border-b-0" : ""}
                `}
              >
                <span
                  className={`text-base ${
                    selected === option.value ? "font-bold text-black" : "text-zinc-700"
                  }`}
                >
                  {option.label}
                </span>

                {option.value === "custom" ? (
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                    <path d="M1 1L7 7L1 13" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                      ${
                        selected === option.value
                          ? "border-primary bg-primary"
                          : "border-zinc-300"
                      }`}
                  >
                    {selected === option.value && (
                      <div className="w-2 h-2 rounded-full bg-secondary-bg" />
                    )}
                  </div>
                )}
              </button>

              {option.value === "custom" && selected === "custom" && (
                <div className="flex flex-col gap-3 py-3 pl-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-500 font-medium">Desde</label>
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="border border-zinc-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-500 font-medium">Hasta</label>
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="border border-zinc-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleApply}
          disabled={!hasFilters}
          className={`w-full mt-6 py-3.5 rounded-xl font-bold text-base transition-all duration-200
            ${
              hasFilters
                ? "bg-primary text-black hover:bg-primary-hover shadow-md"
                : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
            }`}
        >
          Aplicar
        </button>
      </div>
    </>
  );
}

export type { PeriodOption, DateRange, OperationType };
