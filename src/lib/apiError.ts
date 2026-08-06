export function getErrorMessage(error: any): string {
  const data = error?.response?.data;
  if (!data) return "Erreur réseau. Vérifiez votre connexion.";
  if (typeof data.message === "string" && data.message) return data.message;
  if (data.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first)) return first[0] as string;
    if (typeof first === "string") return first;
  }
  return "Une erreur inattendue s'est produite.";
}
