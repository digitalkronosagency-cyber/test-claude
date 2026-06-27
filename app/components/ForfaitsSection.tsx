interface Forfait {
  id: string;
  nom: string;
  nombre_seances_total: number;
  prix: number;
  duree_validite_jours: number;
}

interface ForfaitsSectionProps {
  forfaits: Forfait[];
  couleurPrincipale: string;
  couleurSecondaire: string;
}

function validiteLabel(jours: number): string {
  if (jours >= 365 && jours % 365 === 0) return `${jours / 365} an${jours / 365 > 1 ? "s" : ""}`;
  if (jours >= 30) return `${Math.round(jours / 30)} mois`;
  return `${jours} jours`;
}

function prixParSeance(prix: number, seances: number): string {
  return (prix / seances).toFixed(0);
}

export default function ForfaitsSection({
  forfaits,
  couleurPrincipale,
  couleurSecondaire,
}: ForfaitsSectionProps) {
  return (
    <section id="forfaits" className="py-24 px-5" style={{ background: couleurSecondaire }}>
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{ color: couleurPrincipale, background: `${couleurPrincipale}18` }}
          >
            Économisez
          </span>
          <h2 className="section-title text-gray-800">Nos forfaits</h2>
          <p className="section-subtitle">
            Engagez-vous sur plusieurs séances et bénéficiez d&apos;un tarif préférentiel.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {forfaits.map((f, i) => {
            const featured = i === 0; // Met en avant le premier forfait
            return (
              <div
                key={f.id}
                className={`card-hover relative rounded-2xl p-7 flex flex-col gap-5 ${
                  featured
                    ? "text-white shadow-2xl shadow-pink-200"
                    : "bg-white border border-gray-100 shadow-sm"
                }`}
                style={featured ? { background: couleurPrincipale } : {}}
              >
                {featured && (
                  <span className="absolute top-5 right-5 text-[10px] font-bold tracking-widest uppercase bg-white/20 text-white px-2.5 py-1 rounded-full">
                    Populaire
                  </span>
                )}

                {/* Nom */}
                <div>
                  <h3
                    className={`font-bold text-lg leading-snug ${featured ? "text-white" : "text-gray-800"}`}
                  >
                    {f.nom}
                  </h3>
                  <p className={`text-sm mt-1 ${featured ? "text-white/70" : "text-gray-400"}`}>
                    Valable {validiteLabel(f.duree_validite_jours)}
                  </p>
                </div>

                {/* Séances */}
                <div className="flex items-center gap-3">
                  {Array.from({ length: Math.min(f.nombre_seances_total, 10) }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full ${featured ? "bg-white/60" : ""}`}
                      style={!featured ? { background: `${couleurPrincipale}60` } : {}}
                    />
                  ))}
                  {f.nombre_seances_total > 10 && (
                    <span className={`text-xs ${featured ? "text-white/60" : "text-gray-400"}`}>
                      +{f.nombre_seances_total - 10}
                    </span>
                  )}
                  <span
                    className={`text-sm ml-1 font-medium ${featured ? "text-white/80" : "text-gray-500"}`}
                  >
                    {f.nombre_seances_total} séances
                  </span>
                </div>

                {/* Prix */}
                <div className="mt-auto pt-5 border-t border-white/20 flex items-end justify-between">
                  <div>
                    <span className={`text-3xl font-bold ${featured ? "text-white" : ""}`}
                      style={!featured ? { color: couleurPrincipale } : {}}>
                      {f.prix.toFixed(0)} €
                    </span>
                    <p className={`text-xs mt-0.5 ${featured ? "text-white/60" : "text-gray-400"}`}>
                      soit {prixParSeance(f.prix, f.nombre_seances_total)} € / séance
                    </p>
                  </div>
                  <a
                    href="#contact"
                    className={`text-xs font-semibold px-5 py-2 rounded-full transition-all duration-200 hover:scale-105 ${
                      featured
                        ? "bg-white text-pink-600"
                        : "border-2 text-pink-600"
                    }`}
                    style={!featured ? { borderColor: couleurPrincipale } : {}}
                  >
                    En savoir plus
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
