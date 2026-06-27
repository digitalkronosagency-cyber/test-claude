interface Prestation {
  id: string;
  nom: string;
  prix: number;
  duree_minutes: number;
  zone: string | null;
}

interface PrestationsSectionProps {
  prestations: Prestation[];
  couleurPrincipale: string;
}

// Icône SVG selon la zone
function ZoneIcon({ zone }: { zone: string | null }) {
  const icons: Record<string, string> = {
    Jambes:    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
    Aisselles: "M17 8C8 10 5.9 16.17 3.82 19.82A1 1 0 004.7 21h14.6a1 1 0 00.88-1.47C17.6 15.5 14 13 17 8z",
    Maillot:   "M12 2a5 5 0 100 10A5 5 0 0012 2zM6 22v-1a6 6 0 0112 0v1H6z",
    Visage:    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4a4 4 0 110 8 4 4 0 010-8zm0 14c-2.67 0-8 1.34-8 4v.5h16V20c0-2.66-5.33-4-8-4z",
    Mains:     "M15.5 6.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM12 14H8.5l-2-5H5l2.5 6.5V22h9v-1.5l2.5-6.5h-1.5l-2 5H12v-5z",
  };
  const path = (zone && icons[zone]) ?? icons["Visage"];
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d={path} />
    </svg>
  );
}

export default function PrestationsSection({
  prestations,
  couleurPrincipale,
}: PrestationsSectionProps) {
  return (
    <section id="prestations" className="py-24 px-5 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{ color: couleurPrincipale, background: `${couleurPrincipale}18` }}
          >
            Nos soins
          </span>
          <h2 className="section-title text-gray-800">Nos prestations</h2>
          <p className="section-subtitle">
            Des soins réalisés avec des produits de qualité, dans le respect de chaque peau.
          </p>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {prestations.map((p) => (
            <div
              key={p.id}
              className="card-hover rounded-2xl border border-gray-100 p-6 flex flex-col gap-3 bg-white shadow-sm"
            >
              {/* Icône + zone */}
              <div className="flex items-center justify-between">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${couleurPrincipale}18`, color: couleurPrincipale }}
                >
                  <ZoneIcon zone={p.zone} />
                </span>
                {p.zone && (
                  <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                    {p.zone}
                  </span>
                )}
              </div>

              {/* Nom */}
              <h3 className="font-semibold text-gray-800 text-base leading-snug">{p.nom}</h3>

              {/* Durée */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" aria-hidden>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" strokeLinecap="round" />
                </svg>
                {p.duree_minutes} min
              </div>

              {/* Prix */}
              <div className="mt-auto pt-3 border-t border-gray-50 flex items-baseline gap-1">
                <span className="text-2xl font-bold" style={{ color: couleurPrincipale }}>
                  {p.prix.toFixed(0)} €
                </span>
                <span className="text-xs text-gray-400">/ séance</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
