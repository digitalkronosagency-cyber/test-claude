import { fetchHistoriqueCliente } from "@/lib/queries/cliente";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default async function HistoriquePage() {
  const session = await getSession();
  if (!session.clienteId) redirect("/espace-client/connexion");

  const prestations = await fetchHistoriqueCliente(session.clienteId);
  const { couleurPrincipale } = config.branding;

  // Grouper par mois
  const groups: Record<string, typeof prestations> = {};
  for (const p of prestations) {
    const key = new Date(p.date_prestation).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Historique</h1>
        <p className="text-sm text-gray-500 mt-1">
          {prestations.length > 0
            ? `${prestations.length} soin${prestations.length > 1 ? "s" : ""} réalisé${prestations.length > 1 ? "s" : ""}`
            : "Aucune prestation enregistrée pour le moment"}
        </p>
      </div>

      {prestations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl" style={{ background: `${couleurPrincipale}18` }}>✨</div>
          <h3 className="font-semibold text-gray-700 mb-2">Pas encore de soin enregistré</h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">Votre historique apparaîtra ici après votre premier rendez-vous.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {Object.entries(groups).map(([mois, items]) => (
            <section key={mois}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest capitalize">{mois}</h2>
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ color: couleurPrincipale, background: `${couleurPrincipale}15` }}>
                  {items.length} soin{items.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="relative flex flex-col gap-3 pl-5">
                <div className="absolute left-1.5 top-2 bottom-2 w-px" style={{ background: `${couleurPrincipale}30` }} aria-hidden />
                {items.map((p) => (
                  <div key={p.id} className="relative">
                    <div className="absolute -left-5 top-3.5 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: couleurPrincipale }} aria-hidden />
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm capitalize">{formatDate(p.date_prestation)}</p>
                          {p.forfait_nom && (
                            <p className="text-xs mt-0.5 font-medium" style={{ color: couleurPrincipale }}>{p.forfait_nom}</p>
                          )}
                        </div>
                        {p.estheticienne && (
                          <span className="text-xs text-gray-400 flex items-center gap-1.5 shrink-0">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ background: couleurPrincipale }} aria-hidden>
                              {p.estheticienne.charAt(0)}
                            </span>
                            {p.estheticienne}
                          </span>
                        )}
                      </div>
                      {p.notes && (
                        <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 leading-relaxed italic">&ldquo;{p.notes}&rdquo;</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
