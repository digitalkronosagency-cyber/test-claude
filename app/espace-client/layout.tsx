import { config } from "@/lib/config";
import { getSession } from "@/lib/session";
import EspaceClientNav from "./components/EspaceClientNav";

export default async function EspaceClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.clienteId) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen" style={{ background: config.branding.couleurSecondaire }}>
      <EspaceClientNav
        nomInstitut={config.institut.nom}
        couleurPrincipale={config.branding.couleurPrincipale}
        userEmail={session.clienteEmail ?? ""}
      />
      <main className="pt-16 min-h-screen">{children}</main>
    </div>
  );
}
