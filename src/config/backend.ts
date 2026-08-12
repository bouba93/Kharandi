/**
 * backend.ts — Configuration centralisée backend Django Kharandi
 * Toutes les URLs pointent vers Django (Xano/Firebase supprimés).
 */
export const BASE_API_URL         = import.meta.env.VITE_API_URL || "http://212.95.33.158/api/v1";
export const API_URL              = BASE_API_URL;
export const XANO_API_URL         = BASE_API_URL;
export const RENDER_API_URL       = BASE_API_URL;
export const OTP_API_URL          = `${BASE_API_URL}/auth`;
export const PAYMENT_API_URL      = `${BASE_API_URL}/payments`;
export const SUBSCRIPTION_API_URL = `${BASE_API_URL}/payments/subscriptions`;
