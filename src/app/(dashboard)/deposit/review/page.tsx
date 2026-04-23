"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useProfileStore } from "@/store/profileStore";
import { useDepositStore } from "@/store/depositStore";
import { accountService } from "@/services/accountService";

export default function DepositReviewPage() {
  const router = useRouter();
  const { account, fetchProfileData } = useProfileStore();
  const { amount, selectedCard, setLastTransaction } = useDepositStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (amount <= 0) {
      router.push("/deposit/amount");
      return;
    }
    if (!selectedCard) {
      router.push("/deposit/select-card");
      return;
    }
  }, [amount, selectedCard, router]);

  const handleConfirm = async () => {
    if (!account || !selectedCard) return;
    setIsSubmitting(true);

    try {
      const tx = await accountService.createDeposit(account.id, {
        amount,
        dated: new Date().toISOString(),
        destination: "Cuenta propia",
        origin: `Tarjeta terminada en ${String(selectedCard.number_id).slice(-4)}`,
      });

      setLastTransaction(tx);
      
      await fetchProfileData();
      router.push("/deposit/success");
    } catch (error) {
      console.error("Error creating deposit:", error);
      alert("Error al procesar el depósito. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!account || !selectedCard) return null;

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6 text-black">

      <Link 
        href="/deposit/select-card"
        className="flex items-center gap-2 text-black hover:text-primary transition-colors self-start"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium text-lg">Cargar dinero</span>
      </Link>

      <div className="bg-secondary-bg rounded-[1.25rem] p-6 sm:p-10 shadow-sm flex flex-col gap-6">
        <h2 className="text-primary text-xl sm:text-2xl font-bold">
          Revisá que está todo bien
        </h2>

        <div className="flex flex-col gap-4 text-white">
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
                <span className="text-sm sm:text-base">Vas a transferir</span>
                <span className="text-lg sm:text-xl font-bold">${amount.toLocaleString('es-AR')}</span>
            </div>
            <Link href="/deposit/amount" className="p-2 text-primary hover:text-primary-hover">
                <Pencil className="w-6 h-6" />
            </Link>
          </div>

          <div className="border-t border-zinc-700 pt-4 flex flex-col gap-4">
              <div className="flex flex-col">
                  <span className="text-sm text-zinc-400">Para</span>
                  <span className="text-xl sm:text-2xl font-bold text-primary">Cuenta propia</span>
              </div>

              <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold">Digital Money House</span>
                  <div className="flex flex-col">
                      <span className="text-sm text-zinc-400 uppercase">CVU</span>
                      <span className="text-sm sm:text-base font-mono">{account.cvu}</span>
                  </div>
              </div>
          </div>
        </div>

        <Button 
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="h-14 w-full sm:w-auto sm:px-20 sm:self-end font-bold text-lg bg-primary text-black hover:bg-primary-hover shadow-lg rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "Procesando..." : "Continuar"}
        </Button>
      </div>

    </div>
  );
}
