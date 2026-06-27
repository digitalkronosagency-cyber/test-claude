import pool from "@/lib/db";
import { config } from "@/lib/config";

const iid = () => config.institut.id;

export interface ClienteProfile {
  id: string;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string | null;
}

export interface ForfaitCliente {
  id: string;
  seances_restantes: number;
  date_achat: string;
  date_expiration: string;
  forfait_id: string;
  forfait_nom: string;
  nombre_seances_total: number;
}

export interface PrestationRealisee {
  id: string;
  date_prestation: string;
  estheticienne: string | null;
  notes: string | null;
  forfait_nom: string | null;
}

export async function fetchClienteByEmail(email: string): Promise<ClienteProfile | null> {
  const { rows } = await pool.query(
    `SELECT id, nom, prenom, email, telephone FROM clientes
     WHERE email = $1 AND institut_id = $2 LIMIT 1`,
    [email.toLowerCase(), iid()]
  );
  return rows[0] ?? null;
}

export async function verifyClientePassword(email: string, password: string): Promise<ClienteProfile | null> {
  const bcrypt = await import("bcryptjs");
  const { rows } = await pool.query(
    `SELECT id, nom, prenom, email, telephone, password_hash FROM clientes
     WHERE email = $1 AND institut_id = $2 LIMIT 1`,
    [email.toLowerCase(), iid()]
  );
  if (!rows[0]) return null;
  const ok = await bcrypt.compare(password, rows[0].password_hash ?? "");
  if (!ok) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...profile } = rows[0];
  return profile;
}

export async function fetchForfaitsCliente(clienteId: string): Promise<ForfaitCliente[]> {
  const { rows } = await pool.query(
    `SELECT fc.id, fc.seances_restantes, fc.date_achat::text, fc.date_expiration::text,
            fc.forfait_id, f.nom AS forfait_nom, f.nombre_seances_total
     FROM forfaits_clientes fc
     JOIN forfaits f ON f.id = fc.forfait_id
     WHERE fc.cliente_id = $1
     ORDER BY fc.date_achat DESC`,
    [clienteId]
  );
  return rows;
}

export async function fetchHistoriqueCliente(clienteId: string): Promise<PrestationRealisee[]> {
  const { rows } = await pool.query(
    `SELECT pr.id, pr.date_prestation::text, pr.estheticienne, pr.notes,
            f.nom AS forfait_nom
     FROM prestations_realisees pr
     LEFT JOIN forfaits_clientes fc ON fc.id = pr.forfait_clientes_id
     LEFT JOIN forfaits f ON f.id = fc.forfait_id
     WHERE pr.cliente_id = $1
     ORDER BY pr.date_prestation DESC`,
    [clienteId]
  );
  return rows;
}

export async function updateClienteInfos(
  clienteId: string,
  data: { nom: string; prenom: string; telephone: string }
) {
  await pool.query(
    `UPDATE clientes SET nom=$1, prenom=$2, telephone=$3 WHERE id=$4 AND institut_id=$5`,
    [data.nom, data.prenom, data.telephone, clienteId, iid()]
  );
}
