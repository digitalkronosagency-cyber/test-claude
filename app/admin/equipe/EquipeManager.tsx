"use client";

import { useFormState, useFormStatus } from "react-dom";
import { sauvegarderEquipeAction, toggleEquipeActifAction } from "@/app/actions/admin/equipe";
import { useState, useEffect, useRef } from "react";
import type { EquipeRow } from "@/lib/queries/admin";

const initial = { status: "idle" as const };

interface Props {
  equipe: EquipeRow[];
  couleurPrincipale: string;
}

export default function EquipeManager({ equipe, couleurPrincipale }: Props) {
  const [editId, setEditId] = useState<string | "new" | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {equipe.map((e) => (
        <div
          key={e.id}
          className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
            e.actif ? "border-slate-200" : "border-dashed border-slate-200 opacity-60"
          }`}
        >
          <div className="px-5 py-4 flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: `${couleurPrincipale}${e.actif ? "dd" : "60"}` }}
            >
              {e.nom.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-800 text-sm">{e.nom}</p>
                {!e.actif && (
                  <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">Inactive</span>
                )}
              </div>
              {e.presentation && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{e.presentation}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setEditId(editId === e.id ? null : e.id)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium"
              >
                {editId === e.id ? "Annuler" : "Modifier"}
              </button>
              <form action={toggleEquipeActifAction}>
                <input type="hidden" name="id" value={e.id} />
                <input type="hidden" name="actif" value={String(e.actif)} />
                <button
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    e.actif
                      ? "border border-red-200 text-red-500 hover:bg-red-50"
                      : "border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {e.actif ? "Désactiver" : "Réactiver"}
                </button>
              </form>
            </div>
          </div>

          {editId === e.id && (
            <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
              <EquipeForm membre={e} couleurPrincipale={couleurPrincipale} onSuccess={() => setEditId(null)} />
            </div>
          )}
        </div>
      ))}

      {/* Nouveau membre */}
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
          Ajouter une esthéticienne
        </button>
        {editId === "new" && (
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
            <EquipeForm couleurPrincipale={couleurPrincipale} onSuccess={() => setEditId(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

function EquipeForm({
  membre,
  couleurPrincipale,
  onSuccess,
}: {
  membre?: EquipeRow;
  couleurPrincipale: string;
  onSuccess: () => void;
}) {
  const [state, action] = useFormState(sauvegarderEquipeAction, initial);
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
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      {membre && <input type="hidden" name="id" value={membre.id} />}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-600">Nom complet <span className="text-red-400">*</span></label>
        <input name="nom" required defaultValue={membre?.nom} placeholder="Sophie Martin" className={cls} style={ring} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-600">Présentation</label>
        <textarea name="presentation" rows={3} defaultValue={membre?.presentation ?? ""} placeholder="Courte biographie…" className={`${cls} resize-none`} style={ring} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-600">URL photo (optionnel)</label>
        <input name="photo_url" type="url" defaultValue={membre?.photo_url ?? ""} placeholder="https://…" className={cls} style={ring} />
      </div>

      {state.status === "error" && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{state.message}</p>
      )}

      <div className="flex justify-end">
        <SaveBtn couleurPrincipale={couleurPrincipale} isNew={!membre} />
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
      {pending ? "Enregistrement…" : isNew ? "Ajouter" : "Enregistrer"}
    </button>
  );
}
