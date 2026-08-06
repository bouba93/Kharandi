/**
 * audit.ts — Logging des actions admin (sans Firebase)
 * Les actions sont loggées côté serveur via l'API Django.
 */
export async function logAdminAction(
  adminId:    string,
  adminPhone: string,
  action:     string,
  details:    string,
  targetId?:  string
): Promise<void> {
  // Log simple en console — le backend Django enregistre toutes les actions via ses logs
  console.info(`[ADMIN] ${adminPhone} — ${action}: ${details}${targetId ? ` (target: ${targetId})` : ''}`);
}
