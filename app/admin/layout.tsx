import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin, countDemandesEnAttente } from "@/lib/queries/admin";
import { config } from "@/lib/config";
import { redirect } from "next/navigation";
import AdminNav from "./components/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Page connexion : pas de chrome admin
  // (le middleware redirige les non-connectés vers /admin/connexion)
  if (!user) return <>{children}</>;

  const ok = await isAdmin(user.email ?? "");
  if (!ok) redirect("/admin/connexion?error=unauthorized");

  const pendingCount = await countDemandesEnAttente();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminNav
        nomInstitut={config.institut.nom}
        couleurPrincipale={config.branding.couleurPrincipale}
        userEmail={user.email ?? ""}
        pendingCount={pendingCount}
      />
      <div className="flex flex-1 pt-14">
        {/* Main content */}
        <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
