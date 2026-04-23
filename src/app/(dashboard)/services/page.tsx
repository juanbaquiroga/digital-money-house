"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { serviceService } from "@/services/serviceService";
import { Service } from "@/types";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceService
      .getServices()
      .then((data) => {
        setServices(data);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = searchTerm.trim()
    ? services.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : services;

  const handleSelect = (service: Service) => {
    router.push(`/services/${service.id}/account`);
  };

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6">
      
      <div className="flex items-center gap-2 md:hidden">
        <ArrowRight className="h-5 w-5 text-black" />
        <span className="font-bold text-black text-lg underline underline-offset-4">
          Pagar servicios
        </span>
      </div>

      <div className="relative shadow-sm rounded-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="services-search"
          type="text"
          placeholder="Buscá entre más de 5.000 empresas"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-11 pr-3 py-4 border border-zinc-200 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-lg text-black"
        />
      </div>

      <div className="bg-white rounded-[1.25rem] p-6 shadow-sm flex flex-col gap-0">
        <h3 className="text-black font-bold text-lg mb-4">Más recientes</h3>

        {loading ? (
          <p className="text-zinc-500 py-6 text-center">
            Cargando servicios...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-zinc-500 py-6 text-center">
            No se encontraron servicios.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-zinc-100">
            {filtered.map((service) => (
              <li
                key={`${service.id}-${service.name}`}
                className="flex items-center justify-between py-5 group"
              >
                <div className="flex items-center gap-4">
                  
                  <ServiceLogo name={service.name} />
                  <span className="text-black font-medium sm:text-lg">
                    {service.name}
                  </span>
                </div>
                <button
                  onClick={() => handleSelect(service)}
                  className="text-black font-bold text-sm sm:text-base hover:text-primary transition-colors cursor-pointer"
                >
                  Seleccionar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ServiceLogo({ name }: { name: string }) {
  
  const brandColors: Record<string, { bg: string; text: string }> = {
    claro: { bg: "#E30613", text: "#FFFFFF" },
    personal: { bg: "#0097D6", text: "#FFFFFF" },
    cablevisión: { bg: "#C4122F", text: "#FFFFFF" },
    cablevision: { bg: "#C4122F", text: "#FFFFFF" },
    movistar: { bg: "#019DF4", text: "#FFFFFF" },
    telecom: { bg: "#00AEEF", text: "#FFFFFF" },
    edenor: { bg: "#009A44", text: "#FFFFFF" },
    edesur: { bg: "#003DA5", text: "#FFFFFF" },
    metrogas: { bg: "#FF6600", text: "#FFFFFF" },
    aysa: { bg: "#0072CE", text: "#FFFFFF" },
  };

  const key = name.toLowerCase().trim();
  const brand = brandColors[key];

  if (brand) {
    return (
      <div
        className="w-12 h-8 sm:w-14 sm:h-9 rounded flex items-center justify-center text-xs sm:text-sm font-bold shrink-0"
        style={{ backgroundColor: brand.bg, color: brand.text }}
      >
        {name.length <= 8 ? name : name.slice(0, 6)}
      </div>
    );
  }

  const hue = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
      style={{ backgroundColor: `hsl(${hue}, 60%, 45%)` }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
