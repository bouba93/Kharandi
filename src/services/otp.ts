import { api } from "../config/api";

/**
 * Étape 1 — Envoie le code OTP par SMS.
 * @param phone  Numéro au format +224XXXXXXXXX
 */
export async function sendOTP(phone: string): Promise<void> {
  await api.post("/auth/otp/send/", { phone });
}

/**
 * Étape 2 — Vérifie le code et stocke les tokens JWT.
 * @param phone  Même numéro qu'à l'envoi
 * @param code   Code à 6 chiffres reçu par SMS
 */
export async function verifyOTP(phone: string, code: string) {
  const { data } = await api.post("/auth/otp/verify/", { phone, code });

  // Extraction extrêmement robuste des tokens JWT dans toutes les structures de réponse possibles
  let access = data?.data?.tokens?.access || data?.tokens?.access || data?.data?.access || data?.access;
  let refresh = data?.data?.tokens?.refresh || data?.tokens?.refresh || data?.data?.refresh || data?.refresh;

  // Si non trouvés, tester d'autres clés classiques
  if (!access) {
    access = data?.data?.access_token || data?.access_token || data?.data?.token || data?.token;
  }
  if (!refresh) {
    refresh = data?.data?.refresh_token || data?.refresh_token;
  }

  if (access && refresh) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  } else {
    console.warn("verifyOTP: Impossible de trouver les tokens JWT dans la réponse de l'API :", data);
  }

  const deviceToken = data?.data?.device_token || data?.device_token;
  if (deviceToken) {
    localStorage.setItem("kharandi_device_token", deviceToken);
  }

  return data?.data || data;
}

/** Connexion directe sans OTP */
export async function loginDirect(phone: string) {
  const { data } = await api.post("/auth/login/", { phone });
  
  let access = data?.data?.tokens?.access || data?.tokens?.access || data?.data?.access || data?.access;
  let refresh = data?.data?.tokens?.refresh || data?.tokens?.refresh || data?.data?.refresh || data?.refresh;
  
  if (!access) {
    access = data?.data?.access_token || data?.access_token || data?.data?.token || data?.token;
  }
  if (!refresh) {
    refresh = data?.data?.refresh_token || data?.refresh_token;
  }

  if (access && refresh) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }

  const deviceToken = data?.data?.device_token || data?.device_token;
  if (deviceToken) {
    localStorage.setItem("kharandi_device_token", deviceToken);
  }

  return data?.data || data;
}

