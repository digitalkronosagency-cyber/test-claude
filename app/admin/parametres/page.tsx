import { fetchParametres } from "@/lib/queries/admin";
import { config } from "@/lib/config";
import ParametresForm from "./ParametresForm";

export const dynamic = "force-dynamic";

export default async function AdminParametresPage() {
  const params = await fetchParametres();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Paramètres</h1>
        <p className="text-sm text-slate-500 mt-0.5">{config.institut.nom}</p>
      </div>

      {params ? (
        <ParametresForm
          params={params}
          couleurPrincipale={config.branding.couleurPrincipale}
        />
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-700">
          Paramètres introuvables. Exécutez le seed SQL pour créer la ligne <code>parametres_institut</code>.
        </div>
      )}
    </div>
  );
}
