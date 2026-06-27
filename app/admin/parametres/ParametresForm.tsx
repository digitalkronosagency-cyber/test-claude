"use client";

import { useFormState, useFormStatus } from "react-dom";
import { sauvegarderParametresAction, type ParamState } from "@/app/actions/admin/parametres";

const initial: ParamState = { status: "idle" };

interface Params {
  id: string;
  sms_active: boolean;
  parrainage_actif: boolean;
  recompense_parrainage: string | null;
  lien_avis_google: string | null;
}

export default function ParametresForm({
  params,
  couleurPrincipale,
}: {
  params: Params;
  couleurPrincipale: string;
}) {
  const [state, action] = useFormState(sauvegarderParametresAction, initial);

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Toggles */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        <ToggleField
          name="sms_active"
          label="SMS de rappel"
          description="Envoie un SMS automatique 24h avant chaque rendez-vous confirmé."
          defaultChecked={params.sms_active}
          couleurPrincipale={couleurPrincipale}
        />
        <ToggleField
          name="parrainage_actif"
          label="Programme de parrainage"
          description="Permet aux clientes de parrainer leurs proches et d'obtenir une récompense."
          defaultChecked={params.parrainage_actif}
          couleurPrincipale={couleurPrincipale}
        />
      </div>

      {/* Champs texte */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="recompense" className="text-sm font-medium text-slate-700">
            Récompense de parrainage
          </label>
          <input
            id="recompense" name="recompense_parrainage" type="text"
            defaultValue={params.recompense_parrainage ?? ""}
            placeholder="Une séance offerte pour tout parrainage validé"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 transition-shadow"
            style={{ "--tw-ring-color": `${couleurPrincipale}40` } as React.CSSProperties}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="google" className="text-sm font-medium text-slate-700">
            Lien Google Avis
          </label>
          <input
            id="google" name="lien_avis_google" type="url"
            defaultValue={params.lien_avis_google ?? ""}
            placeholder="https://g.page/votre-institut/review"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 transition-shadow"
            style={{ "--tw-ring-color": `${couleurPrincipale}40` } as React.CSSProperties}
          />
          <p className="text-xs text-slate-400">Ce lien apparaît sur la page vitrine et dans l&apos;espace client.</p>
        </div>
      </div>

      {/* Feedback */}
      {state.status === "success" && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-2xl px-5 py-3 font-medium">
          ✓ Paramètres enregistrés.
        </div>
      )}
      {state.status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-3">
          {state.message}
        </div>
      )}

      <div className="flex justify-end">
        <SaveBtn couleurPrincipale={couleurPrincipale} />
      </div>
    </form>
  );
}

function ToggleField({
  name, label, description, defaultChecked, couleurPrincipale,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
  couleurPrincipale: string;
}) {
  return (
    <label className="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <div className="relative shrink-0 mt-0.5">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="sr-only peer" />
        <div
          className="w-10 h-5 rounded-full bg-slate-200 peer-checked:bg-opacity-100 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
          style={{ "--tw-bg-opacity": "1" } as React.CSSProperties}
        />
        {/* Overlay coloré quand checked */}
        <div
          className="absolute inset-0 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
          style={{ background: couleurPrincipale }}
        />
      </div>
    </label>
  );
}

function SaveBtn({ couleurPrincipale }: { couleurPrincipale: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit" disabled={pending}
      className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
      style={{ background: couleurPrincipale }}
    >
      {pending ? "Enregistrement…" : "Enregistrer les paramètres"}
    </button>
  );
}
