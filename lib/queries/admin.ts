import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { config } from "@/lib/config";

const iid = () => config.institut.id;

// ── Auth ────────────────────────────────────────────────────────────────────

export async function isAdmin(email: string): Promise<boolean> {
  const { data } = await createSupabaseAdminClient()
    .from("admins")
    .select("id")
    .eq("email", email.toLowerCase())
    .eq("institut_id", iid())
    .maybeSingle();
  return !!data;
}

// ── Clientes ────────────────────────────────────────────────────────────────

export async function fetchAllClientes(): Promise<ClienteRow[]> {
  const { data } = await createSupabaseAdminClient()
    .from("clientes")
    .select(`
      id, nom, prenom, email, telephone,
      forfaits_clientes (
        id, seances_restantes, date_expiration,
        forfaits ( nom )
      )
    `)
    .eq("institut_id", iid())
    .order("nom")
    .order("prenom");
  return (data ?? []) as unknown as ClienteRow[];
}

export async function fetchClienteDetail(clienteId: string): Promise<ClienteDetail | null> {
  const { data } = await createSupabaseAdminClient()
    .from("clientes")
    .select(`
      id, nom, prenom, email, telephone,
      forfaits_clientes (
        id, seances_restantes, date_achat, date_expiration,
        forfaits ( id, nom, nombre_seances_total )
      ),
      prestations_realisees (
        id, date_prestation, estheticienne, notes,
        forfaits_clientes ( forfaits ( nom ) )
      )
    `)
    .eq("id", clienteId)
    .eq("institut_id", iid())
    .single();
  return data as unknown as ClienteDetail | null;
}

// ── Demandes créneaux ────────────────────────────────────────────────────────

export async function fetchDemandesCreneau(): Promise<DemandeRow[]> {
  const { data } = await createSupabaseAdminClient()
    .from("demandes_creneau")
    .select(`
      id, nom_demandeur, telephone_demandeur,
      disponibilite_souhaitee, statut, created_at,
      clientes ( nom, prenom )
    `)
    .eq("institut_id", iid())
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as DemandeRow[];
}

export async function countDemandesEnAttente(): Promise<number> {
  const { count } = await createSupabaseAdminClient()
    .from("demandes_creneau")
    .select("id", { count: "exact", head: true })
    .eq("institut_id", iid())
    .eq("statut", "en_attente");
  return count ?? 0;
}

// ── Forfaits catalogue ───────────────────────────────────────────────────────

export async function fetchForfaitsCatalogue() {
  const { data } = await createSupabaseAdminClient()
    .from("forfaits")
    .select("id, nom, nombre_seances_total, prix, duree_validite_jours, actif")
    .eq("institut_id", iid())
    .order("actif", { ascending: false })
    .order("prix");
  return data ?? [];
}

// ── Équipe ───────────────────────────────────────────────────────────────────

export async function fetchEquipe() {
  const { data } = await createSupabaseAdminClient()
    .from("equipe")
    .select("id, nom, presentation, photo_url, actif")
    .eq("institut_id", iid())
    .order("actif", { ascending: false })
    .order("nom");
  return data ?? [];
}

// ── Paramètres ───────────────────────────────────────────────────────────────

export async function fetchParametres() {
  const { data } = await createSupabaseAdminClient()
    .from("parametres_institut")
    .select("id, sms_active, parrainage_actif, recompense_parrainage, lien_avis_google")
    .eq("institut_id", iid())
    .single();
  return data;
}

// ── Types utiles ─────────────────────────────────────────────────────────────

export type ForfaitCatalogueRow = Awaited<ReturnType<typeof fetchForfaitsCatalogue>>[number];
export type EquipeRow = Awaited<ReturnType<typeof fetchEquipe>>[number];

// ── Typed interfaces for joined queries ──────────────────────────────────────

export interface ClienteForfaitItem {
  id: string;
  seances_restantes: number;
  date_expiration: string;
  forfaits: { nom: string } | null;
}

export interface ClienteRow {
  id: string;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string | null;
  forfaits_clientes: ClienteForfaitItem[];
}

export interface ClienteDetailForfait {
  id: string;
  seances_restantes: number;
  date_achat: string;
  date_expiration: string;
  forfaits: { id: string; nom: string; nombre_seances_total: number } | null;
}

export interface ClienteDetailPrestation {
  id: string;
  date_prestation: string;
  estheticienne: string | null;
  notes: string | null;
  forfaits_clientes: { forfaits: { nom: string } | null } | null;
}

export interface ClienteDetail {
  id: string;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string | null;
  forfaits_clientes: ClienteDetailForfait[];
  prestations_realisees: ClienteDetailPrestation[];
}

export interface DemandeRow {
  id: string;
  nom_demandeur: string;
  telephone_demandeur: string;
  disponibilite_souhaitee: string;
  statut: string;
  created_at: string;
  clientes: { nom: string; prenom: string } | null;
}
