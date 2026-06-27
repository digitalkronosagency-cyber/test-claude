import { fetchForfaitsCliente, type ForfaitCliente } from "@/lib/queries/cliente";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import SeancesDots from "../components/SeancesDots";
import { config } from "@/lib/config";
import Link from "next/link";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

function joursAvantExpiration(dateStr: string): number {
  const aujourd_hui = new Date();
  aujourd_hui.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(dateStr).getTime() - aujourd_hui.getTime()) / 86_400_000);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function StatusBadge({ fc }: { fc: ForfaitCliente }) {
  const jours = joursAvantExpiration(fc.date_expiration);
  if (fc.seances_restantes === 0 || jours < 0)
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{fc.seances_restantes === 0 ? "Épuisé" : "Expiré"}</span>;
  if (fc.seances_restantes <= 1)
    return <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">⚠ Dernière séance</span>;
  if (jours <= 30)
    return <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">⏳ Expire bientôt</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">✓ Actif</span>;
}

export default async function TableauDeBordPage() {
  const session = await getSession();
  if (!session.clienteId) redirect("/espace-client/connexion");

  const { rows } = await pool.query(
    `SELECT id, nom, prenom FROM clientes WHERE id=$1 LIMIT 1`,
    [session.clienteId]
  );
  const cliente = rows[0];
  if (!cliente) redirect("/espace-client/connexion");

  const forfaits = await fetchForfaitsCliente(session.clienteId);
  const { couleurPrincipale } = config.branding;

  const forfaitsActifs = forfaits.filter(f => f.seances_restantes > 0 && joursAvantExpiration(f.date_expiration) >= 0);
  const forfaitsInactifs = forfaits.filter(f => f.seances_restantes === 0 || joursAvantExpiration(f.date_expiration) < 0);

  const alerteSeances = forfaitsActifs.filter(f => f.seances_restantes <= 1);
  const alerteExpiration = forfaitsActifs.filter(f => { const j = joursAvantExpiration(f.date_expiration); return j >= 0 && j <= 30; });

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bonjour, {cliente.prenom} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Voici l&apos;état de vos forfaits</p>
      </div>

      {alerteExpiration.map((f) => {
        const jours = joursAvantExpiration(f.date_expiration);
        return (
          <div key={`exp-${f.id}`} className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 mb-4" role="alert">
            <span className="text-orange-500 text-lg shrink-0">⏳</span>
            <div>
              <p className="text-sm font-semibold text-orange-800">Forfait expirant dans {jours} jour{jours > 1 ? "s" : ""}</p>
              <p className="text-xs text-orange-700 mt-0.5">
                <strong>{f.forfait_nom}</strong> expire le {formatDate(f.date_expiration)}
                {f.seances_restantes > 0 && ` — il vous reste encore ${f.seances_restantes} séance${f.seances_restantes > 1 ? "s" : ""} à utiliser`}.
              </p>
            </div>
          </div>
        );
      })}

      {alerteSeances.map((f) => (
        <div key={`seq-${f.id}`} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-4" role="alert">
          <span className="text-amber-500 text-lg shrink-0">⚠</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">Dernière séance disponible</p>
            <p className="text-xs text-amber-700 mt-0.5">Il ne vous reste plus qu&apos;une séance sur votre forfait <strong>{f.forfait_nom}</strong>. Pensez à en racheter un !</p>
          </div>
        </div>
      ))}

      {forfaits.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl" style={{ background: `${couleurPrincipale}18` }}>🎁</div>
          <h3 className="font-semibold text-gray-700 mb-2">Aucun forfait pour le moment</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">Contactez l&apos;institut pour découvrir nos forfaits.</p>
          <Link href="/#forfaits" className="btn-primary text-sm py-2.5 px-6">Découvrir les forfaits</Link>
        </div>
      )}

      {forfaitsActifs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Forfaits en cours</h2>
          <div className="flex flex-col gap-4">
            {forfaitsActifs.map(f => <ForfaitCard key={f.id} f={f} couleurPrincipale={couleurPrincipale} />)}
          </div>
        </section>
      )}

      {forfaitsInactifs.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Forfaits terminés</h2>
          <div className="flex flex-col gap-4 opacity-60">
            {forfaitsInactifs.map(f => <ForfaitCard key={f.id} f={f} couleurPrincipale={couleurPrincipale} inactive />)}
          </div>
        </section>
      )}
    </div>
  );
}

function ForfaitCard({ f, couleurPrincipale, inactive = false }: { f: ForfaitCliente; couleurPrincipale: string; inactive?: boolean }) {
  const jours = joursAvantExpiration(f.date_expiration);
  const isExpirationUrgente = jours >= 0 && jours <= 30 && !inactive;
  return (
    <div className={`bg-white rounded-2xl border p-6 ${isExpirationUrgente ? "border-orange-200" : "border-gray-100"} shadow-sm`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="font-semibold text-gray-800 text-base leading-snug">{f.forfait_nom}</h3>
        <StatusBadge fc={f} />
      </div>
      <div className="mb-4">
        <SeancesDots total={f.nombre_seances_total} restantes={f.seances_restantes} couleurPrincipale={couleurPrincipale} />
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400 border-t border-gray-50 pt-4">
        <span>Acheté le <span className="text-gray-600">{formatDate(f.date_achat)}</span></span>
        <span className={isExpirationUrgente ? "font-semibold text-orange-600" : ""}>
          Expire le <span className={isExpirationUrgente ? "text-orange-600" : "text-gray-600"}>{formatDate(f.date_expiration)}</span>
          {isExpirationUrgente && ` (dans ${jours} j)`}
        </span>
      </div>
    </div>
  );
}
