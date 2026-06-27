"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      status: "error",
      message:
        error.message.includes("Invalid")
          ? "Email ou mot de passe incorrect."
          : "Connexion impossible. Veuillez réessayer.",
    };
  }

  // redirect() doit être appelé hors du try/catch
  redirect("/espace-client/tableau-de-bord");
}

export async function deconnexionAction() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/espace-client/connexion");
}
