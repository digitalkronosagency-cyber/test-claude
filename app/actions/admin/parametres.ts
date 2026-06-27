"use server";

import { fetchParametres, updateParametres } from "@/lib/queries/admin";
import { revalidatePath } from "next/cache";

export type ParamState = { status: "idle" } | { status: "success" } | { status: "error"; message: string };

export async function sauvegarderParametresAction(
  _prev: ParamState,
  formData: FormData
): Promise<ParamState> {
  const sms_active = formData.get("sms_active") === "on";
  const parrainage_actif = formData.get("parrainage_actif") === "on";
  const recompense_parrainage = (formData.get("recompense_parrainage") as string | null)?.trim() ?? "";
  const lien_avis_google = (formData.get("lien_avis_google") as string | null)?.trim() ?? "";

  const params = await fetchParametres();
  if (!params) return { status: "error", message: "Paramètres introuvables." };

  try {
    await updateParametres({ id: params.id, sms_active, parrainage_actif, recompense_parrainage, lien_avis_google });
    revalidatePath("/admin/parametres");
    revalidatePath("/");
    return { status: "success" };
  } catch {
    return { status: "error", message: "Erreur lors de la sauvegarde." };
  }
}
