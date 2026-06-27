"use server";

import { redirect } from "next/navigation";
import { verifyClientePassword } from "@/lib/queries/cliente";
import { getSession } from "@/lib/session";

export type AuthState =
  | { status: "idle" }
  | { status: "error"; message: string };

export async function connexionAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    return { status: "error", message: "Email et mot de passe requis." };
  }

  const cliente = await verifyClientePassword(email, password);
  if (!cliente) {
    return { status: "error", message: "Email ou mot de passe incorrect." };
  }

  const session = await getSession();
  session.clienteId = cliente.id;
  session.clienteEmail = cliente.email ?? email;
  await session.save();

  redirect("/espace-client/tableau-de-bord");
}

export async function deconnexionAction() {
  const session = await getSession();
  session.destroy();
  redirect("/espace-client/connexion");
}
