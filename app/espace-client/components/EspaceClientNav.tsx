"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { deconnexionAction } from "@/app/actions/auth";

interface Props {
  nomInstitut: string;
  couleurPrincipale: string;
  userEmail: string;
}

const NAV = [
  {
    href: "/espace-client/tableau-de-bord",
    label: "Tableau de bord",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    href: "/espace-client/historique",
    label: "Historique",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
        <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
      </svg>
    ),
  },
  {
    href: "/espace-client/mes-infos",
    label: "Mes infos",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    ),
  },
];

export default function EspaceClientNav({
  nomInstitut,
  couleurPrincipale,
  userEmail,
}: Props) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-6">
        {/* Logo / nom */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: couleurPrincipale }}
            aria-hidden
          >
            {nomInstitut.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-gray-700 hidden sm:block">
            {nomInstitut}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
                style={active ? { background: couleurPrincipale } : {}}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Utilisateur + déconnexion */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-gray-400 hidden md:block truncate max-w-[140px]">
            {userEmail}
          </span>
          <form action={deconnexionAction}>
            <button
              type="submit"
              className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium px-2 py-1 rounded"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
