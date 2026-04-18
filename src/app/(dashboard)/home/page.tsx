"use client";

import { useState } from "react";
import Link from "next/link";
import { useProfileStore } from "@/store/profileStore";
import { Button } from "@/components/ui/Button";
import { Search, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { account, activity, isLoading, error } = useProfileStore();
  const [searchTerm, setSearchTerm] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const filteredActivity = activity
    .filter((tx) =>
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5); // display only top 5

  if (isLoading || !account) {
    return (
      <div className="p-6 sm:p-10 text-black flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <h1 className="text-xl font-bold">Cargando tu información...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-10 text-dmh-error flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <h1 className="text-xl font-bold">Hubo un problema</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6">
      
      {/* --- Balance Card --- */}
      <div className="bg-secondary-bg rounded-[1.25rem] p-6 sm:p-8 flex flex-col shadow-lg relative overflow-hidden">
        <div className="flex justify-end gap-4 mb-4 text-white text-sm sm:text-base font-bold relative z-10 w-full mb-8">
          <Link href="/cards" className="hover:text-primary transition-colors cursor-pointer border-b border-transparent hover:border-primary">
            Ver tarjetas
          </Link>
          <Link href="/profile" className="hover:text-primary transition-colors cursor-pointer border-b border-transparent hover:border-primary">
            Ver CVU
          </Link>
        </div>
        
        <div className="flex flex-col relative z-10">
          <p className="text-white text-base sm:text-lg mb-2">Dinero disponible</p>
          <div className="border border-primary rounded-full px-6 py-2 pb-3 w-fit inline-block">
             <span className="text-2xl sm:text-4xl text-white font-bold tracking-tight">
               {formatCurrency(account.available_amount)}
             </span>
          </div>
        </div>
      </div>

      {/* --- Quick Actions --- */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link href="/deposit" className="w-full">
          <Button className="w-full h-16 sm:h-20 text-xl sm:text-2xl rounded-[1.25rem] bg-primary text-black font-bold hover:bg-primary-hover shadow-md">
            Cargar dinero
          </Button>
        </Link>
        <Link href="/services" className="w-full">
          <Button className="w-full h-16 sm:h-20 text-xl sm:text-2xl rounded-[1.25rem] bg-primary text-black font-bold hover:bg-primary-hover shadow-md">
            Pago de servicios
          </Button>
        </Link>
      </div>

      {/* --- Search Bar --- */}
      <div className="relative mt-2 shadow-sm rounded-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar en tu actividad"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-11 pr-3 py-4 border border-zinc-200 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-lg text-black"
        />
      </div>

      {/* --- Activity List --- */}
      <div className="bg-white rounded-[1.25rem] p-6 shadow-sm flex flex-col gap-2 relative mt-2">
        <h3 className="text-black font-bold text-lg mb-2 border-b border-zinc-200 pb-4">
          Tu actividad
        </h3>

        {filteredActivity.length === 0 ? (
          <p className="text-zinc-500 py-4 text-center">No hay actividad reciente.</p>
        ) : (
          <ul className="flex flex-col gap-0">
            {filteredActivity.map((tx, idx) => {
               // Render circle logic
               const isDeposit = tx.type === "deposit" || tx.amount > 0;
               const amountPrefix = isDeposit ? "+$" : "-$";
               const amountColor = isDeposit ? "text-primary border-primary" : "text-black border-red-500";
               const mathAmount = Math.abs(tx.amount);
              return (
                <li key={tx.id} className="flex justify-between items-center py-4 border-b border-zinc-200 last:border-0 last:pb-2">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-black sm:text-lg">{tx.description || tx.type}</span>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                     <span className="text-black font-medium sm:text-lg">
                       {amountPrefix} {mathAmount.toFixed(2).replace('.', ',')}
                     </span>
                     <span className="text-xs sm:text-sm text-zinc-400">
                       {new Date(tx.dated).toLocaleDateString()}
                     </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* --- View All Link --- */}
        <Link 
           href="/activity" 
           className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-200 w-full group cursor-pointer"
        >
          <span className="font-bold text-black group-hover:text-primary transition-colors">
            Ver toda tu actividad
          </span>
          <ArrowRight className="h-6 w-6 text-black group-hover:text-primary transition-colors" />
        </Link>
      </div>

    </div>
  );
}
