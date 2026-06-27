"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { config } from "@/lib/config";
import { revalidatePath } from "next/cache";

export type ParamState = { status: "idle" } | { status: "success" } | { status: "error"; message: string };

export async function sauvegarderParametresAction(
  _prev: ParamState,
  formData: FormData
): Promise<ParamState> {
  const sms_active = formData.get("sms_active") === "on";
  const parrainage_actif = formData.get("parrainage_actif") === "on";
  const recompense_parrainage = (formData.get("recompense_parrainage") as string | null)?.trim() || null;
  const lien_avis_google = (formData.get("lien_avis_google") as string | null)?.trim() || null;

  const { error } = await createSupabaseAdminClient()
    .from("parametres_institut")
    .update({ sms_active, parrainage_actif, recompense_parrainage, lien_avis_google })
    .eq("institut_id", config.institut.id);

  if (error) return { status: "error", message: "Erreur lors de la sauvegarde." };
  revalidatePath("/admin/parametres");
  revalidatePath("/");
  return { status: "success" };
}
