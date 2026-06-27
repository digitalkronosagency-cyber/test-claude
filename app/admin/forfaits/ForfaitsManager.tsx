"use client";

import { useFormState, useFormStatus } from "react-dom";
import { sauvegarderForfaitAction, toggleForfaitActifAction } from "@/app/actions/admin/catalogue";
import { useState, useEffect, useRef } from "react";
import type { ForfaitCatalogueRow } from "@/lib/queries/admin";

const initial = { status: "idle" as const };

interface Props {
  forfaits: ForfaitCatalogueRow[];
  couleurPrincipale: string;
}

function validiteLabel(j: number) {
  if (j >= 365 && j % 365 === 0) return `${j / 365} an${j / 365 > 1 ? "s" : ""}`;
  if (j >= 30) return `${Math.round(j / 30)} mois`;
  return `${j} jours`;
}

export default function ForfaitsManager({ forfaits, couleurPrincipale }: Props) {
  const [editId, setEditId] = useState<string | "new" | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {/* Liste */}
      {forfaits.map((f) => (
        <div
          key={f.id}
          className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
            f.actif ? "border-slate-200" : "border-dashed border-slate-200 opacity-60"
          }`}
        >
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-800 text-sm">{f.nom}</p>
                {!f.actif && (
                  <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">Désactivé</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {f.nombre_seances_total} séances · {f.prix.toFixed(0)} € ·{" "}
                {validiteLabel(f.duree_validite_jours)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setEditId(editId === f.id ? null : f.id)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium"
              >
                {editId === f.id ? "Annuler" : "Modifier"}
              </button>
              <form action={toggleForfaitActifAction}>
                <input type="hidden" name="id" value={f.id} />
                <input type="hidden" name="actif" value={String(f.actif)} />
                <button
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    f.actif
                      ? "border border-red-200 text-red-500 hover:bg-red-50"
                      : "border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {f.actif ? "Désactiver" : "Réactiver"}
                </button>
              </form>
            </div>
          </div>

          {/* Formulaire d'édition inline */}
          {editId === f.id && (
            <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
              <ForfaitForm
                forfait={f}
                couleurPrincipale={couleurPrincipale}
                onSuccess={() => setEditId(null)}
              />
            </div>
          )}
        </div>
      ))}

      {/* Nouveau forfait */}
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm overflow-hidden">
        <button
          onClick={() => setEditId(editId === "new" ? null : "new")}
          className="w-full px-5 py-4 flex items-center gap-3 text-sm text-slate-500 hover:bg-slate-50 transition-colors font-medium"
        >
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-lg leading-none"
            style={{ background: couleurPrincipale }}
          >
            +
          </span>
          Créer un nouveau forfait
        </button>
        {editId === "new" && (
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
            <ForfaitForm
              couleurPrincipale={couleurPrincipale}
              onSuccess={() => setEditId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Formulaire forfait ────────────────────────────────────────────────────────

function ForfaitForm({
  forfait,
  couleurPrincipale,
  onSuccess,
}: {
  forfait?: ForfaitCatalogueRow;
  couleurPrincipale: string;
  onSuccess: () => void;
}) {
  const [state, action] = useFormState(sauvegarderForfaitAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      onSuccess();
    }
  }, [state.status, onSuccess]);

  const ring = { "--tw-ring-color": `${couleurPrincipale}40` } as React.CSSProperties;
  const cls = "rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 transition-shadow w-full";

  return (
    <form ref={formRef} action={action} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {forfait && <input type="hidden" name="id" value={forfait.id} />}

      <div className="sm:col-span-2 flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-600">Nom du forfait</label>
        <input name="nom" required defaultValue={forfait?.nom} placeholder="Pack épilation jambes 6 séances" className={cls} style={ring} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-600">Nombre de séances</label>
        <input name="nombre_seances_total" type="number" min="1" required defaultValue={forfait?.nombre_seances_total} placeholder="6" className={cls} style={ring} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-600">Prix (€)</label>
        <input name="prix" type="number" step="0.01" min="0" required defaultValue={forfait?.prix} placeholder="480" className={cls} style={ring} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-600">Validité (jours)</label>
        <input name="duree_validite_jours" type="number" min="1" required defaultValue={forfait?.duree_validite_jours} placeholder="365" className={cls} style={ring} />
      </div>

      {state.status === "error" && (
        <p className="sm:col-span-2 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {state.message}
        </p>
      )}

      <div className="sm:col-span-2 flex justify-end gap-2">
        <SaveBtn couleurPrincipale={couleurPrincipale} isNew={!forfait} />
      </div>
    </form>
  );
}

function SaveBtn({ couleurPrincipale, isNew }: { couleurPrincipale: string; isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit" disabled={pending}
      className="px-5 py-2 rounded-xl text-white text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
      style={{ background: couleurPrincipale }}
    >
      {pending ? "Enregistrement…" : isNew ? "Créer le forfait" : "Enregistrer"}
    </button>
  );
}
