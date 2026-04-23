"use client";

import { useRouter, useParams } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ServiceNotFoundPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.id);

  const handleReview = () => {
    router.push(`/services/${serviceId}/account`);
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
        <h2 className="text-white text-xl sm:text-2xl font-bold leading-snug">
          No encontramos facturas<br />asociadas a este dato
        </h2>
        <div className="w-full max-w-md border-t border-zinc-600" />
        <p className="text-zinc-400 text-sm sm:text-base max-w-md">
          Revisá el dato ingresado. Si es correcto, es posible que la empresa aún no haya cargado tu factura.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleReview}
          className="h-14 w-full sm:w-auto sm:px-16 font-bold text-lg bg-primary text-black hover:bg-primary-hover shadow-lg rounded-xl transition-all duration-300"
        >
          Revisar dato
        </Button>
      </div>
    </div>
  );
}
