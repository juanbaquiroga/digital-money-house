"use client";

import { useRouter, useParams } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useServicePaymentStore } from "@/store/servicePaymentStore";

export default function ServiceErrorPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.id);
  const { error } = useServicePaymentStore();

  const handleRetry = () => {
    router.push(`/services/${serviceId}/pay`);
  };

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6">
      <div className="flex items-center gap-2 md:hidden">
        <ArrowRight className="h-5 w-5 text-black" />
        <span className="font-bold text-black text-lg underline underline-offset-4">
          Pagar servicios
        </span>
      </div>

      <div className="bg-secondary-bg rounded-[1.25rem] p-8 sm:p-12 flex flex-col items-center justify-center gap-6 text-center shadow-lg">
        <div className="w-16 h-16 rounded-full border-4 border-red-600 flex items-center justify-center">
          <X className="w-10 h-10 text-red-600 stroke-[3px]" />
        </div>
        <h2 className="text-white text-xl sm:text-2xl font-bold">
          Hubo un problema con tu pago
        </h2>
        <div className="w-full max-w-md border-t border-zinc-600" />
        <div className="flex flex-col gap-1">
          <p className="text-zinc-400 text-sm sm:text-base">
            Puede deberse a fondos insuficientes
          </p>
          <p className="text-zinc-400 text-sm sm:text-base">
            Comunicate con la entidad emisora de la tarjeta
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleRetry}
          className="h-14 w-full sm:w-auto sm:px-16 font-bold text-lg bg-primary text-black hover:bg-primary-hover shadow-lg rounded-xl transition-all duration-300"
        >
          Volver a intentarlo
        </Button>
      </div>
    </div>
  );
}
