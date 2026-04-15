"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  const router = useRouter();
  const { token, logout, loginEmail } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/login");
    }
  }, [token, mounted, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!mounted || !token) {
    return <div className="flex-1 p-8 text-white">Cargando...</div>;
  }

  return (
    <div className="flex-1 w-full bg-surface-light flex flex-col items-center p-6 sm:p-12">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-black border-b-[3px] border-primary inline-block w-fit pb-1">
            Inicio
          </h1>
          <Button onClick={handleLogout} variant="outline" className="border-black text-black">
            Cerrar sesión
          </Button>
        </div>

        <Card className="bg-secondary-bg p-8 rounded-2xl flex flex-col gap-4">
          <p className="text-white text-lg">
            ¡Hola! Has iniciado sesión correctamente con:
          </p>
          <span className="text-primary font-bold text-xl">
            {loginEmail || "Usuario"}
          </span>
          <p className="text-zinc-400">
            Este es el dashboard inicial. En el próximo sprint desarrollaremos las funcionalidades completas de tarjetas, saldo y transferencias.
          </p>
        </Card>
      </div>
    </div>
  );
}
