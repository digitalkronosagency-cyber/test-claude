import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { config } from "@/lib/config";

// Profil de la cliente connectée (lookup par email)
export async function fetchClienteByEmail(email: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("clientes")
    .select("id, nom, prenom, email, telephone")
    .eq("email", email.toLowerCase())
    .eq("institut_id", config.institut.id)
    .single();

  if (error || !data) return null;
  return data;
}

// Forfaits actifs (avec infos du forfait parent)
export async function fetchForfaitsCliente(clienteId: string) {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("forfaits_clientes")
    .select(`
      id,
      seances_restantes,
      date_achat,
      date_expiration,
      forfaits (
        nom,
        nombre_seances_total
      )
    `)
    .eq("cliente_id", clienteId)
    .order("date_expiration", { ascending: true });

  return (data ?? []) as unknown as ForfaitCliente[];
}

// Historique complet des prestations
export async function fetchHistoriqueCliente(clienteId: string) {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("prestations_realisees")
    .select(`
      id,
      date_prestation,
      estheticienne,
      notes,
      forfaits_clientes (
        forfaits (nom)
      )
    `)
    .eq("cliente_id", clienteId)
    .order("date_prestation", { ascending: false });

  return (data ?? []) as unknown as PrestationRealisee[];
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface ForfaitCliente {
  id: string;
  seances_restantes: number;
  date_achat: string;
  date_expiration: string;
  forfaits: {
    nom: string;
    nombre_seances_total: number;
  } | null;
}

export interface PrestationRealisee {
  id: string;
  date_prestation: string;
  estheticienne: string | null;
  notes: string | null;
  forfaits_clientes: {
    forfaits: { nom: string } | null;
  } | null;
}

export interface ClienteProfile {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
}
