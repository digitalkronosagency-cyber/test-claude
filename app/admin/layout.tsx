import { getSession } from "@/lib/session";
import { isAdmin, countDemandesEnAttente } from "@/lib/queries/admin";
import { config } from "@/lib/config";
import { redirect } from "next/navigation";
import AdminNav from "./components/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session.adminEmail) return <>{children}</>;

  const ok = await isAdmin(session.adminEmail);
  if (!ok) redirect("/admin/connexion?error=unauthorized");

  const pendingCount = await countDemandesEnAttente();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminNav
        nomInstitut={config.institut.nom}
        couleurPrincipale={config.branding.couleurPrincipale}
        userEmail={session.adminEmail}
        pendingCount={pendingCount}
      />
      <div className="flex flex-1 pt-14">
        <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
