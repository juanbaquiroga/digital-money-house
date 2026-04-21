"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useProfileStore } from "@/store/profileStore";
import { accountService } from "@/services/accountService";
import { Transaction } from "@/types";

/** Format date like "17 de agosto 2022 a 16:34 hs." */
function formatDetailDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `Creada el ${day} de ${month} ${year} a ${hours}:${minutes} hs.`;
}

/** Format amount like $1.266,57 */
function formatCurrency(amount: number): string {
  const abs = Math.abs(amount);
  return (
    "$" +
    abs.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/** Derive a human-readable description of the transaction type */
function getTransactionTypeLabel(tx: Transaction): string {
  if (tx.type === "Deposit" || tx.type === "deposit") {
    return "Depósito de dinero";
  }
  if (tx.type === "Transfer" || tx.type === "transfer") {
    return "Transferencia de dinero";
  }
  return tx.type || "Transacción";
}

/** Derive the destination label */
function getDestinationLabel(tx: Transaction): string | null {
  if (!tx.destination && !tx.description) return null;

  // If description starts with common patterns, extract the name
  const desc = tx.description || "";
  const transferMatch = desc.match(
    /(?:Transferiste a|Transferencia a|Le transferiste a)\s+(.+)/i
  );
  if (transferMatch) return transferMatch[1];

  // Use destination CVU/alias or description as fallback
  return tx.destination || desc;
}

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { account } = useProfileStore();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const transactionId = Number(params.id);

  useEffect(() => {
    if (!account) return;

    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const tx = await accountService.getTransaction(
          account.id,
          transactionId
        );
        setTransaction(tx);
      } catch (err: any) {
        console.error("Error fetching transaction:", err);
        setError("No pudimos cargar los detalles de esta transacción.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [account, transactionId]);

  const handleDownloadReceipt = () => {
    if (!transaction) return;

    // Build a simple text receipt and trigger download
    const typeLabel = getTransactionTypeLabel(transaction);
    const dest = getDestinationLabel(transaction);
    const dateLabel = formatDetailDate(transaction.dated);

    let receiptContent = `
═══════════════════════════════════════
       DIGITAL MONEY HOUSE
       Comprobante de operación
═══════════════════════════════════════

Estado: ✓ Aprobada
${dateLabel}

Tipo de operación: ${typeLabel}
Monto: ${formatCurrency(transaction.amount)}
${dest ? `Destinatario: ${dest}` : ""}
Número de operación: ${transaction.id}

═══════════════════════════════════════
    `.trim();

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comprobante_${transaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading || !account) {
    return (
      <div className="p-6 sm:p-10 text-black flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <h1 className="text-xl font-bold">Cargando detalle...</h1>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="p-6 sm:p-10 flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Link
            href="/activity"
            className="text-zinc-500 hover:text-black transition-colors"
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
          </Link>
          <h1 className="text-lg font-bold text-black underline underline-offset-4">
            Tu actividad
          </h1>
        </div>
        <div className="bg-white rounded-[1.25rem] p-6 shadow-sm text-center">
          <p className="text-dmh-error font-medium">{error || "Transacción no encontrada."}</p>
          <Link
            href="/activity"
            className="mt-4 inline-block text-primary font-bold hover:underline"
          >
            Volver a actividad
          </Link>
        </div>
      </div>
    );
  }

  const typeLabel = getTransactionTypeLabel(transaction);
  const destination = getDestinationLabel(transaction);

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2">
        <Link
          href="/activity"
          className="text-zinc-500 hover:text-black transition-colors"
        >
          <ArrowRight className="h-5 w-5 rotate-180" />
        </Link>
        <h1 className="text-lg font-bold text-black underline underline-offset-4">
          Tu actividad
        </h1>
      </div>

      {/* ── Transaction Detail Card ── */}
      <div
        ref={receiptRef}
        className="bg-secondary-bg rounded-[1.25rem] p-6 sm:p-8 flex flex-col gap-4 shadow-lg"
      >
        {/* Status row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-primary" />
            <span className="text-primary font-bold text-xl">Aprobada</span>
          </div>
          <span className="text-zinc-400 text-sm sm:text-base">
            {formatDetailDate(transaction.dated)}
          </span>
        </div>

        <hr className="border-zinc-600" />

        {/* Type & Amount */}
        <div className="flex flex-col gap-1 mt-2">
          <span className="text-white font-bold text-base">{typeLabel}</span>
          <span className="text-primary font-bold text-2xl sm:text-3xl">
            {formatCurrency(transaction.amount)}
          </span>
        </div>

        {/* Destination */}
        {destination && (
          <div className="flex flex-col gap-0.5 mt-2">
            <span className="text-zinc-400 text-sm">Le transferiste a</span>
            <span className="text-white font-bold text-lg sm:text-xl">
              {destination}
            </span>
          </div>
        )}

        {/* Operation number */}
        <div className="flex flex-col gap-0.5 mt-2">
          <span className="text-zinc-400 text-sm">Número de operación</span>
          <span className="text-primary font-medium text-base">
            {transaction.id}
          </span>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end">
        <button
          id="btn-go-home"
          onClick={() => router.push("/home")}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base text-black bg-zinc-200 hover:bg-zinc-300 transition-all duration-200"
        >
          Ir al inicio
        </button>
        <button
          id="btn-download-receipt"
          onClick={handleDownloadReceipt}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-200
            bg-primary text-black hover:bg-primary-hover shadow-md
            sm:bg-transparent sm:text-black sm:border-2 sm:border-primary sm:shadow-none sm:hover:bg-primary sm:hover:text-black"
        >
          Descargar comprobante
        </button>
      </div>
    </div>
  );
}
