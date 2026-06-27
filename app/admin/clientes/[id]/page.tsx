import { fetchClienteDetail, fetchEquipe, type ClienteDetailPrestation } from "@/lib/queries/admin";
import { config } from "@/lib/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import MarquerPrestationForm from "./MarquerPrestationForm";

export const dynamic = "force-dynamic";

function joursAvantExpiration(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
}
function fmt(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default async function ClienteDetailPage({ params }: { params: { id: string } }) {
  const [cliente, equipe] = await Promise.all([
    fetchClienteDetail(params.id),
    fetchEquipe(),
  ]);
  if (!cliente) notFound();

  const { couleurPrincipale } = config.branding;

  // Trier forfaits : actifs d'abord
  const forfaits = [...(cliente.forfaits_clientes ?? [])].sort((a, b) => {
    const aActif = a.seances_restantes > 0 && joursAvantExpiration(a.date_expiration) >= 0;
    const bActif = b.seances_restantes > 0 && joursAvantExpiration(b.date_expiration) >= 0;
    return Number(bActif) - Number(aActif);
  });

  const forfaitsDisponibles = forfaits.filter(
    (f) => f.seances_restantes > 0 && joursAvantExpiration(f.date_expiration) >= 0
  );

  const prestations = [...(cliente.prestations_realisees ?? [])].sort(
    (a, b) => new Date(b.date_prestation).getTime() - new Date(a.date_prestation).getTime()
  );

  const estheticiennes = equipe.filter((e) => e.actif).map((e) => e.nom);

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/admin/clientes" className="hover:text-slate-600 transition-colors">Clientes</Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{cliente.prenom} {cliente.nom}</span>
      </div>

      {/* En-tête */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6 flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0"
          style={{ background: couleurPrincipale }}
        >
          {cliente.prenom[0]}{cliente.nom[0]}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800">{cliente.prenom} {cliente.nom}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
            {cliente.email && <span>✉ {cliente.email}</span>}
            {cliente.telephone && <span>📞 {cliente.telephone}</span>}
          </div>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p className="font-semibold text-slate-600 text-lg">{prestations.length}</p>
          <p>prestation{prestations.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne gauche : forfaits + marquer prestation */}
        <div className="flex flex-col gap-6">
          {/* Forfaits */}
          <Section title="Forfaits">
            {forfaits.length === 0 ? (
              <p className="text-sm text-slate-400 py-2">Aucun forfait</p>
            ) : (
              <div className="flex flex-col gap-3">
                {forfaits.map((f) => {
                  const jours = joursAvantExpiration(f.date_expiration);
                  const actif = f.seances_restantes > 0 && jours >= 0;
                  const total = f.forfaits?.nombre_seances_total ?? f.seances_restantes;
                  return (
                    <div
                      key={f.id}
                      className={`rounded-xl border p-4 ${actif ? "border-slate-200 bg-slate-50" : "border-dashed border-slate-200 opacity-60"}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-slate-700 text-sm leading-snug">{f.forfaits?.nom}</p>
                        <StatusChip restantes={f.seances_restantes} jours={jours} />
                      </div>
                      {/* Pastilles */}
                      <div className="flex gap-1.5 flex-wrap mb-2">
                        {Array.from({ length: total }).map((_, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border-2"
                            style={{
                              borderColor: couleurPrincipale,
                              background: i < f.seances_restantes ? couleurPrincipale : "transparent",
                              opacity: i < f.seances_restantes ? 1 : 0.25,
                            }}
                          />
                        ))}
                        <span className="text-xs font-semibold text-slate-600 ml-1">
                          {f.seances_restantes}/{total}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Expire le {fmt(f.date_expiration)}
                        {actif && jours <= 30 && (
                          <span className="text-orange-600 font-medium"> (dans {jours} j)</span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          {/* Formulaire marquer prestation */}
          <Section title="Marquer une prestation">
            {forfaitsDisponibles.length === 0 ? (
              <p className="text-sm text-slate-400 py-2">
                Aucun forfait avec séances disponibles.
              </p>
            ) : (
              <MarquerPrestationForm
                clienteId={cliente.id}
                forfaits={forfaitsDisponibles.map((f) => ({
                  id: f.id,
                  nom: f.forfaits?.nom ?? "Forfait",
                  restantes: f.seances_restantes,
                }))}
                estheticiennes={estheticiennes}
                couleurPrincipale={couleurPrincipale}
              />
            )}
          </Section>
        </div>

        {/* Colonne droite : historique */}
        <Section title={`Historique (${prestations.length})`}>
          {prestations.length === 0 ? (
            <p className="text-sm text-slate-400 py-2">Aucune prestation enregistrée</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
              {prestations.map((p) => (
                <div key={p.id} className="flex gap-3 items-start rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="shrink-0 mt-0.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full mt-1"
                      style={{ background: couleurPrincipale }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2 flex-wrap">
                      <p className="text-sm font-medium text-slate-700">{fmt(p.date_prestation)}</p>
                      {p.estheticienne && (
                        <span className="text-xs text-slate-400">{p.estheticienne}</span>
                      )}
                    </div>
                    {(p as ClienteDetailPrestation).forfaits_clientes?.forfaits?.nom && (
                      <p className="text-xs mt-0.5" style={{ color: couleurPrincipale }}>
                        {(p as ClienteDetailPrestation).forfaits_clientes?.forfaits?.nom}
                      </p>
                    )}
                    {p.notes && (
                      <p className="text-xs text-slate-500 mt-1 italic">{p.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">{title}</h2>
      {children}
    </div>
  );
}

function StatusChip({ restantes, jours }: { restantes: number; jours: number }) {
  if (restantes === 0 || jours < 0)
    return <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">Terminé</span>;
  if (restantes <= 1)
    return <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">1 séance</span>;
  if (jours <= 30)
    return <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">⏳ {jours}j</span>;
  return <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Actif</span>;
}
