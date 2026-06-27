import { fetchAllClientes } from "@/lib/queries/admin";
import { config } from "@/lib/config";
import ClientesTable from "./ClientesTable";

export const dynamic = "force-dynamic";

function joursAvantExpiration(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
}

export default async function AdminClientesPage() {
  const raw = await fetchAllClientes();
  const { couleurPrincipale } = config.branding;

  // Enrichir chaque cliente avec des indicateurs résumés
  const clientes = raw.map((c) => {
    const forfaitsActifs = (c.forfaits_clientes ?? []).filter(
      (f) => f.seances_restantes > 0 && joursAvantExpiration(f.date_expiration) >= 0
    );
    const seancesTotales = forfaitsActifs.reduce((s, f) => s + f.seances_restantes, 0);
    const alerteSeances = forfaitsActifs.some((f) => f.seances_restantes <= 1);
    const alerteExpiration = forfaitsActifs.some((f) => {
      const j = joursAvantExpiration(f.date_expiration);
      return j >= 0 && j <= 30;
    });
    return { ...c, forfaitsActifs: forfaitsActifs.length, seancesTotales, alerteSeances, alerteExpiration };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Clientes</h1>
          <p className="text-sm text-slate-500 mt-0.5">{clientes.length} clientes enregistrées</p>
        </div>
      </div>

      <ClientesTable clientes={clientes} couleurPrincipale={couleurPrincipale} />
    </div>
  );
}
