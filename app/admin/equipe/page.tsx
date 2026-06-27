import { fetchEquipe } from "@/lib/queries/admin";
import { config } from "@/lib/config";
import EquipeManager from "./EquipeManager";

export const dynamic = "force-dynamic";

export default async function AdminEquipePage() {
  const equipe = await fetchEquipe();
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Équipe</h1>
        <p className="text-sm text-slate-500 mt-0.5">{equipe.filter((e) => e.actif).length} esthéticiennes actives</p>
      </div>
      <EquipeManager equipe={equipe} couleurPrincipale={config.branding.couleurPrincipale} />
    </div>
  );
}
