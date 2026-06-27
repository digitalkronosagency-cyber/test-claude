"use server";

import { marquerPrestation } from "@/lib/queries/admin";
import { revalidatePath } from "next/cache";

export type PrestationState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export async function marquerPrestationAction(
  _prev: PrestationState,
  formData: FormData
): Promise<PrestationState> {
  const forfaitClienteId = formData.get("forfait_cliente_id") as string | null;
  const clienteId = formData.get("cliente_id") as string | null;
  const estheticienne = (formData.get("estheticienne") as string | null)?.trim();
  const notes = (formData.get("notes") as string | null)?.trim() || undefined;
  const dateStr = (formData.get("date_prestation") as string | null) || new Date().toISOString().split("T")[0];

  if (!forfaitClienteId || !clienteId || !estheticienne)
    return { status: "error", message: "Forfait et esthéticienne requis." };

  try {
    await marquerPrestation(forfaitClienteId, clienteId, dateStr, estheticienne, notes);
    revalidatePath(`/admin/clientes/${clienteId}`);
    revalidatePath("/admin/clientes");
    return { status: "success", message: "Prestation enregistrée et séance décomptée." };
  } catch (e) {
    const msg = e instanceof Error && e.message.includes("Aucune séance")
      ? "Ce forfait n'a plus de séances disponibles."
      : "Erreur lors de l'enregistrement.";
    return { status: "error", message: msg };
  }
}
