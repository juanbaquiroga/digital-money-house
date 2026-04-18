"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { logoutAction } from "@/actions/auth";
import { Menu, X } from "lucide-react";

export function Header() {
  const { token, logout } = useAuthStore();
  const { user, clearProfile } = useProfileStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Delete the HttpOnly cookie server-side
    await logoutAction();
    // 2. Purge client state
    logout();
    clearProfile();
    setMobileMenuOpen(false);
    // 3. Redirect to landing
    router.push("/");
  };

  const getInitials = () => {
    if (!user) return "..";
    return `${user.firstname.charAt(0).toUpperCase()}${user.lastname.charAt(0).toUpperCase()}`;
  };

  const navLinks = [
    { href: "/home", label: "Inicio" },
    { href: "/activity", label: "Actividad" },
    { href: "/profile", label: "Tu perfil" },
    { href: "/deposit", label: "Cargar dinero" },
    { href: "/services", label: "Pago de servicios" },
    { href: "/cards", label: "Tarjetas" },
  ];

  return (
    <>
      <header className="h-16 bg-background px-4 sm:px-8 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <Link href={token ? "/home" : "/"} className="flex items-center gap-2">
          <Image src="/Logo.png" alt="Digital Money House" width={80} height={30} className="object-contain" />
        </Link>

        {/* --- Logged Out View --- */}
        {!token && (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-black font-semibold px-3 sm:px-6"
              >
                Ingresar
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-black font-semibold hover:bg-primary-hover px-3 sm:px-6">
                Crear cuenta
              </Button>
            </Link>
          </div>
        )}

        {/* --- Logged In View --- */}
        {token && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary text-black font-bold flex items-center justify-center text-sm">
                {getInitials()}
              </div>
              <span className="hidden md:inline-block text-white font-medium text-sm">
                Hola, {user ? `${user.firstname} ${user.lastname}` : "Cargando..."}
              </span>
            </div>
            
            <button 
              className="md:hidden text-primary p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
            >
              <Menu size={28} />
            </button>
          </div>
        )}
      </header>

      {/* --- Mobile Sidebar Overlay --- */}
      {token && mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-secondary-bg flex flex-col">
          <div className="h-16 bg-background px-4 flex items-center justify-between shadow-sm flex-shrink-0">
             <Link href="/home" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
               <Image src="/Logo.png" alt="Digital Money House" width={80} height={30} className="object-contain" />
             </Link>
             <button onClick={() => setMobileMenuOpen(false)} className="text-primary p-2" aria-label="Cerrar menú">
               <X size={28} />
             </button>
          </div>

          <div className="flex flex-col flex-1 bg-primary text-black px-6 py-8">
            <div className="flex flex-col gap-1 mb-8">
              <span className="text-lg font-bold">Hola,</span>
              <span className="text-xl font-bold">{user ? `${user.firstname} ${user.lastname}` : "Cargando..."}</span>
            </div>

            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg transition-colors ${isActive ? "font-bold text-black" : "font-medium text-zinc-800 hover:text-black"}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <button 
                onClick={handleLogout}
                className="text-lg font-medium text-zinc-600 hover:text-black text-left mt-4"
              >
                Cerrar sesión
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
