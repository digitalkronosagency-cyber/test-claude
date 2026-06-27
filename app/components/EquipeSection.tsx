interface Estheticienne {
  id: string;
  nom: string;
  presentation: string | null;
  photo_url: string | null;
}

interface EquipeSectionProps {
  equipe: Estheticienne[];
  couleurPrincipale: string;
  couleurSecondaire: string;
}

// Avatars placeholder avec initiales colorées
function AvatarPlaceholder({ nom, couleur }: { nom: string; couleur: string }) {
  const initiales = nom
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Génère une teinte légèrement différente selon l'index pour varier
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${couleur}30 0%, ${couleur}60 100%)`,
      }}
    >
      {/* SVG silhouette */}
      <svg viewBox="0 0 120 140" className="w-24 h-28 opacity-40" aria-hidden>
        <circle cx="60" cy="40" r="28" fill="currentColor" />
        <ellipse cx="60" cy="120" rx="42" ry="30" fill="currentColor" />
      </svg>
      <span
        className="absolute text-3xl font-bold"
        style={{ color: couleur }}
      >
        {initiales}
      </span>
    </div>
  );
}

export default function EquipeSection({
  equipe,
  couleurPrincipale,
  couleurSecondaire,
}: EquipeSectionProps) {
  return (
    <section id="equipe" className="py-24 px-5 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{ color: couleurPrincipale, background: `${couleurPrincipale}18` }}
          >
            L&apos;équipe
          </span>
          <h2 className="section-title text-gray-800">Notre équipe</h2>
          <p className="section-subtitle">
            Des professionnelles passionnées à votre service, formées aux dernières techniques.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {equipe.map((e) => (
            <div
              key={e.id}
              className="card-hover rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white flex flex-col"
            >
              {/* Photo / placeholder */}
              <div
                className="relative h-56 w-full overflow-hidden"
                style={{ background: couleurSecondaire }}
              >
                {e.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.photo_url}
                    alt={e.nom}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <AvatarPlaceholder nom={e.nom} couleur={couleurPrincipale} />
                )}
                {/* Dégradé bas */}
                <div
                  className="absolute inset-x-0 bottom-0 h-16"
                  style={{
                    background: `linear-gradient(to top, ${couleurSecondaire}, transparent)`,
                  }}
                />
              </div>

              {/* Texte */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-gray-800 text-lg mb-2">{e.nom}</h3>
                {e.presentation && (
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">
                    {e.presentation}
                  </p>
                )}
                {/* Séparateur décoratif */}
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <span
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: couleurPrincipale }}
                  >
                    Esthéticienne diplômée
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
