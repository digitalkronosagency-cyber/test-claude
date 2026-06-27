"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { config } from "@/lib/config";
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

  const db = createSupabaseAdminClient();
  const payload = { nom, nombre_seances_total: seances, prix, duree_validite_jours: validite };

  const { error } = id
    ? await db.from("forfaits").update(payload).eq("id", id)
    : await db.from("forfaits").insert({ ...payload, institut_id: config.institut.id });

  if (error) return { status: "error", message: "Erreur lors de l'enregistrement." };
  revalidatePath("/admin/forfaits");
  revalidatePath("/");
  return { status: "success" };
}

export async function toggleForfaitActifAction(formData: FormData) {
  const id = formData.get("id") as string;
  const actif = formData.get("actif") === "true";
  if (!id) return;
  await createSupabaseAdminClient().from("forfaits").update({ actif: !actif }).eq("id", id);
  revalidatePath("/admin/forfaits");
  revalidatePath("/");
}
