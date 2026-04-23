"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useProfileStore } from "@/store/profileStore";
import { useServicePaymentStore } from "@/store/servicePaymentStore";
import { cardService } from "@/services/cardService";
import { accountService } from "@/services/accountService";
import { Card } from "@/types";

const ACCOUNT_BALANCE_ID = -1;

export default function ServicePayPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.id);

  const { account, fetchProfileData } = useProfileStore();
  const {
    selectedService,
    setSelectedCard,
    setLastTransaction,
    setError: setPaymentError,
    setPaidWithBalance,
  } = useServicePaymentStore();

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedService) {
      router.push(`/services/${serviceId}/account`);
      return;
    }
  }, [selectedService, serviceId, router]);

  useEffect(() => {
    if (account) {
      cardService
        .getCards(account.id)
        .then((data) => {
          setCards(data);
          
          setSelection(ACCOUNT_BALANCE_ID);
        })
        .finally(() => setLoading(false));
    }
  }, [account]);

  const handlePay = async () => {
    if (!account || !selectedService || selection === null) return;

    const payingWithBalance = selection === ACCOUNT_BALANCE_ID;

    if (payingWithBalance) {
      const invoiceAmount = Math.abs(selectedService.invoice_value);
      if (account.available_amount < invoiceAmount) {
        setPaymentError("No tenés saldo suficiente para realizar este pago.");
        router.push(`/services/${serviceId}/error`);
        return;
      }
    }

    const card = payingWithBalance
      ? null
      : cards.find((c) => c.id === selection) ?? null;

    if (!payingWithBalance && !card) return;

    setIsSubmitting(true);
    setSelectedCard(card);
    setPaidWithBalance(payingWithBalance);

    try {
      const tx = await accountService.createTransaction(account.id, {
        amount: -Math.abs(selectedService.invoice_value),
        dated: new Date().toISOString(),
        description: selectedService.name,
      });

      setLastTransaction(tx);
      
      await fetchProfileData();
      router.push(`/services/${serviceId}/success`);
    } catch (err: any) {
      console.error("Payment error:", err);
      setPaymentError(
        err?.response?.data?.error || "Error al procesar el pago"
      );
      router.push(`/services/${serviceId}/error`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedService) return null;

  const formattedAmount = Math.abs(selectedService.invoice_value).toLocaleString(
    "es-AR",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );

  const formattedBalance = account
    ? account.available_amount.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0,00";

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6">
      
      <div className="flex items-center gap-2 md:hidden">
        <ArrowRight className="h-5 w-5 text-black" />
        <span className="font-bold text-black text-lg underline underline-offset-4">
          Pagar servicios
        </span>
      </div>

      <div className="bg-secondary-bg rounded-[1.25rem] p-6 sm:p-10 shadow-sm flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <h2 className="text-primary text-xl sm:text-2xl font-bold">
            {selectedService.name}
          </h2>
          <button className="text-white text-sm sm:text-base underline underline-offset-2 hover:text-primary transition-colors whitespace-nowrap ml-4 cursor-pointer">
            Ver detalles del pago
          </button>
        </div>

        <div className="border-t border-zinc-600 pt-4 flex items-center justify-between">
          <span className="text-white text-lg sm:text-xl font-bold">
            Total a pagar
          </span>
          <span className="text-white text-xl sm:text-2xl font-bold">
            ${formattedAmount}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-[1.25rem] p-6 sm:p-8 shadow-sm flex flex-col gap-0">
        <h3 className="text-black font-bold text-lg mb-4">Tus medios de pago</h3>

        {loading ? (
          <p className="text-zinc-500 py-6 text-center">
            Cargando tus medios de pago...
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-100">
            
            <label className="flex items-center justify-between py-5 cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-black font-bold text-sm">$</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-black font-medium text-base sm:text-lg">
                    Dinero en cuenta
                  </span>
                  <span className="text-xs text-zinc-400">
                    Disponible: ${formattedBalance}
                  </span>
                </div>
              </div>
              <input
                type="radio"
                name="pay-card"
                value={ACCOUNT_BALANCE_ID}
                checked={selection === ACCOUNT_BALANCE_ID}
                onChange={() => setSelection(ACCOUNT_BALANCE_ID)}
                className="w-6 h-6 accent-primary"
              />
            </label>

            {cards.map((card) => (
              <label
                key={card.id}
                className="flex items-center justify-between py-5 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary" />
                  <span className="text-black font-medium text-base sm:text-lg">
                    Terminada en {String(card.number_id).slice(-4)}
                  </span>
                </div>
                <input
                  type="radio"
                  name="pay-card"
                  value={card.id}
                  checked={selection === card.id}
                  onChange={() => setSelection(card.id)}
                  className="w-6 h-6 accent-primary"
                />
              </label>
            ))}

            <Link
              href="/cards/new"
              className="flex items-center justify-between py-5 hover:bg-zinc-50 -mx-2 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <span className="text-primary font-bold text-base sm:text-lg">
                  Nueva tarjeta
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-primary" />
            </Link>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handlePay}
          disabled={isSubmitting || selection === null}
          className="h-14 w-full sm:w-auto sm:px-20 font-bold text-lg bg-primary text-black hover:bg-primary-hover shadow-lg rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "Procesando..." : "Pagar"}
        </Button>
      </div>
    </div>
  );
}
