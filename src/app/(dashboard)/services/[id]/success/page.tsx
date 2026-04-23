"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useServicePaymentStore } from "@/store/servicePaymentStore";

export default function ServiceSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.id);

  const { selectedService, selectedCard, paidWithBalance, lastTransaction, reset } =
    useServicePaymentStore();

  useEffect(() => {
    if (!lastTransaction || !selectedService) {
      router.push("/services");
    }
  }, [lastTransaction, selectedService, router]);

  const handleDownloadReceipt = () => {
    if (!lastTransaction || !selectedService) return;

    const paymentMethod = paidWithBalance
      ? "Dinero en cuenta"
      : `Visa **********${String(selectedCard?.number_id ?? "").slice(-4)}`;

    const content = `
COMPROBANTE DE PAGO DE SERVICIO - DIGITAL MONEY HOUSE
------------------------------------------------------
Fecha: ${new Date(lastTransaction.dated).toLocaleString("es-AR")}
Servicio: ${selectedService.name}
Monto: $${Math.abs(lastTransaction.amount).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
Medio de pago: ${paymentMethod}
ID Transacción: ${lastTransaction.id}
------------------------------------------------------
Gracias por usar Digital Money House.
    `.trim();

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `comprobante_pago_${selectedService.name.replace(/\s/g, "_")}_${lastTransaction.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleGoHome = () => {
    reset();
    router.push("/home");
  };

  if (!lastTransaction || !selectedService) return null;

  const formattedAmount = Math.abs(lastTransaction.amount).toLocaleString(
    "es-AR",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6 pb-20 sm:pb-10">
      
      <div className="flex items-center gap-2 md:hidden">
        <ArrowRight className="h-5 w-5 text-black" />
        <span className="font-bold text-black text-lg underline underline-offset-4">
          Pagar servicios
        </span>
      </div>

      <div className="bg-primary rounded-[1.25rem] p-8 sm:p-12 flex flex-col items-center justify-center gap-4 text-center shadow-lg">
        <div className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center">
          <Check className="w-10 h-10 text-black stroke-[3px]" />
        </div>
        <h2 className="text-black text-2xl sm:text-3xl font-bold">
          Ya realizaste tu pago
        </h2>
      </div>

      <div className="bg-secondary-bg rounded-[1.25rem] p-6 sm:p-10 shadow-sm flex flex-col gap-4 text-white">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">
            {new Date(lastTransaction.dated).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            a{" "}
            {new Date(lastTransaction.dated).toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            hs.
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-primary">
            ${formattedAmount}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-zinc-400">Para</span>
            <span className="text-xl sm:text-2xl font-bold text-primary">
              {selectedService.name}
            </span>
          </div>

          {paidWithBalance ? (
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold">Medio de pago</span>
              <span className="text-base text-zinc-300">
                Cuenta propia
              </span>
            </div>
          ) : selectedCard ? (
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold">Tarjeta</span>
              <span className="text-base text-zinc-300">
                Visa **********{String(selectedCard.number_id).slice(-4)}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end mt-2">
        <Button
          onClick={handleGoHome}
          className="h-14 w-full sm:w-auto sm:px-12 font-bold text-lg bg-zinc-200 text-black hover:bg-zinc-300 shadow-md rounded-xl transition-all"
        >
          Ir al inicio
        </Button>
        <Button
          onClick={handleDownloadReceipt}
          className="h-14 w-full sm:w-auto sm:px-12 font-bold text-lg bg-primary text-black hover:bg-primary-hover shadow-lg rounded-xl transition-all"
        >
          Descargar comprobante
        </Button>
      </div>
    </div>
  );
}
