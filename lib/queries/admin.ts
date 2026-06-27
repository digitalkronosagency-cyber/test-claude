import pool from "@/lib/db";
import { config } from "@/lib/config";

const iid = () => config.institut.id;

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function isAdmin(email: string): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT id FROM admins WHERE email=$1 AND institut_id=$2 LIMIT 1`,
    [email.toLowerCase(), iid()]
  );
  return rows.length > 0;
}

export async function verifyAdminPassword(email: string, password: string): Promise<boolean> {
  const bcrypt = await import("bcryptjs");
  const { rows } = await pool.query(
    `SELECT password_hash FROM admins WHERE email=$1 AND institut_id=$2 LIMIT 1`,
    [email.toLowerCase(), iid()]
  );
  if (!rows[0]?.password_hash) return false;
  return bcrypt.compare(password, rows[0].password_hash);
}

// ── Clientes ─────────────────────────────────────────────────────────────────

export interface ClienteForfaitItem {
  id: string;
  seances_restantes: number;
  date_expiration: string;
  forfait_nom: string;
}

export interface ClienteRow {
  id: string;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string | null;
  forfaits: ClienteForfaitItem[];
}

export async function fetchAllClientes(): Promise<ClienteRow[]> {
  const { rows: clientes } = await pool.query(
    `SELECT id, nom, prenom, email, telephone FROM clientes
     WHERE institut_id=$1 ORDER BY nom, prenom`,
    [iid()]
  );
  if (clientes.length === 0) return [];

  const ids = clientes.map((c: { id: string }) => c.id);
  const { rows: fcs } = await pool.query(
    `SELECT fc.id, fc.cliente_id, fc.seances_restantes, fc.date_expiration::text, f.nom AS forfait_nom
     FROM forfaits_clientes fc JOIN forfaits f ON f.id=fc.forfait_id
     WHERE fc.cliente_id = ANY($1)`,
    [ids]
  );

  const fcByCliente: Record<string, ClienteForfaitItem[]> = {};
  for (const fc of fcs) {
    if (!fcByCliente[fc.cliente_id]) fcByCliente[fc.cliente_id] = [];
    fcByCliente[fc.cliente_id].push({
      id: fc.id, seances_restantes: fc.seances_restantes,
      date_expiration: fc.date_expiration, forfait_nom: fc.forfait_nom,
    });
  }

  return clientes.map((c: ClienteRow) => ({ ...c, forfaits: fcByCliente[c.id] ?? [] }));
}

export interface ClienteDetailForfait {
  id: string;
  seances_restantes: number;
  date_achat: string;
  date_expiration: string;
  forfait_id: string;
  forfait_nom: string;
  nombre_seances_total: number;
}

export interface ClienteDetailPrestation {
  id: string;
  date_prestation: string;
  estheticienne: string | null;
  notes: string | null;
  forfait_nom: string | null;
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

export async function fetchClienteDetail(clienteId: string): Promise<ClienteDetail | null> {
  const { rows } = await pool.query(
    `SELECT id, nom, prenom, email, telephone FROM clientes WHERE id=$1 AND institut_id=$2`,
    [clienteId, iid()]
  );
  if (!rows[0]) return null;
  const cliente = rows[0];

  const { rows: fcs } = await pool.query(
    `SELECT fc.id, fc.seances_restantes, fc.date_achat::text, fc.date_expiration::text,
            fc.forfait_id, f.nom AS forfait_nom, f.nombre_seances_total
     FROM forfaits_clientes fc JOIN forfaits f ON f.id=fc.forfait_id
     WHERE fc.cliente_id=$1 ORDER BY fc.date_achat DESC`,
    [clienteId]
  );

  const { rows: prestations } = await pool.query(
    `SELECT pr.id, pr.date_prestation::text, pr.estheticienne, pr.notes, f.nom AS forfait_nom
     FROM prestations_realisees pr
     LEFT JOIN forfaits_clientes fc ON fc.id=pr.forfait_clientes_id
     LEFT JOIN forfaits f ON f.id=fc.forfait_id
     WHERE pr.cliente_id=$1 ORDER BY pr.date_prestation DESC`,
    [clienteId]
  );

  return { ...cliente, forfaits_clientes: fcs, prestations_realisees: prestations };
}

// ── Demandes ─────────────────────────────────────────────────────────────────

export interface DemandeRow {
  id: string;
  nom_demandeur: string;
  telephone_demandeur: string;
  disponibilite_souhaitee: string;
  statut: string;
  created_at: string;
  cliente_nom: string | null;
  cliente_prenom: string | null;
}

export async function fetchDemandesCreneau(): Promise<DemandeRow[]> {
  const { rows } = await pool.query(
    `SELECT d.id, d.nom_demandeur, d.telephone_demandeur, d.disponibilite_souhaitee,
            d.statut, d.created_at, c.nom AS cliente_nom, c.prenom AS cliente_prenom
     FROM demandes_creneau d
     LEFT JOIN clientes c ON c.id=d.cliente_id
     WHERE d.institut_id=$1
     ORDER BY d.created_at DESC`,
    [iid()]
  );
  return rows;
}

export async function countDemandesEnAttente(): Promise<number> {
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM demandes_creneau WHERE institut_id=$1 AND statut='en_attente'`,
    [iid()]
  );
  return parseInt(rows[0].count, 10);
}

export async function updateStatutDemande(id: string, statut: string) {
  await pool.query(
    `UPDATE demandes_creneau SET statut=$1 WHERE id=$2 AND institut_id=$3`,
    [statut, id, iid()]
  );
}

// ── Forfaits catalogue ────────────────────────────────────────────────────────

export interface ForfaitCatalogueRow {
  id: string;
  nom: string;
  nombre_seances_total: number;
  prix: number;
  duree_validite_jours: number;
  actif: boolean;
}

export async function fetchForfaitsCatalogue(): Promise<ForfaitCatalogueRow[]> {
  const { rows } = await pool.query(
    `SELECT id, nom, nombre_seances_total, prix, duree_validite_jours, actif
     FROM forfaits WHERE institut_id=$1
     ORDER BY actif DESC, prix`,
    [iid()]
  );
  return rows;
}

export async function upsertForfait(data: {
  id?: string; nom: string; nombre_seances_total: number; prix: number; duree_validite_jours: number;
}) {
  if (data.id) {
    await pool.query(
      `UPDATE forfaits SET nom=$1, nombre_seances_total=$2, prix=$3, duree_validite_jours=$4
       WHERE id=$5 AND institut_id=$6`,
      [data.nom, data.nombre_seances_total, data.prix, data.duree_validite_jours, data.id, iid()]
    );
  } else {
    await pool.query(
      `INSERT INTO forfaits (institut_id, nom, nombre_seances_total, prix, duree_validite_jours)
       VALUES ($1,$2,$3,$4,$5)`,
      [iid(), data.nom, data.nombre_seances_total, data.prix, data.duree_validite_jours]
    );
  }
}

export async function toggleForfaitActif(id: string, actif: boolean) {
  await pool.query(`UPDATE forfaits SET actif=$1 WHERE id=$2 AND institut_id=$3`, [actif, id, iid()]);
}

// ── Équipe ───────────────────────────────────────────────────────────────────

export interface EquipeRow {
  id: string;
  nom: string;
  presentation: string | null;
  photo_url: string | null;
  actif: boolean;
}

export async function fetchEquipe(): Promise<EquipeRow[]> {
  const { rows } = await pool.query(
    `SELECT id, nom, presentation, photo_url, actif FROM equipe
     WHERE institut_id=$1 ORDER BY actif DESC, nom`,
    [iid()]
  );
  return rows;
}

export async function upsertEquipe(data: {
  id?: string; nom: string; presentation?: string; photo_url?: string;
}) {
  if (data.id) {
    await pool.query(
      `UPDATE equipe SET nom=$1, presentation=$2, photo_url=$3 WHERE id=$4 AND institut_id=$5`,
      [data.nom, data.presentation ?? null, data.photo_url ?? null, data.id, iid()]
    );
  } else {
    await pool.query(
      `INSERT INTO equipe (institut_id, nom, presentation, photo_url) VALUES ($1,$2,$3,$4)`,
      [iid(), data.nom, data.presentation ?? null, data.photo_url ?? null]
    );
  }
}

export async function toggleEquipeActif(id: string, actif: boolean) {
  await pool.query(`UPDATE equipe SET actif=$1 WHERE id=$2 AND institut_id=$3`, [actif, id, iid()]);
}

// ── Vitrine (données publiques) ───────────────────────────────────────────────

export async function fetchVitrinePrestations() {
  const { rows } = await pool.query(
    `SELECT id, nom, prix, duree_minutes, zone FROM prestations_catalogue WHERE institut_id=$1 ORDER BY zone, prix`,
    [iid()]
  );
  return rows;
}

export async function fetchVitrineForfaits() {
  const { rows } = await pool.query(
    `SELECT id, nom, nombre_seances_total, prix, duree_validite_jours FROM forfaits
     WHERE institut_id=$1 AND actif=true ORDER BY prix`,
    [iid()]
  );
  return rows;
}

export async function fetchVitrineEquipe() {
  const { rows } = await pool.query(
    `SELECT id, nom, presentation, photo_url FROM equipe WHERE institut_id=$1 AND actif=true ORDER BY nom`,
    [iid()]
  );
  return rows;
}

// ── Paramètres ────────────────────────────────────────────────────────────────

export interface ParametresRow {
  id: string;
  sms_active: boolean;
  parrainage_actif: boolean;
  recompense_parrainage: string | null;
  lien_avis_google: string | null;
}

export async function fetchParametres(): Promise<ParametresRow | null> {
  const { rows } = await pool.query(
    `SELECT id, sms_active, parrainage_actif, recompense_parrainage, lien_avis_google
     FROM parametres_institut WHERE institut_id=$1`,
    [iid()]
  );
  return rows[0] ?? null;
}

export async function updateParametres(data: {
  id: string; sms_active: boolean; parrainage_actif: boolean;
  recompense_parrainage: string; lien_avis_google: string;
}) {
  await pool.query(
    `UPDATE parametres_institut SET sms_active=$1, parrainage_actif=$2, recompense_parrainage=$3, lien_avis_google=$4
     WHERE id=$5`,
    [data.sms_active, data.parrainage_actif, data.recompense_parrainage || null, data.lien_avis_google || null, data.id]
  );
}

// ── Prestation atomique ───────────────────────────────────────────────────────

export async function marquerPrestation(
  forfaitClienteId: string, clienteId: string, datePrestation: string,
  estheticienne: string, notes?: string
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `SELECT seances_restantes FROM forfaits_clientes WHERE id=$1 FOR UPDATE`,
      [forfaitClienteId]
    );
    if (!rows[0]) throw new Error("Forfait introuvable");
    if (rows[0].seances_restantes <= 0) throw new Error("Aucune séance restante sur ce forfait");

    await client.query(
      `UPDATE forfaits_clientes SET seances_restantes=seances_restantes-1 WHERE id=$1`,
      [forfaitClienteId]
    );
    await client.query(
      `INSERT INTO prestations_realisees (cliente_id, forfait_clientes_id, date_prestation, estheticienne, notes)
       VALUES ($1,$2,$3,$4,$5)`,
      [clienteId, forfaitClienteId, datePrestation, estheticienne, notes ?? null]
    );
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

// ── Demande créneau (public) ──────────────────────────────────────────────────

export async function insertDemandeCreneau(data: {
  clienteId?: string; nomDemandeur: string; telephoneDemandeur: string; disponibilite: string;
}) {
  await pool.query(
    `INSERT INTO demandes_creneau (institut_id, cliente_id, nom_demandeur, telephone_demandeur, disponibilite_souhaitee)
     VALUES ($1,$2,$3,$4,$5)`,
    [iid(), data.clienteId ?? null, data.nomDemandeur, data.telephoneDemandeur, data.disponibilite]
  );
}
