"use server";

import { upsertForfait, toggleForfaitActif } from "@/lib/queries/admin";
import { revalidatePath } from "next/cache";

type ForfaitState = { status: "idle" } | { status: "success" } | { status: "error"; message: string };

export async function sauvegarderForfaitAction(
  _prev: ForfaitState,
  formData: FormData
): Promise<ForfaitState> {
  const id = formData.get("id") as string | null;
  const nom = (formData.get("nom") as string | null)?.trim();
  const seances = parseInt(formData.get("nombre_seances_total") as string);
  const prix = parseFloat(formData.get("prix") as string);
  const validite = parseInt(formData.get("duree_validite_jours") as string);

  if (!nom || isNaN(seances) || isNaN(prix) || isNaN(validite))
    return { status: "error", message: "Tous les champs sont requis." };
  if (seances < 1 || prix < 0 || validite < 1)
    return { status: "error", message: "Valeurs invalides." };

  try {
    await upsertForfait({ id: id || undefined, nom, nombre_seances_total: seances, prix, duree_validite_jours: validite });
    revalidatePath("/admin/forfaits");
    revalidatePath("/");
    return { status: "success" };
  } catch {
    return { status: "error", message: "Erreur lors de l'enregistrement." };
  }
}

export async function toggleForfaitActifAction(formData: FormData) {
  const id = formData.get("id") as string;
  const actif = formData.get("actif") === "true";
  if (!id) return;
  await toggleForfaitActif(id, !actif);
  revalidatePath("/admin/forfaits");
  revalidatePath("/");
}
