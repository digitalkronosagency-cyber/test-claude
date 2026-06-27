import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = await updateSupabaseSession(request);
  const { pathname } = request.nextUrl;

  // Routes publiques dans /espace-client (pas de protection)
  const PUBLIC_EC = ["/espace-client/connexion"];
  const isEspaceClient = pathname.startsWith("/espace-client");
  const isPublicEc = PUBLIC_EC.some((p) => pathname.startsWith(p));

  if (isEspaceClient && !isPublicEc) {
    // Vérifier la session
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/espace-client/connexion";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Déjà connectée → redirige depuis /connexion vers tableau-de-bord
  if (pathname.startsWith("/espace-client/connexion")) {
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = "/espace-client/tableau-de-bord";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
