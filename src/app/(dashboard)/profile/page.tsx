"use client";

import { useState } from "react";
import Link from "next/link";
import { useProfileStore } from "@/store/profileStore";
import { userService } from "@/services/userService";
import { ArrowRight, Pencil, Copy, Check } from "lucide-react";

type EditingField = "name" | "dni" | "phone" | "password" | null;

export default function ProfilePage() {
  const { user, account, isLoading } = useProfileStore();
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [editValue, setEditValue] = useState("");
  const [editValue2, setEditValue2] = useState(""); 
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<"cvu" | "alias" | null>(null);

  const handleStartEdit = (field: EditingField) => {
    setSaveError(null);
    if (!user) return;
    switch (field) {
      case "name":
        setEditValue(user.firstname);
        setEditValue2(user.lastname);
        break;
      case "dni":
        setEditValue(String(user.dni));
        setEditValue2("");
        break;
      case "phone":
        setEditValue(user.phone);
        setEditValue2("");
        break;
      case "password":
        setEditValue("");
        setEditValue2("");
        break;
    }
    setEditingField(field);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
    setEditValue2("");
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!user || !account) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      let updatePayload: Record<string, unknown> = {};

      switch (editingField) {
        case "name":
          if (!editValue.trim() || !editValue2.trim()) {
            setSaveError("Ambos campos son obligatorios.");
            setIsSaving(false);
            return;
          }
          updatePayload = { firstname: editValue.trim(), lastname: editValue2.trim() };
          break;
        case "dni":
          const dniNum = Number(editValue);
          if (isNaN(dniNum) || dniNum < 1000000) {
            setSaveError("DNI inválido.");
            setIsSaving(false);
            return;
          }
          updatePayload = { dni: dniNum };
          break;
        case "phone":
          if (editValue.trim().length < 8) {
            setSaveError("Teléfono inválido.");
            setIsSaving(false);
            return;
          }
          updatePayload = { phone: editValue.trim() };
          break;
        case "password":
          if (editValue.length < 6) {
            setSaveError("La contraseña debe tener al menos 6 caracteres.");
            setIsSaving(false);
            return;
          }
          if (editValue !== editValue2) {
            setSaveError("Las contraseñas no coinciden.");
            setIsSaving(false);
            return;
          }
          updatePayload = { password: editValue };
          break;
      }

      const updatedUser = await userService.updateUser(account.user_id, updatePayload);
      
      useProfileStore.setState({ user: updatedUser });
      handleCancelEdit();
    } catch {
      setSaveError("Error al guardar los cambios. Intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async (text: string, field: "cvu" | "alias") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {}
  };

  if (isLoading || !user || !account) {
    return (
      <div className="p-6 sm:p-10 text-black flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <p className="text-lg font-medium">Cargando tu perfil...</p>
      </div>
    );
  }

  const profileFields = [
    {
      label: "Email",
      value: user.email,
      editable: false,
      fieldKey: null as EditingField,
    },
    {
      label: "Nombre y apellido",
      value: `${user.firstname} ${user.lastname}`,
      editable: true,
      fieldKey: "name" as EditingField,
    },
    {
      label: "CUIT",
      value: String(user.dni),
      editable: true,
      fieldKey: "dni" as EditingField,
    },
    {
      label: "Teléfono",
      value: user.phone,
      editable: true,
      fieldKey: "phone" as EditingField,
    },
    {
      label: "Contraseña",
      value: "******",
      editable: true,
      fieldKey: "password" as EditingField,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto gap-6">
      
      <div className="flex items-center gap-2 text-black md:hidden">
        <ArrowRight className="w-5 h-5" />
        <span className="font-medium text-lg">Perfil</span>
      </div>

      <div className="bg-white rounded-[1.25rem] p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-black mb-6">Tus datos</h2>

        <div className="flex flex-col divide-y divide-zinc-200">
          {profileFields.map((field) => (
            <div
              key={field.label}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-2"
            >
              
              {editingField === field.fieldKey && field.fieldKey !== null ? (
                <div className="flex flex-col gap-3 w-full">
                  <span className="text-sm font-semibold text-zinc-500">{field.label}</span>

                  {field.fieldKey === "name" ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder="Apellido"
                        value={editValue2}
                        onChange={(e) => setEditValue2(e.target.value)}
                        className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ) : field.fieldKey === "password" ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={editValue2}
                        onChange={(e) => setEditValue2(e.target.value)}
                        className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ) : (
                    <input
                      type={field.fieldKey === "phone" ? "tel" : "text"}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full sm:max-w-xs px-4 py-2 border border-zinc-300 rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  )}

                  {saveError && (
                    <p className="text-dmh-error text-sm">{saveError}</p>
                  )}

                  <div className="flex gap-3 mt-1">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-5 py-2 rounded-lg bg-primary text-black font-semibold text-sm hover:bg-primary-hover transition-colors disabled:opacity-50"
                    >
                      {isSaving ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-5 py-2 rounded-lg border border-zinc-300 text-zinc-600 font-semibold text-sm hover:bg-zinc-100 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                                <>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-8 flex-1">
                    <span className="text-sm sm:text-base font-semibold text-black sm:min-w-[10rem]">
                      {field.label}
                    </span>
                    <span className="text-sm sm:text-base text-zinc-500">
                      {field.value}
                    </span>
                  </div>
                  {field.editable && (
                    <button
                      onClick={() => handleStartEdit(field.fieldKey)}
                      className="self-end sm:self-center p-2 text-zinc-400 hover:text-primary transition-colors"
                      aria-label={`Editar ${field.label}`}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/cards"
        className="flex items-center justify-between w-full bg-primary rounded-[1.25rem] px-6 py-5 sm:px-8 sm:py-6 shadow-sm group hover:bg-primary-hover transition-colors"
      >
        <span className="text-lg sm:text-xl font-bold text-black">
          Gestioná los medios de pago
        </span>
        <ArrowRight className="w-6 h-6 text-black" />
      </Link>

      <div className="bg-secondary-bg rounded-[1.25rem] p-6 sm:p-8 shadow-sm flex flex-col gap-4">
        <p className="text-white text-sm sm:text-base font-medium">
          Copia tu cvu o alias para ingresar o transferir dinero desde otra cuenta
        </p>

        <div className="flex items-center justify-between border-b border-zinc-700 pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-primary font-bold text-base sm:text-lg">CVU</span>
            <span className="text-white text-sm sm:text-base font-mono tracking-wide">
              {account.cvu}
            </span>
          </div>
          <button
            onClick={() => handleCopy(account.cvu, "cvu")}
            className="p-2 text-primary hover:text-primary-hover transition-colors"
            aria-label="Copiar CVU"
          >
            {copiedField === "cvu" ? (
              <Check className="w-6 h-6" />
            ) : (
              <Copy className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-primary font-bold text-base sm:text-lg">Alias</span>
            <span className="text-white text-sm sm:text-base">
              {account.alias}
            </span>
          </div>
          <button
            onClick={() => handleCopy(account.alias, "alias")}
            className="p-2 text-primary hover:text-primary-hover transition-colors"
            aria-label="Copiar Alias"
          >
            {copiedField === "alias" ? (
              <Check className="w-6 h-6" />
            ) : (
              <Copy className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
