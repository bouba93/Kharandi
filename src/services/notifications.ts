import { api } from "../config/api";

export async function sendWelcomeNotification() {
  const { data } = await api.post("/notifications/welcome/");
  return data;
}

export async function sendCustomNotification(
  recipients: string[],
  message:    string,
  method:     "SMS" | "EMAIL" = "SMS"
) {
  const { data } = await api.post("/notifications/custom/", { recipients, message, method });
  return data;
}

export async function notifyNewMessage(phone: string, senderName: string) {
  return sendCustomNotification(
    [phone],
    `Kharandi : Vous avez reçu un nouveau message de ${senderName}. Connectez-vous pour y répondre !`
  );
}

export async function notifyOrderConfirmation(phone: string, orderId: string, total: number) {
  return sendCustomNotification(
    [phone],
    `Kharandi : Votre commande ${orderId} d'un montant de ${total} GNF a été confirmée avec succès.`
  );
}
