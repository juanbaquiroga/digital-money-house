"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";

const loginEmailSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
});

type LoginEmailFormValues = z.infer<typeof loginEmailSchema>;

// fake password used only to probe user existence.
// The API requires a non-empty password to validate the request
const PROBE_PASSWORD = "_dmh_probe_!1A";

export default function LoginEmailPage() {
  const router = useRouter();
  const setLoginEmail = useAuthStore((state) => state.setLoginEmail);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginEmailFormValues>({
    resolver: zodResolver(loginEmailSchema),
  });

  const onSubmit = async (data: LoginEmailFormValues) => {
    setApiError(null);
    try {
      // test login endpoint with dummy password
      await api.post("/api/login", {
        email: data.email,
        password: PROBE_PASSWORD,
      });
      setLoginEmail(data.email);
      router.push("/login/password");
    } catch (error: unknown) {
      const status = (error as any).response?.status;

      if (status === 404) {
        // User doesn't exist
        setApiError("No encontramos una cuenta con ese correo electrónico.");
      } else if (status === 401 || status === 403) {
        // User EXISTS
        setLoginEmail(data.email);
        router.push("/login/password");
      } else {
        setApiError("Ocurrió un error al verificar el correo. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="flex-1 w-full bg-secondary-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-white mb-2">¡Hola! Ingresá tu mail</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
          <Input
            id="login-email"
            placeholder="Correo electrónico*"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />

          {apiError && (
            <p className="text-dmh-error text-sm text-center -mt-2">
              {apiError}
            </p>
          )}

          <Button
            type="submit"
            id="btn-login-continue"
            disabled={isSubmitting}
            className="h-12 w-full text-black bg-primary hover:bg-primary-hover font-bold"
          >
            {isSubmitting ? "Verificando..." : "Continuar"}
          </Button>

          <Button
            type="button"
            id="btn-create-account"
            variant="outline"
            onClick={() => router.push("/register")}
            className="h-12 w-full text-black bg-white border-0 hover:bg-zinc-200 mt-2 font-bold"
          >
            Crear cuenta
          </Button>
        </form>
      </div>
    </div>
  );
}
