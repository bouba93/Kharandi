import { api } from "../config/api";

export interface Plan {
  id:       string;
  name:     string;
  period:   "GRATUIT" | "MENSUEL" | "ANNUEL";
  price:    number;
  currency: string;
  features: string[];
}

export interface SubscriptionStatus {
  is_premium: boolean;
  status:     string;
  plan:       Plan | null;
  end_date:   string | null;
}

export async function getPlans(): Promise<Plan[]> {
  const { data } = await api.get("/payments/plans/");
  return data.data;
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const { data } = await api.get("/payments/subscriptions/status/");
  return data.data;
}

export async function initiateSubscription(plan_id: string, currency = "GNF") {
  const { data } = await api.post("/payments/subscriptions/initiate/", {
    plan_id,
    currency,
  });
  return data.data;
}

export async function initiatePayment(payload: {
  amount:    number;
  currency?: string;
  order_id?: string;
  return_url?: string;
}) {
  const { data } = await api.post("/payments/initiate/", payload);
  return data.data;
}

export async function getTransactions() {
  const { data } = await api.get("/payments/transactions/");
  return data.data;
}
