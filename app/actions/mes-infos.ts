"use server";

import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { config } from "@/lib/config";

export type MesInfosState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function mettreAJourInfosAction(
  _prev: MesInfosState,
  formData: FormData
): Promise<MesInfosState> {
  const nom = (formData.get("nom") as string | null)?.trim();
  const prenom = (formData.get("prenom") as string | null)?.trim();
  const telephone = (formData.get("telephone") as string | null)?.trim();

  if (!nom || !prenom) {
    return { status: "error", message: "Nom et prénom requis." };
  }

  // Récupérer l'utilisateur connecté
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return { status: "error", message: "Session expirée. Veuillez vous reconnecter." };
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("clientes")
    .update({ nom, prenom, telephone: telephone || null })
    .eq("email", user.email)
    .eq("institut_id", config.institut.id);

  if (error) {
    console.error("[mes-infos]", error);
    return { status: "error", message: "Erreur lors de la mise à jour." };
  }

  return { status: "success" };
}
