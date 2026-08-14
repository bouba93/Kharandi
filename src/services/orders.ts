import { api } from "../config/api";

export interface CartItem {
  document_id?: string;
  name:         string;
  unit_price:   number;
  quantity:     number;
}

export async function createOrder(items: CartItem[], currency = "GNF") {
  const { data } = await api.post("/store/orders/create/", { items, currency });
  return data?.data || data;
}

export async function getOrders() {
  const { data } = await api.get("/store/orders/");
  return data?.data || data;
}
