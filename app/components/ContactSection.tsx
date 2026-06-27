"use client";

import { useFormState } from "react-dom";
import { useRef, useEffect } from "react";
import {
  soumettreDemandeCreneauAction,
  type DemandeCreneauState,
} from "@/app/actions/demande-creneau";

interface ContactSectionProps {
  adresse: string;
  telephone: string;
  email: string;
  horaires: string;
  couleurPrincipale: string;
  couleurSecondaire: string;
}

const initialState: DemandeCreneauState = { status: "idle" };

export default function ContactSection({
  adresse,
  telephone,
  email,
  horaires,
  couleurPrincipale,
  couleurSecondaire,
}: ContactSectionProps) {
  const [state, action] = useFormState(
    soumettreDemandeCreneauAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Reset le formulaire après un succès
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <section id="contact" className="py-24 px-5 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{ color: couleurPrincipale, background: `${couleurPrincipale}18` }}
          >
            Prenons contact
          </span>
          <h2 className="section-title text-gray-800">Demander un créneau</h2>
          <p className="section-subtitle">
            Remplissez le formulaire et nous vous rappelons sous 24 h pour confirmer votre rendez-vous.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Informations pratiques */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <InfoCard
              icon={<PinIcon />}
              label="Adresse"
              value={adresse}
              couleur={couleurPrincipale}
              couleurSecondaire={couleurSecondaire}
            />
            <InfoCard
              icon={<PhoneIcon />}
              label="Téléphone"
              value={telephone}
              href={`tel:${telephone.replace(/\s/g, "")}`}
              couleur={couleurPrincipale}
              couleurSecondaire={couleurSecondaire}
            />
            <InfoCard
              icon={<MailIcon />}
              label="E-mail"
              value={email}
              href={`mailto:${email}`}
              couleur={couleurPrincipale}
              couleurSecondaire={couleurSecondaire}
            />
            {horaires && (
              <InfoCard
                icon={<ClockIcon />}
                label="Horaires"
                value={horaires}
                couleur={couleurPrincipale}
                couleurSecondaire={couleurSecondaire}
              />
            )}
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-3">
            {state.status === "success" ? (
              <SuccessMessage couleurPrincipale={couleurPrincipale} couleurSecondaire={couleurSecondaire} />
            ) : (
              <form
                ref={formRef}
                action={action}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 sm:p-8 flex flex-col gap-5"
              >
                <Field
                  id="nom"
                  name="nom"
                  label="Votre nom"
                  type="text"
                  placeholder="Marie Dupont"
                  required
                  couleurPrincipale={couleurPrincipale}
                />
                <Field
                  id="telephone"
                  name="telephone"
                  label="Numéro de téléphone"
                  type="tel"
                  placeholder="06 00 00 00 00"
                  required
                  couleurPrincipale={couleurPrincipale}
                />
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="disponibilite"
                    className="text-sm font-medium text-gray-700"
                  >
                    Disponibilité souhaitée
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <textarea
                    id="disponibilite"
                    name="disponibilite"
                    rows={3}
                    required
                    placeholder="Ex : mardi ou jeudi après-midi, semaine du 10 au 14…"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none focus:ring-2 transition-shadow"
                    style={{ "--tw-ring-color": `${couleurPrincipale}60` } as React.CSSProperties}
                  />
                </div>

                {/* Message d'erreur */}
                {state.status === "error" && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {state.message}
                  </p>
                )}

                <SubmitButton />

                <p className="text-xs text-center text-gray-400">
                  Nous vous recontactons sous 24 h pour confirmer votre créneau.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Sous-composants ────────────────────────────────────────────────────────

function SubmitButton() {
  // useFormStatus doit être dans un composant enfant du <form>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useFormStatus } = require("react-dom") as typeof import("react-dom");
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full py-3.5 text-base mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <SpinnerIcon />
          Envoi en cours…
        </span>
      ) : (
        "Envoyer ma demande"
      )}
    </button>
  );
}

function Field({
  id,
  name,
  label,
  type,
  placeholder,
  required,
  couleurPrincipale,
}: {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  couleurPrincipale: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 transition-shadow"
        style={{ "--tw-ring-color": `${couleurPrincipale}60` } as React.CSSProperties}
      />
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  href,
  couleur,
  couleurSecondaire,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  couleur: string;
  couleurSecondaire: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <span
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `${couleur}18`, color: couleur }}
      >
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
          {label}
        </p>
        <p className="text-sm text-gray-700 leading-snug">{value}</p>
      </div>
    </div>
  );

  return (
    <div
      className="rounded-2xl p-5 border border-gray-100"
      style={{ background: couleurSecondaire }}
    >
      {href ? (
        <a href={href} className="hover:opacity-70 transition-opacity">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

function SuccessMessage({
  couleurPrincipale,
  couleurSecondaire,
}: {
  couleurPrincipale: string;
  couleurSecondaire: string;
}) {
  return (
    <div
      className="rounded-2xl border border-gray-100 p-10 flex flex-col items-center text-center gap-5 h-full justify-center"
      style={{ background: couleurSecondaire }}
    >
      <span
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: `${couleurPrincipale}20` }}
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" strokeWidth="2.5" aria-hidden>
          <path
            d="M5 13l4 4L19 7"
            stroke={couleurPrincipale}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Demande envoyée !</h3>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          Merci ! Nous avons bien reçu votre demande de créneau et vous recontacterons
          dans les 24 heures pour confirmer.
        </p>
      </div>
    </div>
  );
}

// ── Icônes SVG ─────────────────────────────────────────────────────────────

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="w-4 h-4 animate-spin fill-none stroke-white" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
