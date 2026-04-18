"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useProfileStore } from "@/store/profileStore";
import { cardService } from "@/services/cardService";
import { Card } from "@/types";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";

export default function CardsPage() {
  const { account } = useProfileStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    if (!account) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await cardService.getCards(account.id);
      setCards(data);
    } catch {
      setError("Error al cargar las tarjetas.");
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleDelete = async (cardId: number) => {
    if (!account) return;
    setDeletingId(cardId);
    try {
      await cardService.deleteCard(account.id, cardId);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch {
      setError("Error al eliminar la tarjeta.");
    } finally {
      setDeletingId(null);
    }
  };

  const getLastFour = (numberId: number): string => {
    const str = String(numberId);
    return str.slice(-4);
  };

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6">
      {/* ── Breadcrumb ──────────────────────────────── */}
      <div className="flex items-center gap-2 text-black">
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium text-lg">Tarjetas</span>
      </div>

      {/* ── New Card CTA ───────────────────────────── */}
      <Link
        href="/cards/new"
        className="bg-secondary-bg rounded-[1.25rem] p-6 sm:p-8 flex flex-col gap-4 shadow-sm hover:bg-background transition-colors group"
      >
        <p className="text-white text-sm sm:text-base font-medium">
          Agregá tu tarjeta de débito o crédito
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <span className="text-primary font-bold text-lg sm:text-xl">
              Nueva tarjeta
            </span>
          </div>
          <ArrowRight className="w-6 h-6 text-primary" />
        </div>
      </Link>

      {/* ── Card List ──────────────────────────────── */}
      <div className="bg-white rounded-[1.25rem] p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-black mb-4">Tus tarjetas</h2>

        {isLoading ? (
          <p className="text-zinc-500 py-4 text-center">Cargando tarjetas...</p>
        ) : error ? (
          <p className="text-dmh-error py-4 text-center">{error}</p>
        ) : cards.length === 0 ? (
          <p className="text-zinc-500 py-4 text-center">
            No tenés tarjetas agregadas todavía.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-200">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-black text-sm sm:text-base">
                    Terminada en {getLastFour(card.number_id)}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(card.id)}
                  disabled={deletingId === card.id}
                  className="text-black font-bold text-sm sm:text-base hover:text-dmh-error transition-colors disabled:opacity-50"
                >
                  {deletingId === card.id ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
