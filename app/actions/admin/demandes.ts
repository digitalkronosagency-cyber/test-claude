"use server";

import { updateStatutDemande } from "@/lib/queries/admin";
import { revalidatePath } from "next/cache";

export async function updateStatutDemandeAction(formData: FormData) {
  const id = formData.get("id") as string;
  const statut = formData.get("statut") as string;
  if (!id || !["confirme", "annule"].includes(statut)) return;

  await updateStatutDemande(id, statut);
  revalidatePath("/admin/demandes-creneau");
}
