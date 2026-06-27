"use client";

import { useFormState, useFormStatus } from "react-dom";
import { adminConnexionAction, type AdminAuthState } from "@/app/actions/admin/auth";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const initial: AdminAuthState = { status: "idle" };

function ConnexionForm() {
  const [state, action] = useFormState(adminConnexionAction, initial);
  const params = useSearchParams();
  const unauthorized = params.get("error") === "unauthorized";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white text-lg font-bold mx-auto mb-4">
            ⚙
          </div>
          <h1 className="text-xl font-bold text-slate-800">Back-office</h1>
          <p className="text-sm text-slate-500 mt-1">Espace réservé à la gérante</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {unauthorized && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              Ce compte n&apos;a pas accès au back-office.
            </div>
          )}

          <form action={action} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
              <input
                id="email" name="email" type="email" autoComplete="email" required
                placeholder="gerante@belle-epoque.fr"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-400 transition-shadow"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">Mot de passe</label>
              <input
                id="password" name="password" type="password" autoComplete="current-password" required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-400 transition-shadow"
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
      </div>
    </div>
  );
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit" disabled={pending}
      className="w-full py-3 rounded-xl bg-slate-800 text-white text-sm font-semibold mt-1 hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Connexion…" : "Se connecter"}
    </button>
  );
}

export default function AdminConnexionPage() {
  return (
    <Suspense>
      <ConnexionForm />
    </Suspense>
  );
}
