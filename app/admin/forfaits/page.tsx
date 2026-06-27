import { fetchForfaitsCatalogue } from "@/lib/queries/admin";
import { config } from "@/lib/config";
import ForfaitsManager from "./ForfaitsManager";

export const dynamic = "force-dynamic";

export default async function AdminForfaitsPage() {
  const forfaits = await fetchForfaitsCatalogue();
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Forfaits</h1>
        <p className="text-sm text-slate-500 mt-0.5">{forfaits.length} forfaits configurés</p>
      </div>
      <ForfaitsManager forfaits={forfaits} couleurPrincipale={config.branding.couleurPrincipale} />
    </div>
  );
}
