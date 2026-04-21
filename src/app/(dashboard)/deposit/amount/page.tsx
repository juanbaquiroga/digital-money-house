"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDepositStore } from "@/store/depositStore";

export default function DepositAmountPage() {
  const router = useRouter();
  const { setAmount, amount: initialAmount, selectedCard } = useDepositStore();
  const [inputValue, setInputValue] = useState(initialAmount > 0 ? initialAmount.toString() : "");

  useEffect(() => {
    if (!selectedCard) {
      router.push("/deposit/select-card");
    }
  }, [selectedCard, router]);

  const handleContinue = () => {
    const num = parseFloat(inputValue);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
      router.push("/deposit/review");
    }
  };

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6 text-black">
      
      {/* breadcrumb */}
      <Link 
        href="/deposit/select-card"
        className="flex items-center gap-2 text-black hover:text-primary transition-colors self-start"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium text-lg">Cargar dinero</span>
      </Link>

      <div className="bg-secondary-bg rounded-[1.25rem] p-8 sm:p-10 shadow-sm flex flex-col gap-6">
        <h2 className="text-primary text-xl sm:text-2xl font-bold">
          ¿Cuánto querés ingresar a la cuenta?
        </h2>

        <div className="flex flex-col gap-2">
          <div className="bg-white rounded-xl overflow-hidden px-4 py-3 border border-zinc-200">
            <input 
              type="number"
              placeholder="$0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full text-lg sm:text-xl font-medium focus:outline-none placeholder-zinc-300"
            />
          </div>
        </div>

        <Button 
          onClick={handleContinue}
          disabled={!inputValue || parseFloat(inputValue) <= 0}
          className="h-14 w-full sm:w-auto sm:px-20 sm:self-end font-bold text-lg bg-primary text-black hover:bg-primary-hover shadow-lg rounded-xl transition-all duration-300 disabled:bg-zinc-400 disabled:opacity-70"
        >
          Continuar
        </Button>
      </div>


    </div>
  );
}
