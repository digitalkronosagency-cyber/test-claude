"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { config } from "@/lib/config";
import { revalidatePath } from "next/cache";

type EquipeState = { status: "idle" } | { status: "success" } | { status: "error"; message: string };

export async function sauvegarderEquipeAction(
  _prev: EquipeState,
  formData: FormData
): Promise<EquipeState> {
  const id = formData.get("id") as string | null;
  const nom = (formData.get("nom") as string | null)?.trim();
  const presentation = (formData.get("presentation") as string | null)?.trim() || null;
  const photo_url = (formData.get("photo_url") as string | null)?.trim() || null;

  if (!nom) return { status: "error", message: "Le nom est requis." };

  const db = createSupabaseAdminClient();
  const payload = { nom, presentation, photo_url };

  const { error } = id
    ? await db.from("equipe").update(payload).eq("id", id)
    : await db.from("equipe").insert({ ...payload, institut_id: config.institut.id });

  if (error) return { status: "error", message: "Erreur lors de l'enregistrement." };
  revalidatePath("/admin/equipe");
  revalidatePath("/");
  return { status: "success" };
}

export async function toggleEquipeActifAction(formData: FormData) {
  const id = formData.get("id") as string;
  const actif = formData.get("actif") === "true";
  if (!id) return;
  await createSupabaseAdminClient().from("equipe").update({ actif: !actif }).eq("id", id);
  revalidatePath("/admin/equipe");
  revalidatePath("/");
}
