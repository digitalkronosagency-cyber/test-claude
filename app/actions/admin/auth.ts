"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/queries/admin";
import { redirect } from "next/navigation";

export type AdminAuthState = { status: "idle" } | { status: "error"; message: string };

export async function adminConnexionAction(
  _prev: AdminAuthState,
  formData: FormData
): Promise<AdminAuthState> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const password = formData.get("password") as string | null;
  if (!email || !password)
    return { status: "error", message: "Email et mot de passe requis." };

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error)
    return { status: "error", message: "Email ou mot de passe incorrect." };

  // Vérifier le rôle admin
  const ok = await isAdmin(email);
  if (!ok) {
    await supabase.auth.signOut();
    return { status: "error", message: "Accès non autorisé. Ce compte n'est pas gérante." };
  }

  redirect("/admin/clientes");
}

export async function adminDeconnexionAction() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/connexion");
}
