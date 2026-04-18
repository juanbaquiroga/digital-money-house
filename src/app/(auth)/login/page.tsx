"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import { probeUserAction } from "@/actions/auth";

const loginEmailSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
});

type LoginEmailFormValues = z.infer<typeof loginEmailSchema>;

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

    const result = await probeUserAction(data.email);

    if (result.exists) {
      setLoginEmail(data.email);
      router.push("/login/password");
    } else {
      setApiError(result.error ?? "No encontramos una cuenta con ese correo electrónico.");
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
