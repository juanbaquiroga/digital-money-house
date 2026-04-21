"use client";

import Link from "next/link";
import { UserCircle, CreditCard, ArrowRight } from "lucide-react";

export default function DepositPage() {
  return (
    <div className="w-full h-full flex flex-col px-4 py-8 sm:px-8 sm:py-12 max-w-5xl mx-auto gap-8">
      
      {/* Option 1: Transfer */}
      <Link 
        href="/deposit/transfer"
        className="w-full bg-secondary-bg rounded-[1.25rem] p-8 sm:p-12 flex items-center justify-between group shadow-xl hover:bg-neutral-800 transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex items-center gap-6 sm:gap-10">
          <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          <span className="text-xl sm:text-2xl font-bold text-primary transition-colors">
            Transferencia bancaria
          </span>
        </div>
        <ArrowRight className="w-8 h-8 text-primary group-hover:translate-x-2 transition-all" />
      </Link>

      {/* Option 2: Select Card */}
      <Link 
        href="/deposit/select-card"
        className="w-full bg-secondary-bg rounded-[1.25rem] p-8 sm:p-12 flex items-center justify-between group shadow-xl hover:bg-neutral-800 transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex items-center gap-6 sm:gap-10">
          <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          <span className="text-xl sm:text-2xl font-bold text-primary transition-colors">
            Seleccionar tarjeta
          </span>
        </div>
        <ArrowRight className="w-8 h-8 text-primary group-hover:translate-x-2 transition-all" />
      </Link>

    </div>
  );
}
