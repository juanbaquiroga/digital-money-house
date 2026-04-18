"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import { loginAction } from "@/actions/auth";

const loginPasswordSchema = z.object({
  password: z.string().min(6, "Usa entre 6 y 20 caracteres"),
});

type LoginPasswordFormValues = z.infer<typeof loginPasswordSchema>;

export default function LoginPasswordPage() {
  const router = useRouter();
  const { loginEmail, setToken } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!loginEmail) {
      router.push("/login");
    }
  }, [loginEmail, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPasswordFormValues>({
    resolver: zodResolver(loginPasswordSchema),
  });

  const onSubmit = async (data: LoginPasswordFormValues) => {
    setApiError(null);

    if (!loginEmail) return;

    const result = await loginAction(loginEmail, data.password);

    if (result.success && result.token) {
      // Store a copy of the token in Zustand for Axios interceptor
      setToken(result.token);
      router.push("/home");
    } else {
      setApiError(result.error ?? "Contraseña incorrecta.");
    }
  };

  if (!loginEmail) return null;

  return (
    <div className="flex-1 w-full bg-secondary-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-white mb-2">Ingresá tu contraseña</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
          <Input
            placeholder="Contraseña"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          
          <Button type="submit" disabled={isSubmitting} className="h-12 w-full text-black bg-primary hover:bg-primary-hover font-bold">
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </Button>

          {apiError && (
            <p className="text-dmh-error text-sm text-center">
              {apiError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
