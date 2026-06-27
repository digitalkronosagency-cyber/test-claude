"use server";

import { upsertEquipe, toggleEquipeActif } from "@/lib/queries/admin";
import { revalidatePath } from "next/cache";

type EquipeState = { status: "idle" } | { status: "success" } | { status: "error"; message: string };

export async function sauvegarderEquipeAction(
  _prev: EquipeState,
  formData: FormData
): Promise<EquipeState> {
  const id = formData.get("id") as string | null;
  const nom = (formData.get("nom") as string | null)?.trim();
  const presentation = (formData.get("presentation") as string | null)?.trim() || undefined;
  const photo_url = (formData.get("photo_url") as string | null)?.trim() || undefined;

  if (!nom) return { status: "error", message: "Le nom est requis." };

  try {
    await upsertEquipe({ id: id || undefined, nom, presentation, photo_url });
    revalidatePath("/admin/equipe");
    revalidatePath("/");
    return { status: "success" };
  } catch {
    return { status: "error", message: "Erreur lors de l'enregistrement." };
  }
}

export async function toggleEquipeActifAction(formData: FormData) {
  const id = formData.get("id") as string;
  const actif = formData.get("actif") === "true";
  if (!id) return;
  await toggleEquipeActif(id, !actif);
  revalidatePath("/admin/equipe");
  revalidatePath("/");
}
