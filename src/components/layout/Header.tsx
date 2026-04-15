import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="h-16 bg-background px-4 sm:px-8 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/Logo.png" alt="Digital Money House" width={80} height={30} className="object-contain" />
      </Link>

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
    </header>
  );
}
