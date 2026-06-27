"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateStatutDemandeAction(formData: FormData) {
  const id = formData.get("id") as string;
  const statut = formData.get("statut") as "confirme" | "annule";
  if (!id || !["confirme", "annule"].includes(statut)) return;

  await createSupabaseAdminClient()
    .from("demandes_creneau")
    .update({ statut })
    .eq("id", id);

  revalidatePath("/admin/demandes-creneau");
}
