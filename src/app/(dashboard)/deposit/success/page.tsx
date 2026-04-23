"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDepositStore } from "@/store/depositStore";
import { useProfileStore } from "@/store/profileStore";

export default function DepositSuccessPage() {
  const router = useRouter();
  const { lastTransaction, reset } = useDepositStore();
  const { account } = useProfileStore();

  useEffect(() => {
    
    if (!lastTransaction) {
      router.push("/home");
    }
  }, [lastTransaction, router]);

  const handleDownloadReceipt = () => {
    if (!lastTransaction) return;

    const content = `
COMPROBANTE DE DEPÓSITO - DIGITAL MONEY HOUSE
---------------------------------------------
Fecha: ${new Date(lastTransaction.dated).toLocaleString()}
Monto: $${lastTransaction.amount}
Destinatario: Cuenta propia
Origen: ${lastTransaction.origin}
ID Transacción: ${lastTransaction.id}
---------------------------------------------
Gracias por usar Digital Money House.
    `.trim();

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `comprobante_deposito_${lastTransaction.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleGoHome = () => {
    reset();
    router.push("/home");
  };

  if (!lastTransaction || !account) return null;

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6 text-black pb-20 sm:pb-10">

      <div className="flex items-center gap-2 text-black self-start mb-2">
         <span className="font-bold border-b-2 border-black">Cargar dinero</span>
      </div>

      <div className="bg-primary rounded-[1.25rem] p-8 sm:p-12 flex flex-col items-center justify-center gap-4 text-center shadow-lg">
          <div className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center">
              <Check className="w-10 h-10 text-black stroke-[3px]" />
          </div>
          <h2 className="text-black text-2xl sm:text-3xl font-bold">
            Ya cargamos el dinero en tu cuenta
          </h2>
      </div>

      <div className="bg-secondary-bg rounded-[1.25rem] p-6 sm:p-10 shadow-sm flex flex-col gap-6 text-white">

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
              <span className="text-sm text-zinc-400">
                {new Date(lastTransaction.dated).toLocaleDateString('es-AR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })} a las {new Date(lastTransaction.dated).toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit'
                })} hs.
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-primary">
                ${lastTransaction.amount.toLocaleString('es-AR')}
              </span>
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
            className="h-14 w-full sm:w-auto sm:px-12 font-bold text-lg rounded-xl transition-all
              bg-primary text-black hover:bg-primary-hover shadow-lg
              sm:bg-transparent sm:text-black sm:border-2 sm:border-primary sm:shadow-none sm:hover:bg-primary sm:hover:text-black"
          >
            Descargar comprobante
          </Button>
      </div>

    </div>
  );
}
