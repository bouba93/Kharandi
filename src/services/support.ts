import { api } from "../config/api";

export type TicketCategory = "PAIEMENT" | "TECHNIQUE" | "CONTENU" | "ABONNEMENT" | "AUTRE";
export type TicketStatus   = "OUVERT" | "EN_COURS" | "RESOLU" | "FERME";

export interface Ticket {
  id:          string;
  title:       string;
  description: string;
  category:    TicketCategory;
  status:      TicketStatus;
  priority:    1 | 2 | 3;
  replies:     Array<{ author_name: string; message: string; is_staff: boolean; created_at: string }>;
  created_at:  string;
}

export async function getTickets(status?: TicketStatus): Promise<Ticket[]> {
  const { data } = await api.get("/support/tickets/", {
    params: status ? { status } : {},
  });
  return data.data;
}

export async function createTicket(payload: {
  title:       string;
  description: string;
  category:    TicketCategory;
  priority?:   1 | 2 | 3;
}): Promise<Ticket> {
  const { data } = await api.post("/support/tickets/", payload);
  return data.data;
}

export async function replyToTicket(ticketId: string, message: string): Promise<Ticket> {
  const { data } = await api.patch(`/support/tickets/${ticketId}/`, { message });
  return data.data;
}
