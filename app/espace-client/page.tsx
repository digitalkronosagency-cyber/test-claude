import { config } from "@/lib/config";
import Link from "next/link";

export default function EspaceClientPage() {
  const { branding } = config;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20" style={{ background: branding.couleurSecondaire }}>
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-2" style={{ color: branding.couleurPrincipale }}>
          Espace client
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Connectez-vous pour accéder à vos rendez-vous et historique de soins.
        </p>

        {/* Placeholder — à remplacer par un formulaire d'auth Supabase */}
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Adresse e-mail"
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2"
            style={{ "--tw-ring-color": branding.couleurPrincipale } as React.CSSProperties}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2"
          />
          <button
            className="mt-2 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: branding.couleurPrincipale }}
          >
            Se connecter
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Pas encore de compte ?{" "}
          <span className="underline cursor-pointer" style={{ color: branding.couleurPrincipale }}>
            Créer un compte
          </span>
        </p>
      </div>

      <Link href="/" className="mt-8 text-sm text-gray-400 hover:underline">
        ← Retour à l&apos;accueil
      </Link>
    </div>
  );
}
