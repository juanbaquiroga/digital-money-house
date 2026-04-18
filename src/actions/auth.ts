"use server";

import { cookies } from "next/headers";

const API_BASE = "https://digitalmoney.digitalhouse.com";
const COOKIE_NAME = "dmh-token";
const PROBE_PASSWORD = "_dmh_probe_!1A";

// ── Login ────────────────────────────────────────────────────────────────────
export async function loginAction(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const status = res.status;
      if (status === 401 || status === 403) {
        return { success: false, error: "Contraseña incorrecta." };
      }
      if (status === 404) {
        return { success: false, error: "No encontramos una cuenta con ese correo." };
      }
      return { success: false, error: "Ocurrió un error inesperado. Intenta de nuevo." };
    }

    const data = await res.json();
    const token: string = data.token;

    // Store token in HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, token };
  } catch {
    return { success: false, error: "Error de conexión con el servidor." };
  }
}

// ── Probe user existence ─────────────────────────────────────────────────────
export async function probeUserAction(
  email: string
): Promise<{ exists: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: PROBE_PASSWORD }),
    });

    const status = res.status;

    if (status === 404) {
      return { exists: false, error: "No encontramos una cuenta con ese correo electrónico." };
    }
    // 401/403 means user exists but password is wrong (expected with probe)
    // 200 means the probe password matched (unlikely but harmless)
    if (status === 401 || status === 403 || res.ok) {
      return { exists: true };
    }

    return { exists: false, error: "Ocurrió un error al verificar el correo. Intenta nuevamente." };
  } catch {
    return { exists: false, error: "Error de conexión con el servidor." };
  }
}

// ── Signup ────────────────────────────────────────────────────────────────────
export async function signupAction(payload: {
  firstname: string;
  lastname: string;
  dni: number;
  email: string;
  password: string;
  phone: string;
}): Promise<{ success: boolean; error?: string; status?: number }> {
  try {
    const res = await fetch(`${API_BASE}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { success: true };
    }

    const status = res.status;
    if (status === 409) {
      return { success: false, error: "El usuario ya existe. Por favor, inicia sesión.", status };
    }
    return { success: false, error: "Ocurrió un error al registrar el usuario. Intenta nuevamente.", status };
  } catch {
    return { success: false, error: "Error de conexión con el servidor." };
  }
}

// ── Logout ───────────────────────────────────────────────────────────────────
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ── Get token from cookie (for client hydration) ─────────────────────────────
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}
