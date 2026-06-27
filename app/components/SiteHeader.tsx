"use client";

import { useState, useEffect } from "react";

interface SiteHeaderProps {
  nom: string;
  couleurPrincipale: string;
}

const NAV_LINKS = [
  { href: "#prestations", label: "Prestations" },
  { href: "#forfaits", label: "Forfaits" },
  { href: "#equipe", label: "Équipe" },
  { href: "#contact", label: "Contact" },
];

export default function SiteHeader({ nom, couleurPrincipale }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo + nom */}
        <a href="#" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: couleurPrincipale }}
            aria-hidden
          >
            {nom.charAt(0)}
          </div>
          <span className="font-semibold text-gray-800 text-sm sm:text-base leading-tight hidden sm:block">
            {nom}
          </span>
        </a>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              {label}
            </a>
          ))}
          <a href="#contact" className="btn-primary text-xs py-2 px-5">
            Prendre rendez-vous
          </a>
        </nav>

        {/* Burger mobile */}
        <button
          className="md:hidden p-2 -mr-1 rounded-lg text-gray-600"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
        >
          <span className="block w-5 h-px bg-current mb-1.5 transition-all" />
          <span className="block w-5 h-px bg-current mb-1.5 transition-all" />
          <span className="block w-5 h-px bg-current transition-all" />
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-gray-700 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn-primary text-center text-xs py-2.5"
            onClick={() => setMenuOpen(false)}
          >
            Prendre rendez-vous
          </a>
        </div>
      )}
    </header>
  );
}
