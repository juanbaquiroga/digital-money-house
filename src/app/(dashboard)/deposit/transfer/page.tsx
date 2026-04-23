"use client";

import { useState } from "react";
import Link from "next/link";
import { useProfileStore } from "@/store/profileStore";
import { ArrowLeft, Copy, Check } from "lucide-react";

export default function DepositTransferPage() {
  const { account, isLoading } = useProfileStore();
  const [copiedField, setCopiedField] = useState<"cvu" | "alias" | null>(null);

  const handleCopy = async (text: string, field: "cvu" | "alias") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  if (isLoading || !account) {
    return (
      <div className="p-6 sm:p-10 text-black flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <p className="text-lg font-medium">Cargando datos de transferencia...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6 text-black">

      <Link 
        href="/deposit"
        className="flex items-center gap-2 text-black hover:text-primary transition-colors self-start"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium text-lg">Cargar dinero</span>
      </Link>

      <div className="bg-secondary-bg rounded-[1.25rem] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <p className="text-white text-base sm:text-lg font-medium">
          Copia tu cvu o alias para ingresar o transferir dinero desde otra cuenta
        </p>

        <div className="flex items-center justify-between border-b border-zinc-700 pb-6">
          <div className="flex flex-col gap-1">
            <span className="text-primary font-bold text-lg sm:text-xl">CVU</span>
            <span className="text-white text-base sm:text-lg font-mono tracking-wide">
              {account.cvu}
            </span>
          </div>
          <button
            onClick={() => handleCopy(account.cvu, "cvu")}
            className="p-2 text-primary hover:text-primary-hover transition-colors"
            aria-label="Copiar CVU"
          >
            {copiedField === "cvu" ? (
              <Check className="w-7 h-7" />
            ) : (
              <Copy className="w-7 h-7" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between pb-2">
          <div className="flex flex-col gap-1">
            <span className="text-primary font-bold text-lg sm:text-xl">Alias</span>
            <span className="text-white text-base sm:text-lg">
              {account.alias}
            </span>
          </div>
          <button
            onClick={() => handleCopy(account.alias, "alias")}
            className="p-2 text-primary hover:text-primary-hover transition-colors"
            aria-label="Copiar Alias"
          >
            {copiedField === "alias" ? (
              <Check className="w-7 h-7" />
            ) : (
              <Copy className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
