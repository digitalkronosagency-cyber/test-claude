interface HeroSectionProps {
  nom: string;
  couleurPrincipale: string;
  couleurSecondaire: string;
}

export default function HeroSection({ nom, couleurPrincipale, couleurSecondaire }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 overflow-hidden"
      style={{ background: couleurSecondaire }}
    >
      {/* Cercles décoratifs en arrière-plan */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: couleurPrincipale }}
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: couleurPrincipale }}
        aria-hidden
      />

      {/* Contenu */}
      <div className="relative z-10 max-w-2xl">
        {/* Badge */}
        <span
          className="inline-block text-xs font-semibold tracking-widest uppercase mb-6 px-4 py-1.5 rounded-full"
          style={{ color: couleurPrincipale, background: `${couleurPrincipale}18` }}
        >
          Institut de beauté — Bordeaux
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-800 text-balance mb-6">
          Votre beauté,{" "}
          <span style={{ color: couleurPrincipale }}>notre expertise</span>
        </h1>

        <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg mx-auto text-balance">
          {nom} vous accueille dans un cadre élégant pour des soins personnalisés.
          Épilation, soins du visage, manucure — chaque visite est un moment rien qu&apos;à vous.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#contact" className="btn-primary text-base py-3.5 px-8 shadow-lg shadow-pink-200">
            Demander un créneau
          </a>
          <a href="#prestations" className="btn-outline text-base py-3.5 px-8">
            Découvrir nos soins
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <span className="text-xs tracking-widest uppercase text-gray-500">Défiler</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="animate-bounce">
          <path d="M8 4v16M8 20l-4-4M8 20l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"/>
        </svg>
      </div>
    </section>
  );
}
