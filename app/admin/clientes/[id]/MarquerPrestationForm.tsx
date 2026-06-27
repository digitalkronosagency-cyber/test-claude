"use client";

import { useFormState, useFormStatus } from "react-dom";
import { marquerPrestationAction, type PrestationState } from "@/app/actions/admin/prestations";
import { useEffect, useRef } from "react";

const initial: PrestationState = { status: "idle" };

interface Props {
  clienteId: string;
  forfaits: { id: string; nom: string; restantes: number }[];
  estheticiennes: string[];
  couleurPrincipale: string;
}

export default function MarquerPrestationForm({ clienteId, forfaits, estheticiennes, couleurPrincipale }: Props) {
  const [state, action] = useFormState(marquerPrestationAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <input type="hidden" name="cliente_id" value={clienteId} />

      {/* Forfait */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="forfait_cliente_id" className="text-sm font-medium text-slate-700">
          Forfait <span className="text-red-400">*</span>
        </label>
        <select
          id="forfait_cliente_id" name="forfait_cliente_id" required
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 transition-shadow bg-white"
          style={{ "--tw-ring-color": `${couleurPrincipale}40` } as React.CSSProperties}
        >
          {forfaits.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nom} ({f.restantes} séance{f.restantes > 1 ? "s" : ""} restante{f.restantes > 1 ? "s" : ""})
            </option>
          ))}
        </select>
      </div>

      {/* Esthéticienne */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="estheticienne" className="text-sm font-medium text-slate-700">
          Esthéticienne <span className="text-red-400">*</span>
        </label>
        <select
          id="estheticienne" name="estheticienne" required
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 transition-shadow bg-white"
          style={{ "--tw-ring-color": `${couleurPrincipale}40` } as React.CSSProperties}
        >
          <option value="">— Sélectionner —</option>
          {estheticiennes.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="date_prestation" className="text-sm font-medium text-slate-700">Date</label>
        <input
          id="date_prestation" name="date_prestation" type="date"
          defaultValue={today} max={today}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 transition-shadow"
          style={{ "--tw-ring-color": `${couleurPrincipale}40` } as React.CSSProperties}
        />
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-slate-700">Notes (optionnel)</label>
        <textarea
          id="notes" name="notes" rows={2}
          placeholder="Observations, produits utilisés…"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 resize-none transition-shadow"
          style={{ "--tw-ring-color": `${couleurPrincipale}40` } as React.CSSProperties}
        />
      </div>

      {/* Feedback */}
      {state.status === "success" && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 font-medium">
          ✓ {state.message}
        </div>
      )}
      {state.status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {state.message}
        </div>
      )}

      <SubmitBtn couleurPrincipale={couleurPrincipale} />
    </form>
  );
}

function SubmitBtn({ couleurPrincipale }: { couleurPrincipale: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit" disabled={pending}
      className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ background: couleurPrincipale }}
    >
      {pending ? "Enregistrement…" : "✓ Marquer la prestation effectuée"}
    </button>
  );
}
