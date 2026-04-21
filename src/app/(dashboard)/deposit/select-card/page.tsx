"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlusCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useProfileStore } from "@/store/profileStore";
import { useDepositStore } from "@/store/depositStore";
import { cardService } from "@/services/cardService";
import { Card } from "@/types";

export default function SelectCardPage() {
  const router = useRouter();
  const { account } = useProfileStore();
  const { amount, setSelectedCard, selectedCard } = useDepositStore();
  
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState<number | null>(selectedCard?.id || null);

  useEffect(() => {
    if (account) {
      cardService.getCards(account.id).then((data) => {
        setCards(data);
        setLoading(false);
      });
    }
  }, [account]);

  const handleContinue = () => {
    const card = cards.find(c => c.id === selection);
    if (card) {
      setSelectedCard(card);
      router.push("/deposit/amount");
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-10 text-black flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <p className="text-lg font-medium">Cargando tus tarjetas...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6 text-black">
      
      {/* breadcrumb */}
      <Link 
        href="/deposit"
        className="flex items-center gap-2 text-black hover:text-primary transition-colors self-start"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium text-lg">Cargar dinero</span>
      </Link>

      <div className="bg-secondary-bg rounded-[1.25rem] p-6 sm:p-10 shadow-sm flex flex-col gap-6">
        <h2 className="text-primary text-xl sm:text-2xl font-bold">
          Seleccionar tarjeta
        </h2>

        {/* --- Card List Card --- */}
        <div className="bg-white rounded-xl p-4 sm:p-6 flex flex-col gap-0 divide-y divide-zinc-100">
            <h3 className="text-black font-bold text-lg mb-4">Tus tarjetas</h3>
            
            {cards.length === 0 ? (
                <div className="py-8 text-center text-zinc-500">
                    No tenés tarjetas vinculadas.
                </div>
            ) : (
                cards.map((card) => (
                    <label 
                        key={card.id} 
                        className="flex items-center justify-between py-6 cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary" />
                            <span className="text-lg text-black font-medium">
                                Terminada en {String(card.number_id).slice(-4)}
                            </span>
                        </div>
                        <input 
                            type="radio" 
                            name="card" 
                            value={card.id}
                            checked={selection === card.id}
                            onChange={() => setSelection(card.id)}
                            className="w-6 h-6 accent-primary" 
                        />
                    </label>
                ))
            )}
        </div>
      </div>

      {/* --- Nueva tarjeta + Continuar (outside dark card, same row on desktop) --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link 
            href="/cards/new"
            className="flex items-center gap-4 group w-fit"
        >
            <PlusCircle className="w-8 h-8 text-primary group-hover:text-primary-hover transition-colors" />
            <span className="text-primary font-bold text-xl group-hover:text-primary-hover transition-colors">
                Nueva tarjeta
            </span>
        </Link>

        <Button 
          onClick={handleContinue}
          disabled={selection === null}
          className="h-14 w-full sm:w-auto sm:px-20 font-bold text-lg bg-primary text-black hover:bg-primary-hover shadow-lg rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          Continuar
        </Button>
      </div>


    </div>
  );
}
