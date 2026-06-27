interface SiteFooterProps {
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  lienAvisGoogle: string;
  couleurPrincipale: string;
}

export default function SiteFooter({
  nom,
  email,
  telephone,
  adresse,
  lienAvisGoogle,
  couleurPrincipale,
}: SiteFooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-400 py-14 px-5">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Identité */}
        <div className="sm:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: couleurPrincipale }}
            >
              {nom.charAt(0)}
            </div>
            <span className="text-white font-semibold text-sm">{nom}</span>
          </div>
          <p className="text-sm leading-relaxed">
            Institut de beauté indépendant à Bordeaux. Épilation, soins du visage, manucure.
          </p>
        </div>

        {/* Liens rapides */}
        <div>
          <p className="text-white text-sm font-semibold mb-4">Navigation</p>
          <ul className="flex flex-col gap-2 text-sm">
            {["#prestations", "#forfaits", "#equipe", "#avis", "#contact"].map((href) => (
              <li key={href}>
                <a href={href} className="hover:text-white transition-colors capitalize">
                  {href.replace("#", "")}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-white text-sm font-semibold mb-4">Contact</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>{adresse}</li>
            <li>
              <a href={`tel:${telephone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                {telephone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                {email}
              </a>
            </li>
            {lienAvisGoogle && (
              <li>
                <a
                  href={lienAvisGoogle}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  style={{ color: couleurPrincipale }}
                >
                  ⭐ Laisser un avis Google
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
        <p>© {new Date().getFullYear()} {nom}. Tous droits réservés.</p>
        <a href="/espace-client" className="hover:text-white transition-colors">
          Espace client →
        </a>
      </div>
    </footer>
  );
}
