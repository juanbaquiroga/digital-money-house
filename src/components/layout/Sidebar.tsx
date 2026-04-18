"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { logoutAction } from "@/actions/auth";

const navLinks = [
  { href: "/home", label: "Inicio" },
  { href: "/activity", label: "Actividad" },
  { href: "/profile", label: "Tu perfil" },
  { href: "/deposit", label: "Cargar dinero" },
  { href: "/services", label: "Pagar Servicios" },
  { href: "/cards", label: "Tarjetas" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const { clearProfile } = useProfileStore();

  const handleLogout = async () => {
    await logoutAction();
    logout();
    clearProfile();
    router.push("/");
  };

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-primary min-h-[calc(100vh-4rem-4rem)] p-8">
      <nav className="flex flex-col gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg transition-colors ${
                isActive ? "font-bold text-black" : "font-medium text-zinc-800 hover:text-black"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="text-lg font-medium text-zinc-600 hover:text-black mt-2 text-left transition-colors"
        >
          Cerrar sesión
        </button>
      </nav>
    </aside>
  );
}
