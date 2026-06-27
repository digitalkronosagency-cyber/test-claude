import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { config } from "@/lib/config";
import MesInfosForm from "./MesInfosForm";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MesInfosPage() {
  const session = await getSession();
  if (!session.clienteId) redirect("/espace-client/connexion");

  const { rows } = await pool.query(
    `SELECT id, nom, prenom, email, telephone FROM clientes WHERE id=$1 LIMIT 1`,
    [session.clienteId]
  );
  const cliente = rows[0];
  if (!cliente) redirect("/espace-client/connexion");

  const { couleurPrincipale, couleurSecondaire } = config.branding;

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mes informations</h1>
        <p className="text-sm text-gray-500 mt-1">Mettez à jour vos coordonnées</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: couleurPrincipale }}>
              {cliente.prenom.charAt(0)}{cliente.nom.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{cliente.prenom} {cliente.nom}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cliente.email}</p>
            </div>
            <div className="w-full mt-2 rounded-xl px-4 py-2 text-xs text-center font-medium" style={{ background: `${couleurPrincipale}15`, color: couleurPrincipale }}>
              Cliente {config.institut.nom}
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <MesInfosForm cliente={cliente} couleurPrincipale={couleurPrincipale} couleurSecondaire={couleurSecondaire} />
        </div>
      </div>
    </div>
  );
}
