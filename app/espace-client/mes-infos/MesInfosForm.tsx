"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { mettreAJourInfosAction, type MesInfosState } from "@/app/actions/mes-infos";
import type { ClienteProfile } from "@/lib/queries/cliente";

const initial: MesInfosState = { status: "idle" };

export default function MesInfosForm({
  cliente,
  couleurPrincipale,
}: {
  cliente: ClienteProfile;
  couleurPrincipale: string;
  couleurSecondaire: string;
}) {
  const [state, action] = useFormState(mettreAJourInfosAction, initial);

  return (
    <form action={action} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
      <h2 className="font-semibold text-gray-700 text-sm">Coordonnées</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="prenom"
          name="prenom"
          label="Prénom"
          defaultValue={cliente.prenom}
          couleurPrincipale={couleurPrincipale}
        />
        <FormField
          id="nom"
          name="nom"
          label="Nom"
          defaultValue={cliente.nom}
          couleurPrincipale={couleurPrincipale}
        />
      </div>

      <FormField
        id="telephone"
        name="telephone"
        label="Téléphone"
        type="tel"
        defaultValue={cliente.telephone ?? ""}
        placeholder="06 00 00 00 00"
        couleurPrincipale={couleurPrincipale}
      />

      {/* Email en lecture seule (lié au compte Supabase Auth) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          Adresse e-mail
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <span className="text-sm text-gray-500">{cliente.email}</span>
          <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            Non modifiable
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Pour changer d&apos;adresse e-mail, contactez l&apos;institut.
        </p>
      </div>

      {/* Feedback */}
      {state.status === "success" && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-xl px-4 py-3">
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-none stroke-current" strokeWidth="2.5" aria-hidden>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Vos informations ont été mises à jour.
        </div>
      )}
      {state.status === "error" && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {state.message}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <SaveButton />
      </div>
    </form>
  );
}

function FormField({
  id,
  name,
  label,
  defaultValue,
  type = "text",
  placeholder,
  couleurPrincipale,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
  couleurPrincipale: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 transition-shadow"
        style={{ "--tw-ring-color": `${couleurPrincipale}60` } as React.CSSProperties}
      />
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary px-6 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Enregistrement…" : "Enregistrer"}
    </button>
  );
}
