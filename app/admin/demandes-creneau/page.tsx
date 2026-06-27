import { fetchDemandesCreneau } from "@/lib/queries/admin";
import { updateStatutDemandeAction } from "@/app/actions/admin/demandes";

export const dynamic = "force-dynamic";

const STATUT_LABELS: Record<string, { label: string; cls: string }> = {
  en_attente: { label: "En attente", cls: "bg-amber-100 text-amber-700 border border-amber-200" },
  confirme:   { label: "Confirmé",   cls: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  annule:     { label: "Refusé",     cls: "bg-red-100 text-red-600 border border-red-100" },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function DemandesCreneauPage() {
  const demandes = await fetchDemandesCreneau();
  const pending = demandes.filter((d) => d.statut === "en_attente").length;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Demandes de créneau</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {pending > 0 ? <span className="font-semibold text-amber-600">{pending} en attente</span> : "Toutes les demandes ont été traitées"}
          {" · "}{demandes.length} au total
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {demandes.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
            Aucune demande reçue pour le moment.
          </div>
        )}

        {demandes.map((d) => {
          const st = STATUT_LABELS[d.statut] ?? STATUT_LABELS.en_attente;
          const isPending = d.statut === "en_attente";
          return (
            <div key={d.id} className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col sm:flex-row gap-4 sm:items-start ${isPending ? "border-amber-200" : "border-slate-200"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-semibold text-slate-800">{d.nom_demandeur}</p>
                  {d.cliente_nom && (
                    <span className="text-xs text-slate-400">(cliente : {d.cliente_prenom} {d.cliente_nom})</span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                </div>
                <p className="text-sm text-slate-600">
                  📞 <a href={`tel:${d.telephone_demandeur.replace(/\s/g, "")}`} className="hover:underline">{d.telephone_demandeur}</a>
                </p>
                <p className="text-sm text-slate-700 mt-1.5 bg-slate-50 rounded-xl px-3 py-2">🗓 {d.disponibilite_souhaitee}</p>
                <p className="text-xs text-slate-400 mt-2">Reçue le {fmtDate(d.created_at)}</p>
              </div>

              {isPending && (
                <div className="flex gap-2 sm:flex-col shrink-0">
                  <form action={updateStatutDemandeAction}>
                    <input type="hidden" name="id" value={d.id} />
                    <input type="hidden" name="statut" value="confirme" />
                    <button className="w-full sm:w-32 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">✓ Confirmer</button>
                  </form>
                  <form action={updateStatutDemandeAction}>
                    <input type="hidden" name="id" value={d.id} />
                    <input type="hidden" name="statut" value="annule" />
                    <button className="w-full sm:w-32 px-4 py-2 text-xs font-semibold rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors">✕ Refuser</button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
