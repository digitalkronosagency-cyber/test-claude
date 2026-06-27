"use server";

import { insertDemandeCreneau } from "@/lib/queries/admin";

export type DemandeCreneauState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function soumettreDemandeCreneauAction(
  _prev: DemandeCreneauState,
  formData: FormData
): Promise<DemandeCreneauState> {
  const nom = (formData.get("nom") as string | null)?.trim();
  const telephone = (formData.get("telephone") as string | null)?.trim();
  const disponibilite = (formData.get("disponibilite") as string | null)?.trim();

  if (!nom || !telephone || !disponibilite) {
    return { status: "error", message: "Tous les champs sont requis." };
  }

  if (!/^[\d\s\+\.\-()]{6,20}$/.test(telephone)) {
    return { status: "error", message: "Numéro de téléphone invalide." };
  }

  try {
    await insertDemandeCreneau({ nomDemandeur: nom, telephoneDemandeur: telephone, disponibilite });
    return { status: "success" };
  } catch {
    return { status: "error", message: "Une erreur est survenue. Merci de réessayer ou de nous appeler directement." };
  }
}
