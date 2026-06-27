import { config } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { institut, branding } = config;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: branding.couleurSecondaire }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-white">
        <Image
          src={branding.logoUrl}
          alt={`Logo ${institut.nom}`}
          width={120}
          height={48}
          className="object-contain"
          onError={undefined}
          unoptimized
        />
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:opacity-70 transition-opacity">Accueil</Link>
          <Link href="/espace-client" className="hover:opacity-70 transition-opacity" style={{ color: branding.couleurPrincipale }}>
            Espace client
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: branding.couleurPrincipale }}>
          {institut.nom}
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Prenez soin de vous dans un cadre élégant et chaleureux.
        </p>
        <Link
          href="/espace-client"
          className="px-8 py-3 rounded-full text-white font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ background: branding.couleurPrincipale }}
        >
          Accéder à mon espace client
        </Link>
      </main>

      {/* Infos */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-800 mb-1">Adresse</p>
            <p>{institut.adresse}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Téléphone</p>
            <p>
              <a href={`tel:${institut.telephone.replace(/\s/g, "")}`} className="hover:underline">
                {institut.telephone}
              </a>
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Horaires</p>
            <p>{institut.horaires || "Contactez-nous"}</p>
          </div>
        </div>
        {institut.lienAvisGoogle && (
          <div className="text-center mt-8">
            <a
              href={institut.lienAvisGoogle}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline underline-offset-2"
              style={{ color: branding.couleurPrincipale }}
            >
              ⭐ Laisser un avis Google
            </a>
          </div>
        )}
      </section>

      <footer className="text-center text-xs text-gray-400 py-4">
        © {new Date().getFullYear()} {institut.nom} — {institut.email}
      </footer>
    </div>
  );
}
