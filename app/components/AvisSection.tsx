interface AvisSectionProps {
  lienAvisGoogle: string;
  couleurPrincipale: string;
  couleurSecondaire: string;
  nomInstitut: string;
}

// Témoignages fictifs affichés en dur (remplaçables par Supabase plus tard)
const TEMOIGNAGES = [
  {
    id: 1,
    prenom: "Camille R.",
    note: 5,
    texte:
      "Une équipe au top, à l'écoute et très professionnelle. Je repars toujours ravie de mes soins. Je recommande les yeux fermés !",
  },
  {
    id: 2,
    prenom: "Sophie M.",
    note: 5,
    texte:
      "Cadre très agréable, propre et élégant. Le soin du visage hydratant est mon préféré — ma peau est transformée à chaque fois.",
  },
  {
    id: 3,
    prenom: "Lucie T.",
    note: 5,
    texte:
      "Esthéticiennes douces et attentionnées. Les forfaits sont très avantageux, j'en suis à mon deuxième pack jambes !",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} étoiles sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`w-4 h-4 ${i < n ? "fill-amber-400" : "fill-gray-200"}`}
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function AvisSection({
  lienAvisGoogle,
  couleurPrincipale,
  couleurSecondaire,
  nomInstitut,
}: AvisSectionProps) {
  return (
    <section id="avis" className="py-24 px-5" style={{ background: couleurSecondaire }}>
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{ color: couleurPrincipale, background: `${couleurPrincipale}18` }}
          >
            Ce qu&apos;elles en disent
          </span>
          <h2 className="section-title text-gray-800">Avis de nos clientes</h2>
          <p className="section-subtitle">
            La satisfaction de nos clientes est notre plus belle récompense.
          </p>
        </div>

        {/* Témoignages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {TEMOIGNAGES.map((t) => (
            <blockquote
              key={t.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4"
            >
              <Stars n={t.note} />
              <p className="text-sm text-gray-600 leading-relaxed flex-1 italic">
                &ldquo;{t.texte}&rdquo;
              </p>
              <footer className="text-xs font-semibold text-gray-400">{t.prenom}</footer>
            </blockquote>
          ))}
        </div>

        {/* CTA Google */}
        <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-sm text-gray-500">
            Vous avez visité {nomInstitut} ? Partagez votre expérience !
          </p>
          {lienAvisGoogle ? (
            <a
              href={lienAvisGoogle}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 shadow-md shadow-pink-100"
            >
              {/* Logo Google simplifié */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Laisser un avis Google
            </a>
          ) : (
            <span className="text-xs text-gray-400 italic">Lien Google non configuré</span>
          )}
        </div>
      </div>
    </section>
  );
}
