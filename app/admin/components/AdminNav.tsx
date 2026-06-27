"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminDeconnexionAction } from "@/app/actions/admin/auth";
import { useState } from "react";

interface Props {
  nomInstitut: string;
  couleurPrincipale: string;
  userEmail: string;
  pendingCount: number;
}

const NAV = [
  {
    href: "/admin/clientes",
    label: "Clientes",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    href: "/admin/demandes-creneau",
    label: "Demandes",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    badge: true,
  },
  {
    href: "/admin/forfaits",
    label: "Forfaits",
    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  },
  {
    href: "/admin/equipe",
    label: "Équipe",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    href: "/admin/parametres",
    label: "Paramètres",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

export default function AdminNav({ nomInstitut, couleurPrincipale, userEmail, pendingCount }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-slate-200 shadow-sm h-14 flex items-center">
      <div className="w-full px-4 flex items-center gap-4">
        {/* Logo */}
        <Link href="/admin/clientes" className="flex items-center gap-2 shrink-0 mr-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: couleurPrincipale }}
          >
            A
          </div>
          <span className="font-semibold text-slate-700 text-sm hidden sm:block">
            {nomInstitut}
          </span>
          <span className="text-xs text-slate-400 hidden sm:block">— Admin</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV.map(({ href, label, icon, badge }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
                style={active ? { background: couleurPrincipale } : {}}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" aria-hidden>
                  <path d={icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {label}
                {badge && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Spacer + user */}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden lg:block">{userEmail}</span>
          <Link
            href="/"
            target="_blank"
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors hidden md:block"
          >
            Voir le site ↗
          </Link>
          <form action={adminDeconnexionAction}>
            <button className="text-xs text-slate-500 hover:text-red-500 transition-colors font-medium px-2 py-1 rounded">
              Déconnexion
            </button>
          </form>
          {/* Burger mobile */}
          <button
            className="md:hidden p-1.5 rounded text-slate-500"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-14 inset-x-0 bg-white border-b border-slate-200 shadow-lg px-4 py-3 flex flex-col gap-1">
          {NAV.map(({ href, label, badge }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium"
              onClick={() => setOpen(false)}
            >
              {label}
              {badge && pendingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
