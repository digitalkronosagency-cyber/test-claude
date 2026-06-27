"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { connexionAction, type AuthState } from "@/app/actions/auth";
import Link from "next/link";

const initial: AuthState = { status: "idle" };

export default function ConnexionPage() {
  const [state, action] = useFormState(connexionAction, initial);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-16"
      style={{ background: "var(--color-secondary)" }}
    >
      <div className="w-full max-w-sm">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4"
            style={{ background: "var(--color-primary)" }}
          >
            ✦
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Espace client</h1>
          <p className="text-sm text-gray-500 mt-1">
            Connectez-vous pour accéder à vos forfaits
          </p>
        </div>

        {/* Card formulaire */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form action={action} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Adresse e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="votre@email.fr"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 transition-shadow"
                style={{ "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 transition-shadow"
                style={{ "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
              />
            </div>

            {state.status === "error" && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                {state.message}
              </div>
            )}

            <SubmitBtn />
          </form>
        </div>

        <Link
          href="/"
          className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors mt-6"
        >
          ← Retour au site
        </Link>
      </div>
    </div>
  );
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full py-3.5 text-sm font-semibold mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Connexion…
        </span>
      ) : (
        "Se connecter"
      )}
    </button>
  );
}
