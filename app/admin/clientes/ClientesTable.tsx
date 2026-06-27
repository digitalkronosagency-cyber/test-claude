"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

interface ClienteRow {
  id: string;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string | null;
  forfaitsActifs: number;
  seancesTotales: number;
  alerteSeances: boolean;
  alerteExpiration: boolean;
}

interface Props {
  clientes: ClienteRow[];
  couleurPrincipale: string;
}

export default function ClientesTable({ clientes, couleurPrincipale }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        c.nom.toLowerCase().includes(q) ||
        c.prenom.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q)
    );
  }, [clientes, search]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Barre de recherche */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="relative max-w-xs">
          <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 fill-none stroke-current" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 transition-shadow"
            style={{ "--tw-ring-color": `${couleurPrincipale}40` } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Cliente</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden md:table-cell">Contact</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Forfaits actifs</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Séances restantes</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400 text-sm">
                  Aucune cliente trouvée
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: couleurPrincipale }}
                      >
                        {c.prenom[0]}{c.nom[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{c.prenom} {c.nom}</p>
                        <div className="flex gap-1.5 mt-0.5">
                          {c.alerteExpiration && (
                            <span className="text-[10px] font-semibold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                              ⏳ Expiration
                            </span>
                          )}
                          {c.alerteSeances && (
                            <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                              ⚠ 1 séance
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <p className="text-slate-600">{c.email ?? "—"}</p>
                    <p className="text-slate-400 text-xs">{c.telephone ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {c.forfaitsActifs > 0 ? (
                      <span
                        className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                        style={{ background: couleurPrincipale }}
                      >
                        {c.forfaitsActifs}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-sm font-bold ${c.seancesTotales === 0 ? "text-slate-300" : c.seancesTotales <= 2 ? "text-amber-600" : "text-slate-700"}`}>
                      {c.seancesTotales > 0 ? c.seancesTotales : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/admin/clientes/${c.id}`}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
                    >
                      Voir →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
