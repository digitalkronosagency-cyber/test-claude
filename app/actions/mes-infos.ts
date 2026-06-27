"use server";

import { updateClienteInfos } from "@/lib/queries/cliente";
import { getSession } from "@/lib/session";

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
  const telephone = (formData.get("telephone") as string | null)?.trim() ?? "";

  if (!nom || !prenom) {
    return { status: "error", message: "Nom et prénom requis." };
  }

  const session = await getSession();
  if (!session.clienteId) {
    return { status: "error", message: "Session expirée. Veuillez vous reconnecter." };
  }

  try {
    await updateClienteInfos(session.clienteId, { nom, prenom, telephone });
    return { status: "success" };
  } catch {
    return { status: "error", message: "Erreur lors de la mise à jour." };
  }
}
