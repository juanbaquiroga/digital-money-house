"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useServicePaymentStore } from "@/store/servicePaymentStore";
import { serviceService } from "@/services/serviceService";

export default function ServiceAccountPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.id);

  const { setSelectedService, setAccountNumber } = useServicePaymentStore();

  const [accountNum, setAccountNum] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!accountNum.trim()) {
      setError("Ingresá el número de cuenta.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const company = await serviceService.getServiceById(serviceId);

      if (!company || !company.invoice_value) {
        
        router.push(`/services/${serviceId}/not-found`);
        return;
      }

      setSelectedService(company);
      setAccountNumber(accountNum);
      router.push(`/services/${serviceId}/pay`);
    } catch (err: any) {
      console.error("Error fetching service:", err);
      
      router.push(`/services/${serviceId}/not-found`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6">
      
      <div className="flex items-center gap-2 md:hidden">
        <ArrowRight className="h-5 w-5 text-black" />
        <span className="font-bold text-black text-lg underline underline-offset-4">
          Pagar servicios
        </span>
      </div>

      <div className="bg-secondary-bg rounded-[1.25rem] p-6 sm:p-10 shadow-sm flex flex-col gap-6">
        <h2 className="text-primary text-xl sm:text-2xl font-bold leading-snug">
          Número de cuenta
          <br />
          sin el primer 2
        </h2>

        <input
          id="service-account-number"
          type="text"
          inputMode="numeric"
          value={accountNum}
          onChange={(e) => {
            
            const val = e.target.value.replace(/\D/g, "");
            setAccountNum(val);
            if (error) setError("");
          }}
          placeholder=""
          className="w-full sm:w-[60%] px-4 py-4 rounded-xl text-black text-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />

        {error && (
          <p className="text-dmh-error text-sm font-medium">{error}</p>
        )}

        <p className="hidden sm:block text-zinc-400 text-sm">
          Son 11 números sin espacios, sin el &quot;2&quot; inicial. Agregá
          ceros adelante si tenés menos.
        </p>

        <div className="hidden sm:flex sm:justify-end">
          <Button
            onClick={handleContinue}
            disabled={isSubmitting || !accountNum.trim()}
            className="h-14 px-16 font-bold text-lg bg-primary text-black hover:bg-primary-hover shadow-lg rounded-xl transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Buscando..." : "Continuar"}
          </Button>
        </div>
      </div>

      <div className="flex sm:hidden justify-end">
        <Button
          onClick={handleContinue}
          disabled={isSubmitting || !accountNum.trim()}
          className="h-14 px-12 font-bold text-lg bg-primary text-black hover:bg-primary-hover shadow-lg rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "Buscando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
