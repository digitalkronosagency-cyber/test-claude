"use server";

import { redirect } from "next/navigation";
import { verifyAdminPassword, isAdmin } from "@/lib/queries/admin";
import { getSession } from "@/lib/session";

export type AdminAuthState = { status: "idle" } | { status: "error"; message: string };

export async function adminConnexionAction(
  _prev: AdminAuthState,
  formData: FormData
): Promise<AdminAuthState> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const password = formData.get("password") as string | null;
  if (!email || !password)
    return { status: "error", message: "Email et mot de passe requis." };

  const ok = await verifyAdminPassword(email, password);
  if (!ok) return { status: "error", message: "Email ou mot de passe incorrect." };

  const admin = await isAdmin(email);
  if (!admin) return { status: "error", message: "Accès non autorisé. Ce compte n'est pas gérante." };

  const session = await getSession();
  session.adminEmail = email;
  await session.save();

  redirect("/admin/clientes");
}

export async function adminDeconnexionAction() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/connexion");
}
