"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profileStore";
import { cardService } from "@/services/cardService";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

const newCardSchema = z.object({
  number_id: z.preprocess(
    (val) => Number(String(val).replace(/\s/g, "")),
    z.number().min(1000000000000000, "Número de tarjeta inválido (mínimo 16 dígitos)")
  ),
  first_last_name: z.string().min(2, "El nombre del titular es obligatorio"),
  expiration_date: z
    .string()
    .regex(/^\d{2}\/\d{4}$/, "Formato inválido. Usa MM/YYYY"),
  cod: z.preprocess(
    (val) => Number(val),
    z.number().min(100, "CVV inválido").max(9999, "CVV inválido")
  ),
});

type NewCardFormValues = z.infer<typeof newCardSchema>;

// ── Card Preview Component ───────────────────────────────────────────────────
function CardPreview({
  number,
  name,
  expiry,
}: {
  number: string;
  name: string;
  expiry: string;
}) {
  const hasData = number.length > 0 || name.length > 0 || expiry.length > 0;

  // Format card number into 4-digit groups
  const formatNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    const groups = [];
    for (let i = 0; i < 4; i++) {
      const chunk = digits.slice(i * 4, (i + 1) * 4);
      groups.push(chunk.padEnd(4, "*").replace(/\*/g, hasData && chunk.length > 0 ? "0" : "*"));
    }
    // If no data at all, show **** for each group
    if (!digits) return ["****", "****", "****", "****"];
    // pad remaining groups with ****
    const result: string[] = [];
    for (let i = 0; i < 4; i++) {
      const chunk = digits.slice(i * 4, (i + 1) * 4);
      result.push(chunk || "****");
    }
    return result;
  };

  const numberGroups = formatNumber(number);

  return (
    <div
      className={`relative w-full max-w-[22rem] mx-auto aspect-[1.6/1] rounded-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden transition-all duration-500 select-none ${
        hasData
          ? "bg-gradient-to-br from-zinc-800 via-zinc-900 to-black shadow-xl"
          : "bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-200 shadow-md"
      }`}
    >
      {/* Chip + Brand */}
      <div className="flex justify-end">
        <div
          className={`w-10 h-7 rounded-sm ${
            hasData ? "bg-zinc-600" : "bg-zinc-400/60"
          }`}
        />
      </div>

      {/* Visa brand (only when has data) */}
      {hasData && (
        <span className="absolute top-4 right-5 text-white font-bold text-lg italic tracking-wider">
          VISA
        </span>
      )}

      {/* Card Number */}
      <div className="flex gap-3 sm:gap-5">
        {numberGroups.map((group, i) => (
          <span
            key={i}
            className={`text-base sm:text-lg font-mono font-bold tracking-wider ${
              hasData ? "text-white" : "text-zinc-500"
            }`}
          >
            {group}
          </span>
        ))}
      </div>

      {/* Name + Expiry */}
      <div className="flex items-end justify-between">
        <span
          className={`text-xs sm:text-sm font-semibold tracking-wide uppercase ${
            hasData ? "text-white" : "text-zinc-500"
          }`}
        >
          {name || "NOMBRE DEL TITULAR"}
        </span>
        <span
          className={`text-xs sm:text-sm font-semibold ${
            hasData ? "text-white" : "text-zinc-500"
          }`}
        >
          {expiry || "MM/YYYY"}
        </span>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function NewCardPage() {
  const router = useRouter();
  const { account } = useProfileStore();
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Live preview state
  const [liveNumber, setLiveNumber] = useState("");
  const [liveName, setLiveName] = useState("");
  const [liveExpiry, setLiveExpiry] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewCardFormValues>({
    resolver: zodResolver(newCardSchema),
  });

  const hasAnyInput = liveNumber.length > 0 || liveName.length > 0 || liveExpiry.length > 0;

  const onSubmit = async (data: NewCardFormValues) => {
    if (!account) return;
    setApiError(null);

    try {
      await cardService.createCard(account.id, {
        number_id: data.number_id,
        first_last_name: data.first_last_name,
        cod: data.cod,
        expiration_date: data.expiration_date,
      });
      setSuccess(true);
    } catch (error: unknown) {
      const status = (error as any)?.response?.status;
      if (status === 409) {
        setApiError("Esta tarjeta ya está registrada en tu cuenta.");
      } else {
        setApiError("Error al agregar la tarjeta. Revisá los datos e intenta nuevamente.");
      }
    }
  };

  // ── Success Screen ───────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6 items-center justify-center">
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
        <h1 className="text-2xl font-bold text-black text-center">
          Tarjeta agregada exitosamente
        </h1>
        <p className="text-zinc-500 text-center">
          Ya podés usar tu tarjeta para operar en Digital Money House.
        </p>
        <Button
          onClick={() => router.push("/cards")}
          className="h-12 w-full max-w-sm text-black bg-primary hover:bg-primary-hover font-bold mt-4"
        >
          Volver a Tarjetas
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-3xl mx-auto gap-6">
      {/* ── Breadcrumb ──────────────────────────────── */}
      <button
        onClick={() => router.push("/cards")}
        className="flex items-center gap-2 text-black hover:text-primary transition-colors self-start"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium text-lg">Tarjetas</span>
      </button>

      {/* ── Card Preview ───────────────────────────── */}
      <CardPreview number={liveNumber} name={liveName} expiry={liveExpiry} />

      {/* ── Form ───────────────────────────────────── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        {/* Number */}
        <div className="flex flex-col gap-1">
          <input
            placeholder="Número de la tarjeta*"
            type="text"
            inputMode="numeric"
            {...register("number_id", {
              onChange: (e) => setLiveNumber(e.target.value),
            })}
            className={`w-full px-4 py-3.5 rounded-xl border text-black placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${
              errors.number_id ? "border-dmh-error" : "border-zinc-300"
            }`}
          />
          {errors.number_id && (
            <span className="text-dmh-error text-xs ml-1">{errors.number_id.message}</span>
          )}
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <input
            placeholder="Nombre y apellido*"
            type="text"
            {...register("first_last_name", {
              onChange: (e) => setLiveName(e.target.value),
            })}
            className={`w-full px-4 py-3.5 rounded-xl border text-black placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${
              errors.first_last_name ? "border-dmh-error" : "border-zinc-300"
            }`}
          />
          {errors.first_last_name && (
            <span className="text-dmh-error text-xs ml-1">{errors.first_last_name.message}</span>
          )}
        </div>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <input
              placeholder="Fecha de vencimiento*"
              type="text"
              {...register("expiration_date", {
                onChange: (e) => setLiveExpiry(e.target.value),
              })}
              className={`w-full px-4 py-3.5 rounded-xl border text-black placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${
                errors.expiration_date ? "border-dmh-error" : "border-zinc-300"
              }`}
            />
            {errors.expiration_date && (
              <span className="text-dmh-error text-xs ml-1">{errors.expiration_date.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <input
              placeholder="Código de seguridad*"
              type="text"
              inputMode="numeric"
              {...register("cod")}
              className={`w-full px-4 py-3.5 rounded-xl border text-black placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${
                errors.cod ? "border-dmh-error" : "border-zinc-300"
              }`}
            />
            {errors.cod && (
              <span className="text-dmh-error text-xs ml-1">{errors.cod.message}</span>
            )}
          </div>
        </div>

        {apiError && (
          <p className="text-dmh-error text-sm text-center">{apiError}</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`h-12 w-full sm:w-auto sm:self-end sm:px-16 font-bold text-black transition-all duration-300 ${
            hasAnyInput
              ? "bg-primary hover:bg-primary-hover"
              : "bg-zinc-300 hover:bg-zinc-400 cursor-default"
          }`}
        >
          {isSubmitting ? "Agregando..." : "Continuar"}
        </Button>
      </form>
    </div>
  );
}
