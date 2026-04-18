"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signupAction } from "@/actions/auth";

const registerSchema = z.object({
  firstname: z.string().min(2, "El nombre es obligatorio"),
  lastname: z.string().min(2, "El apellido es obligatorio"),
  dni: z.preprocess((val) => Number(val), z.number().min(1000000, "DNI inválido")),
  email: z.string().email("Correo electrónico inválido"),
  password: z
    .string()
    .min(6, "Usa entre 6 y 20 caracteres")
    .max(20)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
      "Debe contener al menos 1 carácter especial, una mayúscula y un número"
    ),
  confirmPassword: z.string(),
  phone: z.string().min(8, "Teléfono inválido"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setApiError(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...payload } = data;

    const result = await signupAction(payload);

    if (result.success) {
      setRegistered(true);
    } else {
      setApiError(result.error ?? "Ocurrió un error al registrar el usuario.");
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (registered) {
    return (
      <div className="flex-1 w-full bg-secondary-bg flex items-center justify-center p-4">
        <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">
          <div className="flex items-center justify-center w-28 h-28 rounded-full bg-primary shadow-[0_0_40px_var(--color-primary-glow)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 h-14 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-white leading-tight">
              ¡Te registraste <br />exitosamente!
            </h1>
            <p className="text-zinc-400 text-sm">
              Ya podés ingresar a tu cuenta con tu mail y contraseña.
            </p>
          </div>

          <Button
            type="button"
            id="btn-go-to-login"
            onClick={() => router.push("/login")}
            className="h-12 w-full text-black bg-primary hover:bg-primary-hover font-bold"
          >
            Ir al inicio de sesión
          </Button>
        </div>
      </div>
    );
  }

  // ── Registration form ───────────────────────────────────────────────────────
  return (
    <div className="flex-1 w-full bg-secondary-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold text-white mb-4">Crear cuenta</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Nombre*"
              {...register("firstname")}
              error={errors.firstname?.message}
            />
            <Input
              placeholder="Apellido*"
              {...register("lastname")}
              error={errors.lastname?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="DNI*"
              type="number"
              {...register("dni")}
              error={errors.dni?.message}
            />
            <Input
              placeholder="Correo electrónico*"
              type="email"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>

          <p className="text-zinc-400 text-sm my-2 text-center md:text-left">
            Usa entre 6 y 20 caracteres (debe contener al menos 1 carácter especial, una mayúscula y un número)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Contraseña*"
              type="password"
              {...register("password")}
              error={errors.password?.message}
            />
            <Input
              placeholder="Confirmar contraseña*"
              type="password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Teléfono*"
              type="tel"
              {...register("phone")}
              error={errors.phone?.message}
            />
            <div className="flex flex-col">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full text-black bg-primary hover:bg-primary-hover"
              >
                {isSubmitting ? "Cargando..." : "Crear cuenta"}
              </Button>
            </div>
          </div>

          {Object.keys(errors).length > 0 && !apiError && (
            <p className="text-dmh-error text-sm text-center italic mt-2">
              Completa los campos requeridos
            </p>
          )}

          {apiError && (
            <p className="text-dmh-error text-sm text-center mt-2">
              {apiError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
